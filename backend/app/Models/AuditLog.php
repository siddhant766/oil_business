<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $table = 'audit_logs';

    protected $fillable = [
        'admin_id',
        'action',
        'details',
        'target_id'
    ];

    protected $hidden = [
        'id',
        'admin_id',
        'target_id',
        'updated_at'
    ];

    public function toArray()
    {
        $array = parent::toArray();
        $array['_id'] = (string) $this->id;
        $array['adminId'] = $this->admin_id;
        $array['targetId'] = $this->target_id;
        return $array;
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
