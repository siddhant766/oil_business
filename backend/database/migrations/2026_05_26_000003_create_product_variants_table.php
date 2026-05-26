<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('size');
            $table->double('price');
            $table->double('wholesale_price');
            $table->string('sku')->unique();
            $table->string('stock_status')->default('In Stock'); // In Stock, Low Stock, Out of Stock
            $table->integer('stock_quantity')->default(0);
            $table->string('dispatch_time')->default('24-48 hrs');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
