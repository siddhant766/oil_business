<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'image',
        'is_deleted'
    ];

    protected $casts = [
        'is_deleted' => 'boolean'
    ];

    protected $hidden = [
        'id',
        'is_deleted',
        'created_at',
        'updated_at'
    ];

    // Pre-save hook: auto-generate slug
    protected static function booted()
    {
        static::saving(function ($category) {
            if (empty($category->slug) && !empty($category->name)) {
                $category->slug = preg_replace('/[^a-z0-9-]+/', '-', strtolower(trim($category->name)));
            }
        });
    }

    public function toArray()
    {
        $array = parent::toArray();
        $array['_id'] = (string) $this->id;
        return $array;
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
