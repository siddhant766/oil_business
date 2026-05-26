<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\UploadController;

Route::prefix('v1')->group(function () {
    
    // --- Public Authentication ---
    Route::post('/auth/customer/register', [AuthController::class, 'registerCustomer']);
    Route::post('/auth/customer/login', [AuthController::class, 'loginCustomer']);
    Route::post('/auth/admin/login', [AuthController::class, 'adminLogin']);
    
    Route::post('/admin/login', [AdminController::class, 'loginAdmin']);
    Route::post('/admin/register', [AdminController::class, 'registerAdmin']); // Public bootstrapping route
    
    // --- Public Catalog ---
    Route::get('/products', [ProductController::class, 'getProducts']);
    Route::get('/products/{id}', [ProductController::class, 'getProduct']);
    Route::get('/categories', [CategoryController::class, 'getCategories']);
    
    // --- Public Leads/Inquiry ---
    Route::post('/inquiries', [InquiryController::class, 'createInquiry']);
    
    // --- File Uploads ---
    Route::post('/upload', [UploadController::class, 'uploadImage']);
    
    // --- Server Health check ---
    Route::get('/health', function () {
        return response()->json(['success' => true, 'message' => 'Server is healthy'], 200);
    });

    // --- Authenticated APIs (Customer or Admin) ---
    Route::middleware('auth:sanctum')->group(function () {
        
        // Customer Profile
        Route::get('/auth/customer/me', [AuthController::class, 'getMe']);
        Route::put('/users/profile', [UserController::class, 'updateProfile']);
        
        // Customer dynamic address book
        Route::post('/users/addresses', [UserController::class, 'addAddress']);
        Route::put('/users/addresses/{id}', [UserController::class, 'updateAddress']);
        Route::delete('/users/addresses/{id}', [UserController::class, 'deleteAddress']);
        
        // Customer wishlist sync
        Route::get('/users/wishlist', [UserController::class, 'getWishlist']);
        Route::post('/users/wishlist', [UserController::class, 'toggleWishlist']);
        
        // Customer Checkout and order list
        Route::post('/orders', [OrderController::class, 'createOrder']);
        Route::get('/orders/myorders', [OrderController::class, 'getMyOrders']);
        
        // Admin Operations (these are validated inside the controller based on authenticatable model types)
        Route::get('/admin/me', [AdminController::class, 'getMe']);
        Route::get('/admin/customers', [AdminController::class, 'getAllCustomers']);
        Route::get('/admin/analytics', [AdminController::class, 'getAnalytics']);
        Route::post('/admin/orders', [AdminController::class, 'createManualOrder']);
        
        // Admin Product Catalog operations
        Route::get('/products/admin/all', [ProductController::class, 'getAllProductsAdmin']);
        Route::post('/products', [ProductController::class, 'createProduct']);
        Route::put('/products/{id}', [ProductController::class, 'updateProduct']);
        Route::delete('/products/{id}', [ProductController::class, 'deleteProduct']);
        Route::put('/products/{id}/variants/{variantId}/price', [ProductController::class, 'updateVariantPrice']);
        
        // Admin Category operations
        Route::post('/categories', [CategoryController::class, 'createCategory']);
        Route::put('/categories/{id}', [CategoryController::class, 'updateCategory']);
        Route::delete('/categories/{id}', [CategoryController::class, 'deleteCategory']);
        
        // Admin Orders listing and fulfillment
        Route::get('/orders', [OrderController::class, 'getAllOrders']);
        Route::put('/orders/{id}/status', [OrderController::class, 'updateOrderStatus']);
        
        // Admin Inquiry verification
        Route::get('/inquiries', [InquiryController::class, 'getInquiries']);
        Route::put('/inquiries/{id}/status', [InquiryController::class, 'updateInquiryStatus']);
        
        // Admin Invoice PDF generation
        Route::get('/invoices/{orderId}', [InvoiceController::class, 'generateInvoice']);
        
    });
});
