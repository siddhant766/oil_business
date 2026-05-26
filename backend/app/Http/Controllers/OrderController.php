<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    private function authorizeAdmin()
    {
        $user = auth()->user();
        if (!$user || !$user instanceof \App\Models\Admin) {
            return false;
        }
        return true;
    }

    // POST /api/v1/orders (Customer)
    public function createOrder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'totalAmount' => 'required',
            'shippingAddress' => 'required|array'
        ]);

        try {
            $user = auth()->user();
            if (!$user || !$user instanceof \App\Models\User) {
                return response()->json(['success' => false, 'message' => 'Not authorized as customer'], 401);
            }

            // Create Order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => (double) $request->input('totalAmount'),
                'shipping_address' => $request->input('shippingAddress'),
                'status' => 'Placed',
                'payment_method' => 'COD',
                'customer_notes' => $request->input('customerNotes')
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

            // Eager load items for response
            $order->load('itemsRelation');

            return response()->json([
                'success' => true,
                'data' => $order
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // GET /api/v1/orders/myorders (Customer)
    public function getMyOrders()
    {
        try {
            $user = auth()->user();
            if (!$user || !$user instanceof \App\Models\User) {
                return response()->json(['success' => false, 'message' => 'Not authorized as customer'], 401);
            }

            $orders = Order::where('user_id', $user->id)
                ->with(['itemsRelation.productRelation']) // Populate product details like name and image
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'count' => $orders->count(),
                'data' => $orders
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // GET /api/v1/orders (Admin)
    public function getAllOrders()
    {
        if (!$this->authorizeAdmin()) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        try {
            $orders = Order::with(['userRelation', 'itemsRelation'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'count' => $orders->count(),
                'data' => $orders
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // PUT /api/v1/orders/:id/status (Admin)
    public function updateOrderStatus(Request $request, $id)
    {
        if (!$this->authorizeAdmin()) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        try {
            $newStatus = $request->input('status');
            $order = Order::with('itemsRelation')->findOrFail($id);
            $oldStatus = $order->status;

            // Inventory deduction logic
            if ($newStatus === 'Approved' && $oldStatus === 'Placed') {
                foreach ($order->itemsRelation as $item) {
                    $variant = ProductVariant::where('product_id', $item->product_id)->where('id', $item->variant_id)->first();
                    if ($variant) {
                        $variant->stock_quantity -= $item->quantity;
                        if ($variant->stock_quantity <= 0) {
                            $variant->stock_quantity = 0;
                            $variant->stock_status = 'Out of Stock';
                        } else if ($variant->stock_quantity < 10) {
                            $variant->stock_status = 'Low Stock';
                        } else {
                            $variant->stock_status = 'In Stock';
                        }
                        $variant->save();
                    }
                }
            }

            // Inventory restoration logic if cancelled
            if ($newStatus === 'Cancelled' && ($oldStatus === 'Approved' || $oldStatus === 'Packed')) {
                foreach ($order->itemsRelation as $item) {
                    $variant = ProductVariant::where('product_id', $item->product_id)->where('id', $item->variant_id)->first();
                    if ($variant) {
                        $variant->stock_quantity += $item->quantity;
                        if ($variant->stock_quantity <= 0) {
                            $variant->stock_status = 'Out of Stock';
                        } else if ($variant->stock_quantity < 10) {
                            $variant->stock_status = 'Low Stock';
                        } else {
                            $variant->stock_status = 'In Stock';
                        }
                        $variant->save();
                    }
                }
            }

            $order->update(['status' => $newStatus]);

            return response()->json([
                'success' => true,
                'data' => $order
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
