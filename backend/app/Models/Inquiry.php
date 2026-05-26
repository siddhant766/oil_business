<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    protected $table = 'inquiries';

    protected $fillable = [
        'business_name',
        'contact_person',
        'email',
        'phone',
        'gst_number',
        'address',
        'estimated_order_quantity',
        'message',
        'status'
    ];

    protected $hidden = [
        'id',
        'business_name',
        'contact_person',
        'gst_number',
        'estimated_order_quantity',
        'updated_at'
    ];

    public function toArray()
    {
        $array = parent::toArray();
        $array['_id'] = (string) $this->id;
        $array['businessName'] = $this->business_name;
        $array['contactPerson'] = $this->contact_person;
        $array['gstNumber'] = $this->gst_number;
        $array['estimatedOrderQuantity'] = $this->estimated_order_quantity;
        return $array;
    }
}
