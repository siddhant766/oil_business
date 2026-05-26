<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('business_name');
            $table->string('contact_person');
            $table->string('email');
            $table->string('phone');
            $table->string('gst_number')->nullable();
            $table->text('address');
            $table->string('estimated_order_quantity');
            $table->text('message')->nullable();
            $table->string('status')->default('Pending'); // Pending, Reviewed, Approved, Rejected
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
