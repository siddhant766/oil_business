<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ProductController extends Controller
{
    private function authorizeAdmin()
    {
        $user = auth()->user();
        if (!$user || !$user instanceof \App\Models\Admin) {
            return false;
        }
        return true;
    }

    // GET /api/v1/products/admin/all
    public function getAllProductsAdmin()
    {
        if (!$this->authorizeAdmin()) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        try {
            // Populate category and variants
            $products = Product::where('is_deleted', false)
                ->with(['categoryRelation', 'variants'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'count' => $products->count(),
                'data' => $products
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // GET /api/v1/products
    public function getProducts(Request $request)
    {
        try {
            $query = Product::where('is_deleted', false)->where('status', 'Published');

            // Simple search by name or brand
            if ($request->has('search')) {
                $search = $request->query('search');
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('brand', 'like', '%' . $search . '%');
                });
            }

            // Populate category and variants
            $products = $query->with(['categoryRelation', 'variants'])->get();

            return response()->json([
                'success' => true,
                'count' => $products->count(),
                'data' => $products
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // GET /api/v1/products/:id
    public function getProduct($id)
    {
        try {
            $product = Product::where('id', $id)
                ->where('is_deleted', false)
                ->where('status', 'Published')
                ->with(['categoryRelation', 'variants'])
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'data' => $product
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }
    }

    // POST /api/v1/products
    public function createProduct(Request $request)
    {
        if (!$this->authorizeAdmin()) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        try {
            $data = $request->all();

            // Map frontend fields (camelCase to snake_case)
            $data['category_id'] = $request->input('category');
            $data['gst_percentage'] = $request->input('gstPercentage', 5);
            $data['is_featured'] = $request->input('isFeatured', false);
            $data['trending'] = $request->input('trending', false);
            $data['export_ready'] = $request->input('exportReady', false);
            $data['nutritional_info'] = $request->input('nutritionalInfo', '');
            $data['warehouse_location'] = $request->input('warehouseLocation', 'Delhi NCR');

            $product = Product::create($data);

            // Handle variants nesting
            if ($request->has('variants') && is_array($request->input('variants'))) {
                foreach ($request->input('variants') as $v) {
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'size' => $v['size'],
                        'price' => $v['price'],
                        'wholesale_price' => $v['wholesalePrice'] ?? $v['price'],
                        'sku' => $v['sku'],
                        'stock_status' => $v['stockStatus'] ?? 'In Stock',
                        'stock_quantity' => $v['stockQuantity'] ?? 0,
                        'dispatch_time' => $v['dispatchTime'] ?? '24-48 hrs'
                    ]);
                }
            }

            // Reload variants
            $product->load('variants');

            return response()->json([
                'success' => true,
                'data' => $product
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    // PUT /api/v1/products/:id
    public function updateProduct(Request $request, $id)
    {
        if (!$this->authorizeAdmin()) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        try {
            $product = Product::findOrFail($id);
            $data = $request->all();

            // Map frontend fields
            if ($request->has('category')) $data['category_id'] = $request->input('category');
            if ($request->has('gstPercentage')) $data['gst_percentage'] = $request->input('gstPercentage');
            if ($request->has('isFeatured')) $data['is_featured'] = $request->input('isFeatured');
            if ($request->has('trending')) $data['trending'] = $request->input('trending');
            if ($request->has('exportReady')) $data['export_ready'] = $request->input('exportReady');
            if ($request->has('nutritionalInfo')) $data['nutritional_info'] = $request->input('nutritionalInfo');
            if ($request->has('warehouseLocation')) $data['warehouse_location'] = $request->input('warehouseLocation');

            $product->update($data);

            // Handle variants sync (Mongoose subdocument behavior)
            if ($request->has('variants') && is_array($request->input('variants'))) {
                $incomingVariants = $request->input('variants');
                $keepVariantIds = [];

                foreach ($incomingVariants as $v) {
                    $variantId = $v['_id'] ?? $v['id'] ?? null;
                    
                    $vData = [
                        'size' => $v['size'],
                        'price' => $v['price'],
                        'wholesale_price' => $v['wholesalePrice'] ?? $v['price'],
                        'sku' => $v['sku'],
                        'stock_status' => $v['stockStatus'] ?? 'In Stock',
                        'stock_quantity' => $v['stockQuantity'] ?? 0,
                        'dispatch_time' => $v['dispatchTime'] ?? '24-48 hrs'
                    ];

                    if ($variantId) {
                        $variant = ProductVariant::where('product_id', $product->id)->find($variantId);
                        if ($variant) {
                            $variant->update($vData);
                            $keepVariantIds[] = $variant->id;
                            continue;
                        }
                    }

                    // Create new variant if not found or no ID
                    $newVariant = ProductVariant::create(array_merge(['product_id' => $product->id], $vData));
                    $keepVariantIds[] = $newVariant->id;
                }

                // Delete any variants not present in incoming array
                ProductVariant::where('product_id', $product->id)->whereNotIn('id', $keepVariantIds)->delete();
            }

            $product->load(['categoryRelation', 'variants']);

            return response()->json([
                'success' => true,
                'data' => $product
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    // DELETE /api/v1/products/:id
    public function deleteProduct($id)
    {
        if (!$this->authorizeAdmin()) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        try {
            $product = Product::findOrFail($id);
            $product->update(['is_deleted' => true]);
            return response()->json([
                'success' => true,
                'data' => (object)[]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }
    }

    // PUT /api/v1/products/:id/variants/:variantId/price
    public function updateVariantPrice(Request $request, $id, $variantId)
    {
        if (!$this->authorizeAdmin()) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        try {
            $price = $request->input('price');
            if (!$price) {
                return response()->json(['success' => false, 'message' => 'Please provide a new price'], 400);
            }

            $product = Product::where('id', $id)->where('is_deleted', false)->firstOrFail();
            $variant = ProductVariant::where('product_id', $product->id)->findOrFail($variantId);
            
            $variant->update(['price' => $price]);

            // Emit socket event for live price update
            try {
                Http::timeout(2)->post('http://localhost:5000/broadcast', [
                    'event' => 'priceUpdate',
                    'data' => [
                        'productId' => (string) $product->id,
                        'variantId' => (string) $variant->id,
                        'newPrice' => (double) $price
                    ]
                ]);
            } catch (\Exception $socketError) {
                // Fail silently if socket server helper is not running
            }

            // Create Audit Log
            AuditLog::create([
                'admin_id' => auth()->user()->id,
                'action' => 'UPDATE_PRICE',
                'details' => "Updated price of variant {$variantId} to {$price}",
                'target_id' => (string) $product->id
            ]);

            // Reload product relations
            $product->load(['categoryRelation', 'variants']);

            return response()->json([
                'success' => true,
                'data' => $product
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
