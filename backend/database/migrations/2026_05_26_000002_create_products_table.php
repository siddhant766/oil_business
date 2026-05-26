<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->string('slug')->nullable();
            $table->text('description');
            $table->string('brand');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->integer('gst_percentage')->default(5);
            $table->string('image')->default('no-photo.jpg');
            $table->string('status')->default('Draft'); // Draft, Published, Hidden
            $table->boolean('is_featured')->default(false);
            $table->boolean('trending')->default(false);
            $table->boolean('export_ready')->default(false);
            $table->integer('moq')->default(1);
            $table->json('tags')->nullable();
            $table->json('certifications')->nullable();
            $table->text('nutritional_info')->nullable();
            $table->string('warehouse_location')->default('Delhi NCR');
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
