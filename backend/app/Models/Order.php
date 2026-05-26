<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';

    protected $fillable = [
        'user_id',
        'total_amount',
        'shipping_address',
        'status',
        'payment_method',
        'estimated_delivery_date',
        'customer_notes',
        'admin_notes'
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'total_amount' => 'double',
        'estimated_delivery_date' => 'datetime'
    ];

    protected $hidden = [
        'id',
        'user_id',
        'total_amount',
        'shipping_address',
        'payment_method',
        'estimated_delivery_date',
        'customer_notes',
        'admin_notes',
        'userRelation',
        'itemsRelation',
        'updated_at'
    ];

    public function toArray()
    {
        $array = parent::toArray();
        $array['_id'] = (string) $this->id;
        $array['user'] = $this->relationLoaded('userRelation') ? $this->userRelation : (string) $this->user_id;
        $array['totalAmount'] = (double) $this->total_amount;
        $array['shippingAddress'] = $this->shipping_address;
        $array['paymentMethod'] = $this->payment_method;
        $array['estimatedDeliveryDate'] = $this->estimated_delivery_date ? $this->estimated_delivery_date->toIso8601String() : null;
        $array['customerNotes'] = $this->customer_notes ?? '';
        $array['adminNotes'] = $this->admin_notes ?? '';
        $array['items'] = $this->relationLoaded('itemsRelation') ? $this->itemsRelation : [];
        return $array;
    }

    public function userRelation()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function itemsRelation()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }
}
