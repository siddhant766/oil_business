<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    private function authorizeAdmin()
    {
        $user = auth()->user();
        if (!$user || !$user instanceof Admin) {
            return false;
        }
        return true;
    }

    // GET /api/v1/admin/customers
    public function getAllCustomers()
    {
        if (!$this->authorizeAdmin()) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        try {
            $customers = User::where('is_deleted', false)->orderBy('created_at', 'desc')->get();
            return response()->json([
                'success' => true,
                'count' => $customers->count(),
                'data' => $customers
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // POST /api/v1/admin/register
    public function registerAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        try {
            $email = $request->input('email');
            
            $adminExists = Admin::where('email', $email)->first();
            if ($adminExists) {
                return response()->json(['success' => false, 'message' => 'Admin already exists'], 400);
            }

            $admin = Admin::create([
                'name' => $request->input('name'),
                'email' => $email,
                'password' => Hash::make($request->input('password')),
                'role' => $request->input('role', 'Order Staff')
            ]);

            $token = $admin->createToken('admin_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'token' => $token,
                'admin' => [
                    'id' => (string) $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                    'role' => $admin->role
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // POST /api/v1/admin/login
    public function loginAdmin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        try {
            $email = $request->input('email');
            $password = $request->input('password');

            $admin = Admin::where('email', $email)->where('is_deleted', false)->first();
            if (!$admin || !Hash::check($password, $admin->password)) {
                return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
            }

            $token = $admin->createToken('admin_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'token' => $token,
                'admin' => [
                    'id' => (string) $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                    'role' => $admin->role
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // GET /api/v1/admin/me
    public function getMe()
    {
        $admin = auth()->user();
        if (!$admin || !$admin instanceof Admin) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        return response()->json([
            'success' => true,
            'data' => $admin
        ], 200);
    }

    // GET /api/v1/admin/analytics
    public function getAnalytics()
    {
        if (!$this->authorizeAdmin()) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        try {
            $totalOrders = Order::count();
            $totalCustomers = User::where('is_deleted', false)->count();
            $totalProducts = Product::where('is_deleted', false)->count();

            // Calculate Revenue (Only non-cancelled orders)
            $revenue = Order::where('status', '!=', 'Cancelled')->sum('total_amount');

            // Best selling product sizes (aggregated from order items)
            $topProductsRaw = OrderItem::select('name', DB::raw('SUM(quantity) as totalQuantity'), DB::raw('SUM(quantity * price) as revenue'))
                ->groupBy('name')
                ->orderBy('totalQuantity', 'desc')
                ->limit(5)
                ->get();

            $topProducts = [];
            foreach ($topProductsRaw as $item) {
                $topProducts[] = [
                    '_id' => $item->name,
                    'totalQuantity' => (int) $item->totalQuantity,
                    'revenue' => (double) $item->revenue
                ];
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'totalOrders' => $totalOrders,
                    'totalCustomers' => $totalCustomers,
                    'totalProducts' => $totalProducts,
                    'revenue' => (double) $revenue,
                    'topProducts' => $topProducts
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // POST /api/v1/admin/orders
    public function createManualOrder(Request $request)
    {
        if (!$this->authorizeAdmin()) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        $request->validate([
            'userId' => 'required',
            'items' => 'required|array',
            'totalAmount' => 'required',
            'shippingAddress' => 'required|array'
        ]);

        try {
            $userId = $request->input('userId');
            $user = User::where('is_deleted', false)->find($userId);

            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Please provide a valid user ID for manual order'], 400);
            }

            // Create Order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => (double) $request->input('totalAmount'),
                'shipping_address' => $request->input('shippingAddress'),
                'status' => 'Admin Approved', // Pre-approved as it is administrative entry
                'payment_method' => 'COD',
                'admin_notes' => $request->input('adminNotes')
            ]);

            // Create Order Items
            foreach ($request->input('items') as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product'],
                    'variant_id' => (string) $item['variantId'],
                    'name' => $item['name'],
                    'size' => $item['size'],
                    'quantity' => (int) $item['quantity'],
                    'price' => (double) $item['price']
                ]);
            }

            $order->load('itemsRelation');

            return response()->json([
                'success' => true,
                'data' => $order
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
