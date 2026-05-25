const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
    { name: 'Mustard Oil', slug: 'mustard-oil', description: 'Pure cold pressed kachi ghani mustard oil', icon: '🌿' },
    { name: 'Sunflower Oil', slug: 'sunflower-oil', description: 'Light and heart-healthy refined sunflower oil', icon: '🌻' },
    { name: 'Soybean Oil', slug: 'soybean-oil', description: 'Refined soybean oil for everyday cooking', icon: '🫘' },
    { name: 'Groundnut Oil', slug: 'groundnut-oil', description: 'Rich and flavorful groundnut cooking oil', icon: '🥜' },
    { name: 'Rice Bran Oil', slug: 'rice-bran-oil', description: 'Premium physically refined rice bran oil', icon: '🌾' },
    { name: 'Coconut Oil', slug: 'coconut-oil', description: 'Pure virgin and refined coconut oil', icon: '🥥' },
    { name: 'Palm Oil', slug: 'palm-oil', description: 'Industrial-grade palm oil for commercial use', icon: '🌴' },
    { name: 'Blended Oils', slug: 'blended-oils', description: 'Multi-source blended edible oils', icon: '🔄' },
    { name: 'Bulk Industrial Oils', slug: 'bulk-industrial-oils', description: 'Tanker and barrel supply for food processing', icon: '🏭' },
    { name: 'Organic Oils', slug: 'organic-oils', description: 'Certified organic cold pressed oils', icon: '🌱' },
    { name: 'Cold Pressed Oils', slug: 'cold-pressed-oils', description: 'Traditional wood-pressed cooking oils', icon: '⚙️' },
    { name: 'Premium Export Oils', slug: 'premium-export-oils', description: 'Export-quality edible oils with international certifications', icon: '✈️' },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Seed Categories (only if empty)
        const catCount = await Category.countDocuments();
        let savedCategories;
        if (catCount === 0) {
            savedCategories = await Category.insertMany(categories);
            console.log(`✅ ${savedCategories.length} categories seeded!`);
        } else {
            console.log(`⏭️  Categories already exist (${catCount}). Skipping category seed.`);
            savedCategories = await Category.find({ isDeleted: false });
        }

        // Build a lookup map
        const catMap = {};
        savedCategories.forEach(c => {
            catMap[c.name] = c._id;
        });

        // Seed Products (only if empty)
        const prodCount = await Product.countDocuments();
        if (prodCount === 0) {
            const products = [
                {
                    name: 'Premium Kachi Ghani Mustard Oil',
                    slug: 'premium-kachi-ghani-mustard-oil',
                    brand: 'Premium Oils',
                    category: catMap['Mustard Oil'],
                    description: 'Cold-pressed from the finest mustard seeds. Strong aroma, deep flavor — the authentic choice for North Indian kitchens and commercial food preparation.',
                    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87d5?w=600&q=80',
                    gstPercentage: 5,
                    status: 'Published',
                    isFeatured: true,
                    trending: true,
                    moq: 5,
                    tags: ['cold-pressed', 'north-indian', 'kachi-ghani', 'wholesale'],
                    certifications: ['FSSAI', 'ISO 22000', 'AGMARK'],
                    nutritionalInfo: 'Rich in MUFA, Omega-3 fatty acids. Per 100ml: Energy 900kcal, Fat 100g',
                    warehouseLocation: 'Delhi NCR',
                    variants: [
                        { size: '1L Pouch', price: 180, wholesalePrice: 155, sku: 'MO-1L-001', stockQuantity: 500, stockStatus: 'In Stock', dispatchTime: '24 hrs' },
                        { size: '5L Can', price: 850, wholesalePrice: 720, sku: 'MO-5L-001', stockQuantity: 300, stockStatus: 'In Stock', dispatchTime: '24 hrs' },
                        { size: '15L Tin', price: 2400, wholesalePrice: 2050, sku: 'MO-15L-001', stockQuantity: 150, stockStatus: 'In Stock', dispatchTime: '24-48 hrs' },
                        { size: '15kg Can', price: 2200, wholesalePrice: 1900, sku: 'MO-15K-001', stockQuantity: 100, stockStatus: 'In Stock', dispatchTime: '48 hrs' },
                    ]
                },
                {
                    name: 'Refined Sunflower Oil',
                    slug: 'refined-sunflower-oil',
                    brand: 'Premium Oils',
                    category: catMap['Sunflower Oil'],
                    description: 'Light, healthy, and cholesterol-free refined sunflower oil. Perfect for deep frying, sautéing, and health-conscious cooking at scale.',
                    image: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=600&q=80',
                    gstPercentage: 5,
                    status: 'Published',
                    isFeatured: true,
                    moq: 10,
                    tags: ['refined', 'heart-healthy', 'light-cooking', 'restaurant'],
                    certifications: ['FSSAI', 'ISO 22000'],
                    nutritionalInfo: 'High in Vitamin E, low in saturated fat. Per 100ml: Energy 884kcal, Fat 100g',
                    warehouseLocation: 'Mumbai',
                    variants: [
                        { size: '1L Bottle', price: 150, wholesalePrice: 128, sku: 'SF-1L-001', stockQuantity: 800, stockStatus: 'In Stock', dispatchTime: '24 hrs' },
                        { size: '5L Can', price: 700, wholesalePrice: 600, sku: 'SF-5L-001', stockQuantity: 400, stockStatus: 'In Stock', dispatchTime: '24 hrs' },
                        { size: '15L Tin', price: 2000, wholesalePrice: 1700, sku: 'SF-15L-001', stockQuantity: 200, stockStatus: 'In Stock', dispatchTime: '24-48 hrs' },
                        { size: '200L Drum', price: 24000, wholesalePrice: 20500, sku: 'SF-200L-001', stockQuantity: 25, stockStatus: 'In Stock', dispatchTime: '3-5 days' },
                    ]
                },
                {
                    name: 'Refined Soybean Oil',
                    slug: 'refined-soybean-oil',
                    brand: 'Premium Oils',
                    category: catMap['Soybean Oil'],
                    description: 'Multi-purpose refined soybean oil ideal for industrial food processing, commercial kitchens, and everyday household cooking.',
                    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
                    gstPercentage: 5,
                    status: 'Published',
                    isFeatured: true,
                    moq: 10,
                    tags: ['refined', 'multi-purpose', 'industrial', 'bulk'],
                    certifications: ['FSSAI', 'AGMARK'],
                    nutritionalInfo: 'Good source of Omega-6. Per 100ml: Energy 884kcal, Fat 100g',
                    warehouseLocation: 'Indore',
                    variants: [
                        { size: '1L Pouch', price: 120, wholesalePrice: 100, sku: 'SB-1L-001', stockQuantity: 1000, stockStatus: 'In Stock', dispatchTime: '24 hrs' },
                        { size: '5L Can', price: 560, wholesalePrice: 475, sku: 'SB-5L-001', stockQuantity: 600, stockStatus: 'In Stock', dispatchTime: '24 hrs' },
                        { size: '15L Tin', price: 1600, wholesalePrice: 1350, sku: 'SB-15L-001', stockQuantity: 250, stockStatus: 'In Stock', dispatchTime: '24-48 hrs' },
                        { size: '50L Barrel', price: 5000, wholesalePrice: 4200, sku: 'SB-50L-001', stockQuantity: 50, stockStatus: 'In Stock', dispatchTime: '3-5 days' },
                    ]
                },
                {
                    name: 'Pure Groundnut Oil',
                    slug: 'pure-groundnut-oil',
                    brand: 'Premium Oils',
                    category: catMap['Groundnut Oil'],
                    description: 'Premium filtered groundnut oil with rich nutty flavor. The gold standard for Gujarat and South Indian culinary traditions.',
                    image: 'https://images.unsplash.com/photo-1534483509719-2c348a57bc1e?w=600&q=80',
                    gstPercentage: 5,
                    status: 'Published',
                    trending: true,
                    moq: 5,
                    tags: ['filtered', 'gujarati', 'south-indian', 'premium'],
                    certifications: ['FSSAI', 'ISO 22000', 'AGMARK'],
                    nutritionalInfo: 'High in MUFA, Vitamin E. Per 100ml: Energy 884kcal, Fat 100g',
                    warehouseLocation: 'Rajkot',
                    variants: [
                        { size: '1L Bottle', price: 220, wholesalePrice: 190, sku: 'GN-1L-001', stockQuantity: 400, stockStatus: 'In Stock', dispatchTime: '24-48 hrs' },
                        { size: '5L Can', price: 1050, wholesalePrice: 900, sku: 'GN-5L-001', stockQuantity: 200, stockStatus: 'In Stock', dispatchTime: '24-48 hrs' },
                        { size: '15L Tin', price: 3000, wholesalePrice: 2600, sku: 'GN-15L-001', stockQuantity: 80, stockStatus: 'Low Stock', dispatchTime: '48 hrs' },
                    ]
                },
                {
                    name: 'Physically Refined Rice Bran Oil',
                    slug: 'refined-rice-bran-oil',
                    brand: 'Premium Oils',
                    category: catMap['Rice Bran Oil'],
                    description: 'Heart-friendly rice bran oil with natural oryzanol. The healthiest choice for daily cooking and deep frying applications.',
                    image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600&q=80',
                    gstPercentage: 5,
                    status: 'Published',
                    isFeatured: true,
                    moq: 10,
                    tags: ['heart-healthy', 'oryzanol', 'premium', 'hotel'],
                    certifications: ['FSSAI', 'ISO 22000'],
                    nutritionalInfo: 'Contains Oryzanol, balanced MUFA/PUFA. Per 100ml: Energy 884kcal, Fat 100g',
                    warehouseLocation: 'Kolkata',
                    variants: [
                        { size: '1L Bottle', price: 170, wholesalePrice: 145, sku: 'RB-1L-001', stockQuantity: 600, stockStatus: 'In Stock', dispatchTime: '24 hrs' },
                        { size: '5L Can', price: 800, wholesalePrice: 680, sku: 'RB-5L-001', stockQuantity: 350, stockStatus: 'In Stock', dispatchTime: '24 hrs' },
                        { size: '15L Tin', price: 2300, wholesalePrice: 1950, sku: 'RB-15L-001', stockQuantity: 120, stockStatus: 'In Stock', dispatchTime: '24-48 hrs' },
                    ]
                },
                {
                    name: 'Virgin Coconut Oil',
                    slug: 'virgin-coconut-oil',
                    brand: 'Premium Oils',
                    category: catMap['Coconut Oil'],
                    description: 'Cold-pressed virgin coconut oil from Kerala. Premium quality for cooking, skin care, and hair care applications.',
                    image: 'https://images.unsplash.com/photo-1526946663404-16a98c070a00?w=600&q=80',
                    gstPercentage: 5,
                    status: 'Published',
                    exportReady: true,
                    moq: 5,
                    tags: ['virgin', 'cold-pressed', 'kerala', 'export-quality'],
                    certifications: ['FSSAI', 'USDA Organic', 'ISO 22000'],
                    nutritionalInfo: 'Rich in MCTs, Lauric Acid. Per 100ml: Energy 862kcal, Fat 100g',
                    warehouseLocation: 'Kochi',
                    variants: [
                        { size: '500ml Bottle', price: 280, wholesalePrice: 240, sku: 'CO-500-001', stockQuantity: 300, stockStatus: 'In Stock', dispatchTime: '24-48 hrs' },
                        { size: '1L Bottle', price: 520, wholesalePrice: 445, sku: 'CO-1L-001', stockQuantity: 250, stockStatus: 'In Stock', dispatchTime: '24-48 hrs' },
                        { size: '5L Can', price: 2400, wholesalePrice: 2050, sku: 'CO-5L-001', stockQuantity: 100, stockStatus: 'In Stock', dispatchTime: '48 hrs' },
                    ]
                },
                {
                    name: 'Cold Pressed Sesame Oil',
                    slug: 'cold-pressed-sesame-oil',
                    brand: 'Premium Oils',
                    category: catMap['Cold Pressed Oils'],
                    description: 'Traditional wood-pressed gingelly oil. Authentic South Indian flavor for temple offerings and authentic cuisine.',
                    image: 'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=600&q=80',
                    gstPercentage: 5,
                    status: 'Published',
                    trending: true,
                    moq: 3,
                    tags: ['wood-pressed', 'gingelly', 'traditional', 'south-indian'],
                    certifications: ['FSSAI', 'AGMARK'],
                    nutritionalInfo: 'Rich in Sesamol, Vitamin E. Per 100ml: Energy 884kcal, Fat 100g',
                    warehouseLocation: 'Chennai',
                    variants: [
                        { size: '500ml Bottle', price: 320, wholesalePrice: 275, sku: 'SS-500-001', stockQuantity: 200, stockStatus: 'In Stock', dispatchTime: '24-48 hrs' },
                        { size: '1L Bottle', price: 600, wholesalePrice: 510, sku: 'SS-1L-001', stockQuantity: 150, stockStatus: 'In Stock', dispatchTime: '24-48 hrs' },
                        { size: '5L Can', price: 2800, wholesalePrice: 2400, sku: 'SS-5L-001', stockQuantity: 60, stockStatus: 'Low Stock', dispatchTime: '48 hrs' },
                    ]
                },
                {
                    name: 'Blended Cooking Oil',
                    slug: 'blended-cooking-oil',
                    brand: 'Premium Oils',
                    category: catMap['Blended Oils'],
                    description: 'Optimally blended multi-source oil combining soybean and rice bran. Cost-effective solution for high-volume commercial kitchens.',
                    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=600&q=80',
                    gstPercentage: 5,
                    status: 'Published',
                    moq: 20,
                    tags: ['blended', 'commercial', 'cost-effective', 'bulk'],
                    certifications: ['FSSAI'],
                    nutritionalInfo: 'Balanced fatty acid profile. Per 100ml: Energy 884kcal, Fat 100g',
                    warehouseLocation: 'Delhi NCR',
                    variants: [
                        { size: '1L Pouch', price: 95, wholesalePrice: 78, sku: 'BL-1L-001', stockQuantity: 2000, stockStatus: 'In Stock', dispatchTime: '24 hrs' },
                        { size: '5L Can', price: 440, wholesalePrice: 370, sku: 'BL-5L-001', stockQuantity: 1000, stockStatus: 'In Stock', dispatchTime: '24 hrs' },
                        { size: '15L Tin', price: 1250, wholesalePrice: 1050, sku: 'BL-15L-001', stockQuantity: 500, stockStatus: 'In Stock', dispatchTime: '24-48 hrs' },
                        { size: '200L Drum', price: 15000, wholesalePrice: 12800, sku: 'BL-200L-001', stockQuantity: 30, stockStatus: 'In Stock', dispatchTime: '3-5 days' },
                    ]
                },
                {
                    name: 'Organic Cold Pressed Mustard Oil',
                    slug: 'organic-cold-pressed-mustard-oil',
                    brand: 'Premium Oils',
                    category: catMap['Organic Oils'],
                    description: 'Certified organic, stone-ground mustard oil from hand-picked seeds. Zero chemicals, zero preservatives — pure natural goodness.',
                    image: 'https://images.unsplash.com/photo-1583922606661-0822ed0bd916?w=600&q=80',
                    gstPercentage: 5,
                    status: 'Published',
                    exportReady: true,
                    isFeatured: true,
                    moq: 3,
                    tags: ['organic', 'stone-ground', 'chemical-free', 'export'],
                    certifications: ['FSSAI', 'India Organic', 'USDA Organic', 'EU Organic'],
                    nutritionalInfo: 'Pure organic MUFA, Omega-3. Per 100ml: Energy 900kcal, Fat 100g',
                    warehouseLocation: 'Jaipur',
                    variants: [
                        { size: '500ml Bottle', price: 250, wholesalePrice: 215, sku: 'OM-500-001', stockQuantity: 200, stockStatus: 'In Stock', dispatchTime: '24-48 hrs' },
                        { size: '1L Bottle', price: 460, wholesalePrice: 395, sku: 'OM-1L-001', stockQuantity: 150, stockStatus: 'In Stock', dispatchTime: '24-48 hrs' },
                        { size: '5L Can', price: 2100, wholesalePrice: 1800, sku: 'OM-5L-001', stockQuantity: 80, stockStatus: 'In Stock', dispatchTime: '48 hrs' },
                    ]
                },
                {
                    name: 'Industrial Palm Oil',
                    slug: 'industrial-palm-oil',
                    brand: 'Premium Oils',
                    category: catMap['Bulk Industrial Oils'],
                    description: 'High-grade refined palm oil for industrial food processing, bakery, and FMCG manufacturing. Available in tanker supply.',
                    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&q=80',
                    gstPercentage: 5,
                    status: 'Published',
                    moq: 50,
                    tags: ['industrial', 'palm', 'tanker', 'fmcg', 'bakery'],
                    certifications: ['FSSAI', 'ISO 22000', 'RSPO'],
                    nutritionalInfo: 'Stable at high temperatures. Per 100ml: Energy 884kcal, Fat 100g',
                    warehouseLocation: 'Kandla Port',
                    variants: [
                        { size: '15L Tin', price: 1400, wholesalePrice: 1150, sku: 'PO-15L-001', stockQuantity: 300, stockStatus: 'In Stock', dispatchTime: '24-48 hrs' },
                        { size: '50L Barrel', price: 4200, wholesalePrice: 3500, sku: 'PO-50L-001', stockQuantity: 100, stockStatus: 'In Stock', dispatchTime: '3-5 days' },
                        { size: '200L Drum', price: 15500, wholesalePrice: 13000, sku: 'PO-200L-001', stockQuantity: 40, stockStatus: 'In Stock', dispatchTime: '3-5 days' },
                        { size: 'Tanker Supply', price: 150000, wholesalePrice: 125000, sku: 'PO-TNK-001', stockQuantity: 10, stockStatus: 'In Stock', dispatchTime: '5-7 days' },
                    ]
                },
            ];

            // Only add products whose categories exist
            const validProducts = products.filter(p => p.category);
            const savedProducts = await Product.insertMany(validProducts);
            console.log(`✅ ${savedProducts.length} products seeded!`);
        } else {
            console.log(`⏭️  Products already exist (${prodCount}). Skipping product seed.`);
        }

        console.log('\n🎉 Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding error:', err.message);
        process.exit(1);
    }
};

seedDB();
