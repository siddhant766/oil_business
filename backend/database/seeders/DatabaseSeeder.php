<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed default Admin Account
        Admin::create([
            'name' => 'System Admin',
            'email' => 'admin@premiumoils.com',
            'password' => Hash::make('password123'),
            'role' => 'Super Admin'
        ]);

        $this->command->info('✅ Default admin admin@premiumoils.com / password123 seeded!');

        // 2. Seed Categories
        $categoriesData = [
            ['name' => 'Mustard Oil', 'slug' => 'mustard-oil', 'description' => 'Pure cold pressed kachi ghani mustard oil', 'icon' => '🌿'],
            ['name' => 'Sunflower Oil', 'slug' => 'sunflower-oil', 'description' => 'Light and heart-healthy refined sunflower oil', 'icon' => '🌻'],
            ['name' => 'Soybean Oil', 'slug' => 'soybean-oil', 'description' => 'Refined soybean oil for everyday cooking', 'icon' => '🫘'],
            ['name' => 'Groundnut Oil', 'slug' => 'groundnut-oil', 'description' => 'Rich and flavorful groundnut cooking oil', 'icon' => '🥜'],
            ['name' => 'Rice Bran Oil', 'slug' => 'rice-bran-oil', 'description' => 'Premium physically refined rice bran oil', 'icon' => '🌾'],
            ['name' => 'Coconut Oil', 'slug' => 'coconut-oil', 'description' => 'Pure virgin and refined coconut oil', 'icon' => '🥥'],
            ['name' => 'Palm Oil', 'slug' => 'palm-oil', 'description' => 'Industrial-grade palm oil for commercial use', 'icon' => '🌴'],
            ['name' => 'Blended Oils', 'slug' => 'blended-oils', 'description' => 'Multi-source blended edible oils', 'icon' => '🔄'],
            ['name' => 'Bulk Industrial Oils', 'slug' => 'bulk-industrial-oils', 'description' => 'Tanker and barrel supply for food processing', 'icon' => '🏭'],
            ['name' => 'Organic Oils', 'slug' => 'organic-oils', 'description' => 'Certified organic cold pressed oils', 'icon' => '🌱'],
            ['name' => 'Cold Pressed Oils', 'slug' => 'cold-pressed-oils', 'description' => 'Traditional wood-pressed cooking oils', 'icon' => '⚙️'],
            ['name' => 'Premium Export Oils', 'slug' => 'premium-export-oils', 'description' => 'Export-quality edible oils with international certifications', 'icon' => '✈️'],
        ];

        $categoryMap = [];
        foreach ($categoriesData as $cat) {
            $createdCat = Category::create($cat);
            $categoryMap[$cat['name']] = $createdCat->id;
        }

        $this->command->info('✅ ' . count($categoriesData) . ' categories seeded!');

        // 3. Seed Products and nested variants
        $productsData = [
            [
                'name' => 'Premium Kachi Ghani Mustard Oil',
                'brand' => 'Premium Oils',
                'category_name' => 'Mustard Oil',
                'description' => 'Cold-pressed from the finest mustard seeds. Strong aroma, deep flavor — the authentic choice for North Indian kitchens and commercial food preparation.',
                'image' => 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87d5?w=600&q=80',
                'gst_percentage' => 5,
                'status' => 'Published',
                'is_featured' => true,
                'trending' => true,
                'moq' => 5,
                'tags' => ['cold-pressed', 'north-indian', 'kachi-ghani', 'wholesale'],
                'certifications' => ['FSSAI', 'ISO 22000', 'AGMARK'],
                'nutritional_info' => 'Rich in MUFA, Omega-3 fatty acids. Per 100ml: Energy 900kcal, Fat 100g',
                'warehouse_location' => 'Delhi NCR',
                'variants' => [
                    ['size' => '1L Pouch', 'price' => 180, 'wholesale_price' => 155, 'sku' => 'MO-1L-001', 'stock_quantity' => 500, 'stock_status' => 'In Stock', 'dispatch_time' => '24 hrs'],
                    ['size' => '5L Can', 'price' => 850, 'wholesale_price' => 720, 'sku' => 'MO-5L-001', 'stock_quantity' => 300, 'stock_status' => 'In Stock', 'dispatch_time' => '24 hrs'],
                    ['size' => '15L Tin', 'price' => 2400, 'wholesale_price' => 2050, 'sku' => 'MO-15L-001', 'stock_quantity' => 150, 'stock_status' => 'In Stock', 'dispatch_time' => '24-48 hrs'],
                    ['size' => '15kg Can', 'price' => 2200, 'wholesale_price' => 1900, 'sku' => 'MO-15K-001', 'stock_quantity' => 100, 'stock_status' => 'In Stock', 'dispatch_time' => '48 hrs'],
                ]
            ],
            [
                'name' => 'Refined Sunflower Oil',
                'brand' => 'Premium Oils',
                'category_name' => 'Sunflower Oil',
                'description' => 'Light, healthy, and cholesterol-free refined sunflower oil. Perfect for deep frying, sautéing, and health-conscious cooking at scale.',
                'image' => 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=600&q=80',
                'gst_percentage' => 5,
                'status' => 'Published',
                'is_featured' => true,
                'trending' => false,
                'moq' => 10,
                'tags' => ['refined', 'heart-healthy', 'light-cooking', 'restaurant'],
                'certifications' => ['FSSAI', 'ISO 22000'],
                'nutritional_info' => 'High in Vitamin E, low in saturated fat. Per 100ml: Energy 884kcal, Fat 100g',
                'warehouse_location' => 'Mumbai',
                'variants' => [
                    ['size' => '1L Bottle', 'price' => 150, 'wholesale_price' => 128, 'sku' => 'SF-1L-001', 'stock_quantity' => 800, 'stock_status' => 'In Stock', 'dispatch_time' => '24 hrs'],
                    ['size' => '5L Can', 'price' => 700, 'wholesale_price' => 600, 'sku' => 'SF-5L-001', 'stock_quantity' => 400, 'stock_status' => 'In Stock', 'dispatch_time' => '24 hrs'],
                    ['size' => '15L Tin', 'price' => 2000, 'wholesale_price' => 1700, 'sku' => 'SF-15L-001', 'stock_quantity' => 200, 'stock_status' => 'In Stock', 'dispatch_time' => '24-48 hrs'],
                    ['size' => '200L Drum', 'price' => 24000, 'wholesale_price' => 20500, 'sku' => 'SF-200L-001', 'stock_quantity' => 25, 'stock_status' => 'In Stock', 'dispatch_time' => '3-5 days'],
                ]
            ],
            [
                'name' => 'Refined Soybean Oil',
                'brand' => 'Premium Oils',
                'category_name' => 'Soybean Oil',
                'description' => 'Multi-purpose refined soybean oil ideal for industrial food processing, commercial kitchens, and everyday household cooking.',
                'image' => 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
                'gst_percentage' => 5,
                'status' => 'Published',
                'is_featured' => true,
                'trending' => false,
                'moq' => 10,
                'tags' => ['refined', 'multi-purpose', 'industrial', 'bulk'],
                'certifications' => ['FSSAI', 'AGMARK'],
                'nutritional_info' => 'Good source of Omega-6. Per 100ml: Energy 884kcal, Fat 100g',
                'warehouse_location' => 'Indore',
                'variants' => [
                    ['size' => '1L Pouch', 'price' => 120, 'wholesale_price' => 100, 'sku' => 'SB-1L-001', 'stock_quantity' => 1000, 'stock_status' => 'In Stock', 'dispatch_time' => '24 hrs'],
                    ['size' => '5L Can', 'price' => 560, 'wholesale_price' => 475, 'sku' => 'SB-5L-001', 'stock_quantity' => 600, 'stock_status' => 'In Stock', 'dispatch_time' => '24 hrs'],
                    ['size' => '15L Tin', 'price' => 1600, 'wholesale_price' => 1350, 'sku' => 'SB-15L-001', 'stock_quantity' => 250, 'stock_status' => 'In Stock', 'dispatch_time' => '24-48 hrs'],
                    ['size' => '50L Barrel', 'price' => 5000, 'wholesale_price' => 4200, 'sku' => 'SB-50L-001', 'stock_quantity' => 50, 'stock_status' => 'In Stock', 'dispatch_time' => '3-5 days'],
                ]
            ],
            [
                'name' => 'Pure Groundnut Oil',
                'brand' => 'Premium Oils',
                'category_name' => 'Groundnut Oil',
                'description' => 'Premium filtered groundnut oil with rich nutty flavor. The gold standard for Gujarat and South Indian culinary traditions.',
                'image' => 'https://images.unsplash.com/photo-1534483509719-2c348a57bc1e?w=600&q=80',
                'gst_percentage' => 5,
                'status' => 'Published',
                'is_featured' => false,
                'trending' => true,
                'moq' => 5,
                'tags' => ['filtered', 'gujarati', 'south-indian', 'premium'],
                'certifications' => ['FSSAI', 'ISO 22000', 'AGMARK'],
                'nutritional_info' => 'High in MUFA, Vitamin E. Per 100ml: Energy 884kcal, Fat 100g',
                'warehouse_location' => 'Rajkot',
                'variants' => [
                    ['size' => '1L Bottle', 'price' => 220, 'wholesale_price' => 190, 'sku' => 'GN-1L-001', 'stock_quantity' => 400, 'stock_status' => 'In Stock', 'dispatch_time' => '24-48 hrs'],
                    ['size' => '5L Can', 'price' => 1050, 'wholesale_price' => 900, 'sku' => 'GN-5L-001', 'stock_quantity' => 200, 'stock_status' => 'In Stock', 'dispatch_time' => '24-48 hrs'],
                    ['size' => '15L Tin', 'price' => 3000, 'wholesale_price' => 2600, 'sku' => 'GN-15L-001', 'stock_quantity' => 80, 'stock_status' => 'Low Stock', 'dispatch_time' => '48 hrs'],
                ]
            ],
            [
                'name' => 'Physically Refined Rice Bran Oil',
                'brand' => 'Premium Oils',
                'category_name' => 'Rice Bran Oil',
                'description' => 'Heart-friendly rice bran oil with natural oryzanol. The healthiest choice for daily cooking and deep frying applications.',
                'image' => 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600&q=80',
                'gst_percentage' => 5,
                'status' => 'Published',
                'is_featured' => true,
                'trending' => false,
                'moq' => 10,
                'tags' => ['heart-healthy', 'oryzanol', 'premium', 'hotel'],
                'certifications' => ['FSSAI', 'ISO 22000'],
                'nutritional_info' => 'Contains Oryzanol, balanced MUFA/PUFA. Per 100ml: Energy 884kcal, Fat 100g',
                'warehouse_location' => 'Kolkata',
                'variants' => [
                    ['size' => '1L Bottle', 'price' => 170, 'wholesale_price' => 145, 'sku' => 'RB-1L-001', 'stock_quantity' => 600, 'stock_status' => 'In Stock', 'dispatch_time' => '24 hrs'],
                    ['size' => '5L Can', 'price' => 800, 'wholesale_price' => 680, 'sku' => 'RB-5L-001', 'stock_quantity' => 350, 'stock_status' => 'In Stock', 'dispatch_time' => '24 hrs'],
                    ['size' => '15L Tin', 'price' => 2300, 'wholesale_price' => 1950, 'sku' => 'RB-15L-001', 'stock_quantity' => 120, 'stock_status' => 'In Stock', 'dispatch_time' => '24-48 hrs'],
                ]
            ],
            [
                'name' => 'Virgin Coconut Oil',
                'brand' => 'Premium Oils',
                'category_name' => 'Coconut Oil',
                'description' => 'Cold-pressed virgin coconut oil from Kerala. Premium quality for cooking, skin care, and hair care applications.',
                'image' => 'https://images.unsplash.com/photo-1526946663404-16a98c070a00?w=600&q=80',
                'gst_percentage' => 5,
                'status' => 'Published',
                'is_featured' => false,
                'trending' => false,
                'export_ready' => true,
                'moq' => 5,
                'tags' => ['virgin', 'cold-pressed', 'kerala', 'export-quality'],
                'certifications' => ['FSSAI', 'USDA Organic', 'ISO 22000'],
                'nutritional_info' => 'Rich in MCTs, Lauric Acid. Per 100ml: Energy 862kcal, Fat 100g',
                'warehouse_location' => 'Kochi',
                'variants' => [
                    ['size' => '500ml Bottle', 'price' => 280, 'wholesale_price' => 240, 'sku' => 'CO-500-001', 'stock_quantity' => 300, 'stock_status' => 'In Stock', 'dispatch_time' => '24-48 hrs'],
                    ['size' => '1L Bottle', 'price' => 520, 'wholesale_price' => 445, 'sku' => 'CO-1L-001', 'stock_quantity' => 250, 'stock_status' => 'In Stock', 'dispatch_time' => '24-48 hrs'],
                    ['size' => '5L Can', 'price' => 2400, 'wholesale_price' => 2050, 'sku' => 'CO-5L-001', 'stock_quantity' => 100, 'stock_status' => 'In Stock', 'dispatch_time' => '48 hrs'],
                ]
            ],
            [
                'name' => 'Cold Pressed Sesame Oil',
                'brand' => 'Premium Oils',
                'category_name' => 'Cold Pressed Oils',
                'description' => 'Traditional wood-pressed gingelly oil. Authentic South Indian flavor for temple offerings and authentic cuisine.',
                'image' => 'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=600&q=80',
                'gst_percentage' => 5,
                'status' => 'Published',
                'is_featured' => false,
                'trending' => true,
                'moq' => 3,
                'tags' => ['wood-pressed', 'gingelly', 'traditional', 'south-indian'],
                'certifications' => ['FSSAI', 'AGMARK'],
                'nutritional_info' => 'Rich in Sesamol, Vitamin E. Per 100ml: Energy 884kcal, Fat 100g',
                'warehouse_location' => 'Chennai',
                'variants' => [
                    ['size' => '500ml Bottle', 'price' => 320, 'wholesale_price' => 275, 'sku' => 'SS-500-001', 'stock_quantity' => 200, 'stock_status' => 'In Stock', 'dispatch_time' => '24-48 hrs'],
                    ['size' => '1L Bottle', 'price' => 600, 'wholesale_price' => 510, 'sku' => 'SS-1L-001', 'stock_quantity' => 150, 'stock_status' => 'In Stock', 'dispatch_time' => '24-48 hrs'],
                    ['size' => '5L Can', 'price' => 2800, 'wholesale_price' => 2400, 'sku' => 'SS-5L-001', 'stock_quantity' => 60, 'stock_status' => 'Low Stock', 'dispatch_time' => '48 hrs'],
                ]
            ],
            [
                'name' => 'Blended Cooking Oil',
                'brand' => 'Premium Oils',
                'category_name' => 'Blended Oils',
                'description' => 'Optimally blended multi-source oil combining soybean and rice bran. Cost-effective solution for high-volume commercial kitchens.',
                'image' => 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=600&q=80',
                'gst_percentage' => 5,
                'status' => 'Published',
                'is_featured' => false,
                'trending' => false,
                'moq' => 20,
                'tags' => ['blended', 'commercial', 'cost-effective', 'bulk'],
                'certifications' => ['FSSAI'],
                'nutritional_info' => 'Balanced fatty acid profile. Per 100ml: Energy 884kcal, Fat 100g',
                'warehouse_location' => 'Delhi NCR',
                'variants' => [
                    ['size' => '1L Pouch', 'price' => 95, 'wholesale_price' => 78, 'sku' => 'BL-1L-001', 'stock_quantity' => 2000, 'stock_status' => 'In Stock', 'dispatch_time' => '24 hrs'],
                    ['size' => '5L Can', 'price' => 440, 'wholesale_price' => 370, 'sku' => 'BL-5L-001', 'stock_quantity' => 1000, 'stock_status' => 'In Stock', 'dispatch_time' => '24 hrs'],
                    ['size' => '15L Tin', 'price' => 1250, 'wholesale_price' => 1050, 'sku' => 'BL-15L-001', 'stock_quantity' => 500, 'stock_status' => 'In Stock', 'dispatch_time' => '24-48 hrs'],
                    ['size' => '200L Drum', 'price' => 15000, 'wholesale_price' => 12800, 'sku' => 'BL-200L-001', 'stock_quantity' => 30, 'stock_status' => 'In Stock', 'dispatch_time' => '3-5 days'],
                ]
            ],
            [
                'name' => 'Organic Cold Pressed Mustard Oil',
                'brand' => 'Premium Oils',
                'category_name' => 'Organic Oils',
                'description' => 'Certified organic, stone-ground mustard oil from hand-picked seeds. Zero chemicals, zero preservatives — pure natural goodness.',
                'image' => 'https://images.unsplash.com/photo-1583922606661-0822ed0bd916?w=600&q=80',
                'gst_percentage' => 5,
                'status' => 'Published',
                'is_featured' => true,
                'trending' => false,
                'export_ready' => true,
                'moq' => 3,
                'tags' => ['organic', 'stone-ground', 'chemical-free', 'export'],
                'certifications' => ['FSSAI', 'India Organic', 'USDA Organic', 'EU Organic'],
                'nutritional_info' => 'Pure organic MUFA, Omega-3. Per 100ml: Energy 900kcal, Fat 100g',
                'warehouse_location' => 'Jaipur',
                'variants' => [
                    ['size' => '500ml Bottle', 'price' => 250, 'wholesale_price' => 215, 'sku' => 'OM-500-001', 'stock_quantity' => 200, 'stock_status' => 'In Stock', 'dispatch_time' => '24-48 hrs'],
                    ['size' => '1L Bottle', 'price' => 460, 'wholesale_price' => 395, 'sku' => 'OM-1L-001', 'stock_quantity' => 150, 'stock_status' => 'In Stock', 'dispatch_time' => '24-48 hrs'],
                    ['size' => '5L Can', 'price' => 2100, 'wholesale_price' => 1800, 'sku' => 'OM-5L-001', 'stock_quantity' => 80, 'stock_status' => 'In Stock', 'dispatch_time' => '48 hrs'],
                ]
            ],
            [
                'name' => 'Industrial Palm Oil',
                'brand' => 'Premium Oils',
                'category_name' => 'Bulk Industrial Oils',
                'description' => 'High-grade refined palm oil for industrial food processing, bakery, and FMCG manufacturing. Available in tanker supply.',
                'image' => 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&q=80',
                'gst_percentage' => 5,
                'status' => 'Published',
                'is_featured' => false,
                'trending' => false,
                'moq' => 50,
                'tags' => ['industrial', 'palm', 'tanker', 'fmcg', 'bakery'],
                'certifications' => ['FSSAI', 'ISO 22000', 'RSPO'],
                'nutritional_info' => 'Stable at high temperatures. Per 100ml: Energy 884kcal, Fat 100g',
                'warehouse_location' => 'Kandla Port',
                'variants' => [
                    ['size' => '15L Tin', 'price' => 1400, 'wholesale_price' => 1150, 'sku' => 'PO-15L-001', 'stock_quantity' => 300, 'stock_status' => 'In Stock', 'dispatch_time' => '24-48 hrs'],
                    ['size' => '50L Barrel', 'price' => 4200, 'wholesale_price' => 3500, 'sku' => 'PO-50L-001', 'stock_quantity' => 100, 'stock_status' => 'In Stock', 'dispatch_time' => '3-5 days'],
                    ['size' => '200L Drum', 'price' => 15500, 'wholesale_price' => 13000, 'sku' => 'PO-200L-001', 'stock_quantity' => 40, 'stock_status' => 'In Stock', 'dispatch_time' => '3-5 days'],
                    ['size' => 'Tanker Supply', 'price' => 150000, 'wholesale_price' => 125000, 'sku' => 'PO-TNK-001', 'stock_quantity' => 10, 'stock_status' => 'In Stock', 'dispatch_time' => '5-7 days'],
                ]
            ],
        ];

        foreach ($productsData as $prod) {
            $catId = $categoryMap[$prod['category_name']] ?? null;
            if (!$catId) continue;

            $createdProd = Product::create([
                'name' => $prod['name'],
                'brand' => $prod['brand'],
                'category_id' => $catId,
                'description' => $prod['description'],
                'image' => $prod['image'],
                'gst_percentage' => $prod['gst_percentage'],
                'status' => $prod['status'],
                'is_featured' => $prod['is_featured'],
                'trending' => $prod['trending'],
                'export_ready' => $prod['export_ready'] ?? false,
                'moq' => $prod['moq'],
                'tags' => $prod['tags'],
                'certifications' => $prod['certifications'],
                'nutritional_info' => $prod['nutritional_info'],
                'warehouse_location' => $prod['warehouse_location']
            ]);

            foreach ($prod['variants'] as $v) {
                ProductVariant::create([
                    'product_id' => $createdProd->id,
                    'size' => $v['size'],
                    'price' => $v['price'],
                    'wholesale_price' => $v['wholesale_price'],
                    'sku' => $v['sku'],
                    'stock_quantity' => $v['stock_quantity'],
                    'stock_status' => $v['stock_status'],
                    'dispatch_time' => $v['dispatch_time']
                ]);
            }
        }

        $this->command->info('✅ ' . count($productsData) . ' products and their variants seeded successfully!');
    }
}
