<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->double('total_amount');
            $table->json('shipping_address'); // JSON object storing addresses
            $table->string('status')->default('Placed'); // Placed, OTP Verified, Admin Approved, Packed, Out for Delivery, Delivered, Cancelled, Rejected, Returned
            $table->string('payment_method')->default('COD');
            $table->date('estimated_delivery_date')->nullable();
            $table->text('customer_notes')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
