<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    protected $table = 'user_addresses';

    protected $fillable = [
        'user_id',
        'type',
        'address_line_1',
        'city',
        'state',
        'pincode',
        'is_default'
    ];

    protected $casts = [
        'is_default' => 'boolean'
    ];

    protected $hidden = [
        'id',
        'user_id',
        'address_line_1',
        'is_default',
        'created_at',
        'updated_at'
    ];

    public function toArray()
    {
        $array = parent::toArray();
        $array['_id'] = (string) $this->id;
        $array['addressLine1'] = $this->address_line_1;
        $array['isDefault'] = (bool) $this->is_default;
        return $array;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
