<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $table = 'product_variants';

    protected $fillable = [
        'product_id',
        'size',
        'price',
        'wholesale_price',
        'sku',
        'stock_status',
        'stock_quantity',
        'dispatch_time'
    ];

    protected $hidden = [
        'id',
        'product_id',
        'wholesale_price',
        'stock_status',
        'stock_quantity',
        'dispatch_time',
        'created_at',
        'updated_at'
    ];

    public function toArray()
    {
        $array = parent::toArray();
        $array['_id'] = (string) $this->id;
        $array['wholesalePrice'] = $this->wholesale_price;
        $array['stockStatus'] = $this->stock_status;
        $array['stockQuantity'] = (int) $this->stock_quantity;
        $array['dispatchTime'] = $this->dispatch_time;
        return $array;
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
