<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'phone_number',
        'email',
        'password',
        'gst_number',
        'business_name',
        'is_deleted'
    ];

    protected $hidden = [
        'id',
        'phone_number',
        'password',
        'gst_number',
        'business_name',
        'is_deleted',
        'remember_token',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'password' => 'hashed',
        'is_deleted' => 'boolean'
    ];

    public function toArray()
    {
        $array = parent::toArray();
        $array['_id'] = (string) $this->id;
        $array['phoneNumber'] = $this->phone_number;
        $array['gstNumber'] = $this->gst_number;
        $array['businessName'] = $this->business_name;
        $array['isDeleted'] = (bool) $this->is_deleted;
        return $array;
    }

    public function addresses()
    {
        return $this->hasMany(UserAddress::class, 'user_id');
    }

    public function wishlist()
    {
        return $this->belongsToMany(Product::class, 'wishlists', 'user_id', 'product_id')->withTimestamps();
    }
}
