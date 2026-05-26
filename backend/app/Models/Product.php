<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'brand',
        'category_id',
        'gst_percentage',
        'image',
        'status',
        'is_featured',
        'trending',
        'export_ready',
        'moq',
        'tags',
        'certifications',
        'nutritional_info',
        'warehouse_location',
        'is_deleted'
    ];

    protected $casts = [
        'tags' => 'array',
        'certifications' => 'array',
        'is_featured' => 'boolean',
        'trending' => 'boolean',
        'export_ready' => 'boolean',
        'is_deleted' => 'boolean',
        'moq' => 'integer',
        'gst_percentage' => 'integer'
    ];

    protected $hidden = [
        'id',
        'category_id',
        'categoryRelation',
        'gst_percentage',
        'is_featured',
        'export_ready',
        'nutritional_info',
        'warehouse_location',
        'is_deleted',
        'created_at',
        'updated_at'
    ];

    // Pre-save hook: auto-generate slug
    protected static function booted()
    {
        static::saving(function ($product) {
            if (empty($product->slug) && !empty($product->name)) {
                $product->slug = preg_replace('/[^a-z0-9-]+/', '-', strtolower(trim($product->name)));
            }
        });
    }

    public function toArray()
    {
        $array = parent::toArray();
        $array['_id'] = (string) $this->id;
        $array['gstPercentage'] = (int) $this->gst_percentage;
        $array['isFeatured'] = (bool) $this->is_featured;
        $array['exportReady'] = (bool) $this->export_ready;
        $array['nutritionalInfo'] = $this->nutritional_info ?? '';
        $array['warehouseLocation'] = $this->warehouse_location;
        $array['category'] = $this->relationLoaded('categoryRelation') ? $this->categoryRelation : (string) $this->category_id;
        return $array;
    }

    public function categoryRelation()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'product_id');
    }
}
