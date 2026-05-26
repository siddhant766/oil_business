<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'admins';

    protected $fillable = [
        'name',
        'email',
        'role',
        'password',
        'is_deleted'
    ];

    protected $hidden = [
        'id',
        'password',
        'is_deleted',
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
        $array['isDeleted'] = (bool) $this->is_deleted;
        return $array;
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }
}
