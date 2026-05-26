<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $table = 'order_items';

    protected $fillable = [
        'order_id',
        'product_id',
        'variant_id',
        'name',
        'size',
        'quantity',
        'price'
    ];

    protected $casts = [
        'price' => 'double',
        'quantity' => 'integer'
    ];

    protected $hidden = [
        'id',
        'order_id',
        'product_id',
        'variant_id',
        'productRelation',
        'created_at',
        'updated_at'
    ];

    public function toArray()
    {
        $array = parent::toArray();
        $array['_id'] = (string) $this->id;
        $array['product'] = $this->relationLoaded('productRelation') ? $this->productRelation : (string) $this->product_id;
        $array['variantId'] = $this->variant_id;
        return $array;
    }

    public function productRelation()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
