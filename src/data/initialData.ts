import { Category, Product, HeroSlide, PromoBanner, StoreSettings, Coupon, Order, User } from '../types';

export const initialSettings: StoreSettings = {
  storeName: 'GHORER BAZAR',
  storeBengaliName: 'ঘরের বাজার',
  tagline: 'Pure & Organic Grocery Products from Nature to Your Table',
  logoUrl: '',
  contactEmail: 'support@ghorerbazar.com',
  contactPhone: '+880 9613-827827',
  whatsappNumber: '+880 1700-000000',
  address: 'House 14, Road 3, Dhanmondi, Dhaka 1205, Bangladesh',
  currency: 'BDT',
  currencySymbol: '৳',
  deliveryChargeDhaka: 70,
  deliveryChargeOutside: 130,
  freeDeliveryThreshold: 2000,
  announcementBarText: '🌿 খাঁটি ও স্বাস্থ্যসম্মত পণ্যের নিশ্চয়তা | সারাদেশে দ্রুত হোম ডেলিভারি | কল করুন: ০৯৬১৩-৮২৭৮২৭',
  showAnnouncementBar: true,
  facebookUrl: 'https://facebook.com/ghorerbazarbd',
  instagramUrl: 'https://instagram.com/ghorerbazarbd',
  youtubeUrl: 'https://youtube.com/@ghorerbazarbd',
};

export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Organic Food',
    bengaliName: 'অর্গানিক ফুড',
    slug: 'organic',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    description: '100% naturally certified organic seeds, chia, grains, and health foods.',
    subcategories: ['Chia Seed', 'Quinoa', 'Pink Salt', 'Spirulina', 'Flax Seed'],
    isFeatured: true,
    order: 1,
  },
  {
    id: 'cat-2',
    name: 'Raw Honey',
    bengaliName: 'খাঁটি মধু',
    slug: 'honey',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
    description: 'Raw, unprocessed wild honey directly gathered from the Sundarbans forest.',
    subcategories: ['Sundarban Honey', 'Mustard Flower Honey', 'Black Seed Honey', 'African Wild Honey', 'Litchi Flower Honey'],
    isFeatured: true,
    order: 2,
  },
  {
    id: 'cat-3',
    name: 'Royal Dates',
    bengaliName: 'মদিনার খেজুর',
    slug: 'dates',
    image: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=600&auto=format&fit=crop&q=80',
    description: 'Handpicked premium dates imported directly from Medina and Saudi Arabia.',
    subcategories: ['Ajwa Al-Madinah', 'Medjool Jumbo', 'Sukkari Soft', 'Amber', 'Mabroom', 'Kholas'],
    isFeatured: true,
    order: 3,
  },
  {
    id: 'cat-4',
    name: 'Pure Spices',
    bengaliName: 'খাঁটি মসলা',
    slug: 'spices',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
    description: 'Traditional stone-ground whole and powdered pure Bengali spices.',
    subcategories: ['Turmeric Powder', 'Chili Powder', 'Coriander', 'Cumin', 'Cardamom', 'Cinnamon', 'Clove'],
    isFeatured: true,
    order: 4,
  },
  {
    id: 'cat-5',
    name: 'Dry Foods & Nuts',
    bengaliName: 'ড্রাই ফুডস ও বাদাম',
    slug: 'nuts-seeds',
    image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=600&auto=format&fit=crop&q=80',
    description: 'Crunchy premium almonds, cashews, pistachios, raisins, and roasted nuts.',
    subcategories: ['Almonds', 'Cashew Nuts', 'Pistachios', 'Walnuts', 'Pumpkin Seeds', 'Mixed Nut Pack'],
    isFeatured: true,
    order: 5,
  },
  {
    id: 'cat-6',
    name: 'Organic Tea',
    bengaliName: 'চা ও পানীয়',
    slug: 'beverage',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    description: 'Sreemangal organic leaf tea, premium green tea, herbal infusions, and coffee.',
    subcategories: ['Organic Green Tea', 'Sreemangal Black Tea', 'Tulsi Tea', 'Moringa Tea'],
    isFeatured: true,
    order: 6,
  },
  {
    id: 'cat-7',
    name: 'Aromatic Rice',
    bengaliName: 'সুগন্ধি চাল',
    slug: 'rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    description: 'Aromatic unpolished Nazirshail, Chinigura Polao rice, and Red Rice.',
    subcategories: ['Chinigura Aromatic', 'Nazirshail Premium', 'Red Rice Unpolished', 'Katari Bhog'],
    isFeatured: true,
    order: 7,
  },
  {
    id: 'cat-8',
    name: 'Flours & Lentils',
    bengaliName: 'আটা ও ডাল',
    slug: 'flours-lentils',
    image: 'https://images.unsplash.com/photo-1607672632458-9eb56696346b?w=600&auto=format&fit=crop&q=80',
    description: 'Whole wheat red flour (Lal Aata), gram flour (Besan), and organic lentils.',
    subcategories: ['Red Whole Wheat Aata', 'Brown Rice Flour', 'Red Lentil (Moshur)', 'Mung Dal'],
    isFeatured: true,
    order: 8,
  },
  {
    id: 'cat-9',
    name: 'Ghee & Pure Oils',
    bengaliName: 'গাওয়া ঘি ও তেল',
    slug: 'oil-ghee',
    image: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?w=600&auto=format&fit=crop&q=80',
    description: 'Traditional wood-pressed virgin mustard oil, extra virgin coconut oil, and pure cow ghee.',
    subcategories: ['Ghani Broken Mustard Oil', 'Pure Cow Ghee', 'Extra Virgin Olive Oil', 'Cold Pressed Coconut Oil'],
    isFeatured: true,
    order: 9,
  },
  {
    id: 'cat-10',
    name: 'Pickle',
    bengaliName: 'আচার',
    slug: 'pickle',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80',
    description: 'Authentic handmade village pickles in pure mustard oil without preservatives.',
    subcategories: ['Mango Pickle', 'Olive Pickle (Jolpai)', 'Garlic Pickle', 'Boroi Pickle'],
    isFeatured: false,
    order: 10,
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Sundarban Natural Wild Raw Honey',
    bengaliName: 'সুন্দরবন প্রাকৃতিক খলিসা ফুলের মধু',
    slug: 'sundarban-natural-wild-raw-honey',
    sku: 'GB-HON-001',
    category: 'honey',
    subcategory: 'Sundarban Honey',
    brand: 'Ghorer Bazar Natural',
    shortDescription: '100% pure raw wild flower honey harvested sustainably from deep inside Sundarbans mangrove forest by traditional honey hunters (Mawals).',
    description: 'Ghorer Bazar Sundarban Wild Honey is unprocessed, unheated, and filtered only with fine mesh to preserve all living enzymes, antioxidants, and natural pollen. Rich floral aroma with smooth caramel undertones, highly beneficial for immune defense, cough relief, and daily energy.',
    price: 950,
    originalPrice: 1100,
    discountPercent: 14,
    stock: 48,
    rating: 4.9,
    reviewsCount: 142,
    thumbnail: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80'
    ],
    sizeOrWeight: '500 gm',
    variants: [
      { id: 'v1-1', name: '250 gm Glass Jar', price: 520, originalPrice: 590, stock: 30, sku: 'GB-HON-001-250' },
      { id: 'v1-2', name: '500 gm Glass Jar', price: 950, originalPrice: 1100, stock: 48, sku: 'GB-HON-001-500' },
      { id: 'v1-3', name: '1000 gm (1 kg)', price: 1800, originalPrice: 2100, stock: 25, sku: 'GB-HON-001-1K' },
    ],
    specifications: [
      { label: 'Source', value: 'Sundarbans Mangrove Forest, Bangladesh' },
      { label: 'Harvest Method', value: 'Traditional Mawal harvest, raw cold filtered' },
      { label: 'Color & Texture', value: 'Golden Amber, medium viscosity' },
      { label: 'Shelf Life', value: '3 Years (Indefinite if kept dry)' },
      { label: 'Storage', value: 'Store at room temperature in a dry place' }
    ],
    tags: ['honey', 'organic', 'sundarban', 'raw', 'bestseller', 'natural'],
    isFeatured: true,
    isBestseller: true,
    isOfferZone: true,
    visibility: true,
    seoTitle: 'Sundarban Natural Wild Honey 500g | Ghorer Bazar Bangladesh',
    seoDescription: 'Buy 100% pure Sundarban raw wild honey online in Bangladesh at best price from Ghorer Bazar with home delivery.'
  },
  {
    id: 'prod-2',
    name: 'Traditional Wood Pressed Mustard Oil (Ghani Vanga)',
    bengaliName: 'কাঠের ঘানিতে ভাঙা খাঁটি সরিষার তেল',
    slug: 'wood-pressed-pure-mustard-oil',
    sku: 'GB-OIL-002',
    category: 'oil-ghee',
    subcategory: 'Ghani Broken Mustard Oil',
    brand: 'Ghorer Bazar Heritage',
    shortDescription: 'Cold-pressed in slow-moving wooden ghani without heat treatment to retain authentic sharp pungency, natural aroma, and essential fatty acids.',
    description: 'Extracted purely from top-grade local Deshi Maghi mustard seeds. No chemical processing, no synthetic essence or artificial color. Gives your traditional Bengali fish curries, bhortas, and pickles the quintessential pungent aroma and health benefits.',
    price: 360,
    originalPrice: 420,
    discountPercent: 14,
    stock: 65,
    rating: 4.8,
    reviewsCount: 98,
    thumbnail: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&auto=format&fit=crop&q=80'
    ],
    sizeOrWeight: '1 Litre',
    variants: [
      { id: 'v2-1', name: '1 Litre Pet Bottle', price: 360, originalPrice: 420, stock: 65, sku: 'GB-OIL-002-1L' },
      { id: 'v2-2', name: '2 Litre Pet Bottle', price: 710, originalPrice: 820, stock: 40, sku: 'GB-OIL-002-2L' },
      { id: 'v2-3', name: '5 Litre Value Can', price: 1720, originalPrice: 2000, stock: 18, sku: 'GB-OIL-002-5L' },
    ],
    specifications: [
      { label: 'Extraction', value: 'Traditional Slow Cold Wood Ghani' },
      { label: 'Seed Type', value: '100% Deshi Maghi Mustard Seed' },
      { label: 'Additives', value: 'Zero chemicals, zero adulteration' },
      { label: 'Best For', value: 'Cooking, Bhorta, Pickles, Body massage' }
    ],
    tags: ['mustard oil', 'ghani', 'oil', 'shorishar tel', 'bestseller'],
    isFeatured: true,
    isBestseller: true,
    visibility: true
  },
  {
    id: 'prod-3',
    name: 'Village Gawa Pure Cow Ghee (Danader)',
    bengaliName: 'গ্রামের গাওয়া খাঁটি দানাদার ঘি',
    slug: 'village-gawa-pure-cow-ghee',
    sku: 'GB-GHE-003',
    category: 'oil-ghee',
    subcategory: 'Pure Cow Ghee',
    brand: 'Ghorer Bazar Dairy',
    shortDescription: 'Artisanal clarified cow butter made from farm-fresh curdled cream using slow traditional bilona technique for granular aromatic texture.',
    description: 'Cooked over gentle woodfire from grassroots village dairy milk. The natural golden color, exquisite aroma, and rich granular (danader) texture elevate every meal — from hot steamed rice to festive polao and halwa.',
    price: 880,
    originalPrice: 980,
    discountPercent: 10,
    stock: 35,
    rating: 4.95,
    reviewsCount: 189,
    thumbnail: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80'
    ],
    sizeOrWeight: '400 gm',
    variants: [
      { id: 'v3-1', name: '400 gm Glass Jar', price: 880, originalPrice: 980, stock: 35, sku: 'GB-GHE-003-400' },
      { id: 'v3-2', name: '900 gm Family Pack', price: 1950, originalPrice: 2200, stock: 20, sku: 'GB-GHE-003-900' }
    ],
    specifications: [
      { label: 'Milk Type', value: '100% Pure Deshi Cow Milk' },
      { label: 'Texture', value: 'Naturally Granular (Danader)' },
      { label: 'Processing', value: 'Slow fire curd cream bilona method' },
      { label: 'Preservatives', value: 'None' }
    ],
    tags: ['ghee', 'dairy', 'cow ghee', 'bestseller', 'pure'],
    isFeatured: true,
    isBestseller: true,
    visibility: true
  },
  {
    id: 'prod-4',
    name: 'Saudi Medjool Premium Jumbo Dates',
    bengaliName: 'সৌদি প্রিমিয়াম মেদজুল জাম্বো খেজুর',
    slug: 'saudi-medjool-premium-jumbo-dates',
    sku: 'GB-DAT-004',
    category: 'dates',
    subcategory: 'Medjool Jumbo',
    brand: 'Khejuri Al-Arabia',
    shortDescription: 'Regal King of Dates — luscious, caramel-sweet, soft fleshy jumbo dates imported under temperature-controlled logistics.',
    description: 'Renowned globally for their massive size, soft melting pulp, and natural honeyed caramel flavor. Packed with potassium, fiber, and iron for sustained stamina and healthy living.',
    price: 1350,
    originalPrice: 1550,
    discountPercent: 13,
    stock: 42,
    rating: 4.9,
    reviewsCount: 114,
    thumbnail: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80'
    ],
    sizeOrWeight: '1 kg Box',
    variants: [
      { id: 'v4-1', name: '500 gm Box', price: 720, originalPrice: 820, stock: 25, sku: 'GB-DAT-004-500' },
      { id: 'v4-2', name: '1 kg Gift Box', price: 1350, originalPrice: 1550, stock: 42, sku: 'GB-DAT-004-1K' }
    ],
    specifications: [
      { label: 'Origin', value: 'Saudi Arabia' },
      { label: 'Grade', value: 'Jumbo Premium Grade A' },
      { label: 'Texture', value: 'Chewy, soft flesh, naturally moist' },
      { label: 'Sugar Added', value: '0% Added Sugar' }
    ],
    tags: ['dates', 'medjool', 'ramadan', 'khejuri', 'bestseller'],
    isFeatured: true,
    isBestseller: true,
    isOfferZone: true,
    visibility: true
  },
  {
    id: 'prod-5',
    name: 'Sukkari VIP Soft Dates (Khejuri)',
    bengaliName: 'সুক্কারি ভিআইপি গোল্ডেন সফট খেজুর',
    slug: 'sukkari-vip-soft-dates',
    sku: 'GB-DAT-005',
    category: 'dates',
    subcategory: 'Sukkari Soft',
    brand: 'Khejuri Al-Arabia',
    shortDescription: 'Golden-toned melt-in-the-mouth soft dates famed as the dessert of Arabian kings with delicate sweetness.',
    description: 'Sukkari dates are naturally sweet like toffee candies with tender golden flesh. Ideal for daily breakfast, smoothies, and breaking fast with gentle natural energy.',
    price: 750,
    originalPrice: 890,
    discountPercent: 16,
    stock: 50,
    rating: 4.85,
    reviewsCount: 76,
    thumbnail: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80'
    ],
    sizeOrWeight: '1 kg Box',
    specifications: [
      { label: 'Origin', value: 'Al-Qassim, Saudi Arabia' },
      { label: 'Variety', value: 'Sukkari Rutob / Soft' },
      { label: 'Packaging', value: 'Air-sealed food grade box' }
    ],
    tags: ['dates', 'sukkari', 'khejuri', 'featured'],
    isFeatured: true,
    isOfferZone: true,
    visibility: true
  },
  {
    id: 'prod-6',
    name: 'Organic Raw White Chia Seed (Imported)',
    bengaliName: 'আমদানিকৃত প্রিমিয়াম অর্গানিক সাদা চিয়া সিড',
    slug: 'organic-raw-white-chia-seed',
    sku: 'GB-ORG-006',
    category: 'organic',
    subcategory: 'Chia Seed',
    brand: 'Glarvest Pure',
    shortDescription: 'Powerhouse of plant-based Omega-3 fatty acids, dietary fiber, calcium, and clean plant protein for weight balance and heart wellness.',
    description: 'Carefully sorted and triple-cleaned white chia seeds. Absorbs up to 12 times its weight in water to create a nourishing gel that supports gut motility, sustains hydration, and reduces hunger spikes.',
    price: 490,
    originalPrice: 580,
    discountPercent: 15,
    stock: 80,
    rating: 4.8,
    reviewsCount: 65,
    thumbnail: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80'
    ],
    sizeOrWeight: '250 gm',
    variants: [
      { id: 'v6-1', name: '250 gm Pack', price: 490, originalPrice: 580, stock: 45, sku: 'GB-ORG-006-250' },
      { id: 'v6-2', name: '500 gm Pack', price: 890, originalPrice: 1050, stock: 35, sku: 'GB-ORG-006-500' }
    ],
    specifications: [
      { label: 'Origin', value: 'South America (Bolivia / Mexico)' },
      { label: 'Purity', value: '99.9% Cleaned, Chemical Free' },
      { label: 'Nutrients', value: 'Omega-3, Soluble Fiber, Calcium, Protein' }
    ],
    tags: ['chia seed', 'organic', 'glarvest', 'superfood', 'bestseller'],
    isFeatured: true,
    isBestseller: true,
    visibility: true
  },
  {
    id: 'prod-7',
    name: '7-in-1 Premium Mixed Royal Nuts & Dried Fruits',
    bengaliName: 'রয়্যাল মিক্সড ড্রাই ফ্রুটস ও বাদাম (৭ জাতের মিশ্রণ)',
    slug: 'premium-mixed-royal-nuts-dry-fruits',
    sku: 'GB-NUT-007',
    category: 'nuts-seeds',
    subcategory: 'Mixed Nut Pack',
    brand: 'Ghorer Bazar Premium',
    shortDescription: 'Nutrient-rich medley of California Almonds, Roasted Cashews, Walnut Kernels, Pistachios, Golden Raisins, Dried Figs, and Apricots.',
    description: 'A crisp, wholesome energy snack for your family. Carefully roasted with zero added oil, sweetened only by sun-dried fruits. Great for brain vitality, cardiac health, and guilt-free snacking.',
    price: 850,
    originalPrice: 990,
    discountPercent: 14,
    stock: 55,
    rating: 4.9,
    reviewsCount: 88,
    thumbnail: 'https://images.unsplash.com/photo-1536591375315-1b83886562ea?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1536591375315-1b83886562ea?w=800&auto=format&fit=crop&q=80'
    ],
    sizeOrWeight: '500 gm',
    variants: [
      { id: 'v7-1', name: '250 gm Jar', price: 460, originalPrice: 530, stock: 30, sku: 'GB-NUT-007-250' },
      { id: 'v7-2', name: '500 gm Jar', price: 850, originalPrice: 990, stock: 25, sku: 'GB-NUT-007-500' }
    ],
    specifications: [
      { label: 'Contents', value: 'Almond, Cashew, Walnut, Pistachio, Raisin, Fig, Apricot' },
      { label: 'Processing', value: 'Dry air roasted, zero added salt' }
    ],
    tags: ['nuts', 'dry fruits', 'mixed nuts', 'almonds', 'cashews'],
    isFeatured: true,
    isBestseller: true,
    visibility: true
  },
  {
    id: 'prod-8',
    name: 'Fine Ground Himalayan Pink Rock Salt',
    bengaliName: 'খাঁটি হিমালয়ান পিংক সল্ট (পাথর লবণ)',
    slug: 'fine-ground-himalayan-pink-rock-salt',
    sku: 'GB-ORG-008',
    category: 'organic',
    subcategory: 'Pink Salt',
    brand: 'Glarvest Natural',
    shortDescription: 'Unrefined 250 million-year-old crystalline salt packed with 84+ essential trace minerals for electrolyte balance.',
    description: 'Free from anti-caking microplastics and artificial bleach found in industrial table salt. Imparts a subtle mineral finish to daily cooking and morning detox warm drinks.',
    price: 180,
    originalPrice: 220,
    discountPercent: 18,
    stock: 90,
    rating: 4.75,
    reviewsCount: 52,
    thumbnail: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'
    ],
    sizeOrWeight: '500 gm',
    specifications: [
      { label: 'Origin', value: 'Khewra Salt Mine, Himalayan Foothills' },
      { label: 'Texture', value: 'Extra Fine Food Grade' },
      { label: 'Minerals', value: 'Potassium, Magnesium, Calcium, Iron' }
    ],
    tags: ['pink salt', 'organic', 'glarvest', 'himalayan'],
    isFeatured: false,
    visibility: true
  },
  {
    id: 'prod-9',
    name: 'Aromatic Chinigura Polao Rice (Old Crop)',
    bengaliName: 'দিনাজপুরের সুগন্ধি চিনিগুঁড়া পোলাও চাল',
    slug: 'aromatic-chinigura-polao-rice-dinajpur',
    sku: 'GB-RIC-009',
    category: 'rice',
    subcategory: 'Chinigura Aromatic',
    brand: 'Ghorer Bazar Grains',
    shortDescription: 'Traditional Dinajpur heritage scented mini-grain rice aged naturally for maximum fluffy elongation and enticing aroma in biryani and polao.',
    description: 'Sourced directly from certified heritage farmers in Dinajpur. Non-glutinous, aged for over 9 months so grains remain distinct, fragrant, and delicate upon cooking.',
    price: 185,
    originalPrice: 210,
    discountPercent: 12,
    stock: 75,
    rating: 4.88,
    reviewsCount: 63,
    thumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
    ],
    sizeOrWeight: '1 kg Pack',
    variants: [
      { id: 'v9-1', name: '1 kg Pouch', price: 185, originalPrice: 210, stock: 45, sku: 'GB-RIC-009-1K' },
      { id: 'v9-2', name: '5 kg Family Sack', price: 890, originalPrice: 990, stock: 30, sku: 'GB-RIC-009-5K' }
    ],
    specifications: [
      { label: 'Origin', value: 'Dinajpur, Bangladesh' },
      { label: 'Grain Type', value: 'Chinigura Fine Scented' },
      { label: 'Aging', value: 'Naturally Aged Minimum 9 Months' }
    ],
    tags: ['rice', 'chinigura', 'polao', 'biryani'],
    isFeatured: true,
    visibility: true
  },
  {
    id: 'prod-10',
    name: 'Pure Stone Ground Turmeric Powder (Halud Gura)',
    bengaliName: 'পাহাড়ি খাঁটি হলুদের গুঁড়া (উচ্চ কারকিউমিন)',
    slug: 'pure-stone-ground-hill-turmeric-powder',
    sku: 'GB-SPI-010',
    category: 'spices',
    subcategory: 'Turmeric Powder',
    brand: 'Ghorer Bazar Spices',
    shortDescription: 'Sun-dried high-curcumin hill tract turmeric stone ground without dye, lead chromate, or corn starch fillers.',
    description: 'Clean bright golden color and earthy fragrance. High natural curcumin concentration ensures superior antioxidant value, beautiful food coloration, and natural healing properties.',
    price: 190,
    originalPrice: 230,
    discountPercent: 17,
    stock: 60,
    rating: 4.82,
    reviewsCount: 41,
    thumbnail: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop&q=80'
    ],
    sizeOrWeight: '250 gm',
    specifications: [
      { label: 'Origin', value: 'Bandarban & Khagrachari Hills' },
      { label: 'Curcumin Level', value: 'Above 4.8%' },
      { label: 'Purity', value: '100% Free of Lead Chromate & Artificial Dyes' }
    ],
    tags: ['spices', 'turmeric', 'halud', 'organic'],
    isFeatured: false,
    visibility: true
  },
  {
    id: 'prod-11',
    name: 'Sreemangal Organic Longing Green Tea',
    bengaliName: 'শ্রীমঙ্গল অর্গানিক গ্রিন টি (হোল লিফ)',
    slug: 'sreemangal-organic-longing-green-tea',
    sku: 'GB-BEV-011',
    category: 'beverage',
    subcategory: 'Organic Green Tea',
    brand: 'Glarvest Organic',
    shortDescription: 'Tender top two leaves and bud handpicked from highland estates of Sreemangal for delicate grassy sweetness and polyphenol richness.',
    description: 'Whole leaf tea that unrolls beautifully in hot water. Smooth grassy notes without harsh bitterness. Enhances metabolic rate, mental alertness, and everyday digestion.',
    price: 320,
    originalPrice: 380,
    discountPercent: 15,
    stock: 40,
    rating: 4.78,
    reviewsCount: 39,
    thumbnail: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
    ],
    sizeOrWeight: '100 gm Canister',
    specifications: [
      { label: 'Origin', value: 'Sreemangal, Sylhet, Bangladesh' },
      { label: 'Leaf Grade', value: 'Whole Leaf First Flush' },
      { label: 'Caffeine', value: 'Low to Moderate' }
    ],
    tags: ['tea', 'green tea', 'beverage', 'sreemangal'],
    isFeatured: true,
    visibility: true
  },
  {
    id: 'prod-12',
    name: 'Homemade Spicy Garlic Mustard Pickle (Roshun Achar)',
    bengaliName: 'খাঁটি সরিষার তেলে রসুন ও কাঁচা মরিচের আচার',
    slug: 'homemade-spicy-garlic-mustard-pickle',
    sku: 'GB-PCK-012',
    category: 'pickle',
    subcategory: 'Garlic Pickle',
    brand: 'Ghorer Bazar Traditional',
    shortDescription: 'Whole garlic cloves immersed in cold-pressed mustard oil with roasted five spices (Panch Phoron) and sun-ripened under natural sunlight.',
    description: 'Prepared using traditional grandmother village recipe. No synthetic vinegar or chemical stabilizers. Heart-friendly garlic infused with punchy mustard oil and spices makes every meal an appetite fest.',
    price: 290,
    originalPrice: 340,
    discountPercent: 15,
    stock: 35,
    rating: 4.9,
    reviewsCount: 78,
    thumbnail: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80'
    ],
    sizeOrWeight: '400 gm Glass Jar',
    specifications: [
      { label: 'Key Ingredients', value: 'Deshi Garlic, Ghani Mustard Oil, Panch Phoron, Green Chili' },
      { label: 'Sun-cured', value: '14 Days Sun Bathing' }
    ],
    tags: ['pickle', 'garlic', 'achar', 'traditional'],
    isFeatured: false,
    visibility: true
  }
];

export const initialHeroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Pure Sundarban Wild Honey',
    bengaliTitle: 'প্রকৃতির সেরা খাঁটি মধু',
    subtitle: '১০০% ভেজালমুক্ত ও প্রাকৃতিক পুষ্টি',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1600&auto=format&fit=crop&q=85',
    badge: '১০০% খাঁটি',
    ctaText: 'Explore',
    ctaLink: '/shop?category=honey',
    active: true,
    order: 1
  },
  {
    id: 'slide-2',
    title: 'Wood-Pressed Mustard Oil',
    bengaliTitle: 'কাঠের ঘানির খাঁটি সরিষার তেল',
    subtitle: 'প্রাকৃতিক ঝাঁজ ও আসল স্বাদ',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1600&auto=format&fit=crop&q=85',
    badge: 'ঘানি ভাঙা',
    ctaText: 'Explore',
    ctaLink: '/shop?category=oil-ghee',
    active: true,
    order: 2
  },
  {
    id: 'slide-3',
    title: 'Royal Madinah Dates',
    bengaliTitle: 'মদিনার প্রিমিয়াম আজওয়া খেজুর',
    subtitle: 'সরাসরি বাগান থেকে বাছাইকৃত',
    imageUrl: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=1600&auto=format&fit=crop&q=85',
    badge: 'প্রিমিয়াম',
    ctaText: 'Explore',
    ctaLink: '/shop?category=dates',
    active: true,
    order: 3
  }
];

export const initialPromoBanner: PromoBanner = {
  id: 'promo-1',
  title: 'Raw Organic Wild Honey',
  bengaliTitle: 'খাঁটি বুনো মধু ও অর্গানিক ফুড',
  description: 'শতভাগ প্রাকৃতিক ও সেরা পুষ্টির নিশ্চয়তা',
  imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1000&auto=format&fit=crop&q=85',
  badge: 'স্পেশাল কালেকশন',
  ctaText: 'Explore',
  ctaLink: '/shop?category=honey',
  bullets: [],
  active: true
};

export const initialCoupons: Coupon[] = [
  {
    code: 'GHORER10',
    type: 'percent',
    value: 10,
    minOrder: 800,
    maxDiscount: 300,
    expiryDate: '2026-12-31',
    usageCount: 145,
    maxUsage: 1000,
    isActive: true
  },
  {
    code: 'PUREFOOD',
    type: 'percent',
    value: 15,
    minOrder: 1500,
    maxDiscount: 500,
    expiryDate: '2026-10-31',
    usageCount: 89,
    maxUsage: 500,
    isActive: true
  },
  {
    code: 'WELCOME50',
    type: 'fixed',
    value: 50,
    minOrder: 500,
    expiryDate: '2026-12-31',
    usageCount: 312,
    maxUsage: 2000,
    isActive: true
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'GB-24091',
    date: '2026-09-15 14:32',
    customer: {
      name: 'Tanvir Ahmed',
      phone: '01711223344',
      email: 'tanvir.ahmed@example.com',
      address: 'House 42, Road 7, Sector 3, Uttara',
      city: 'Dhaka',
      area: 'Uttara',
      postalCode: '1230',
      deliveryNote: 'Please ring bell upon arrival, handle glass honey jar with care.'
    },
    items: [
      {
        productId: 'prod-1',
        variantId: 'v1-2',
        variantName: '500 gm Glass Jar',
        name: 'Sundarban Natural Wild Raw Honey',
        price: 950,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
        total: 950
      },
      {
        productId: 'prod-2',
        variantId: 'v2-1',
        variantName: '1 Litre Pet Bottle',
        name: 'Traditional Wood Pressed Mustard Oil',
        price: 360,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
        total: 720
      }
    ],
    subtotal: 1670,
    deliveryCharge: 70,
    discount: 100,
    couponCode: 'GHORER10',
    total: 1640,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'shipped',
    courierName: 'Steadfast Courier',
    trackingCode: 'ST-9832104',
    trackingHistory: [
      {
        status: 'pending',
        title: 'Order Placed',
        description: 'Order received and verified by customer service team.',
        timestamp: '15 Sep 2026, 02:32 PM',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Inventory allocated and quality inspected at Tejgaon central hub.',
        timestamp: '15 Sep 2026, 03:15 PM',
        completed: true
      },
      {
        status: 'processing',
        title: 'Packaging Complete',
        description: 'Safely packed in eco-friendly bubble-wrap box.',
        timestamp: '15 Sep 2026, 06:40 PM',
        completed: true
      },
      {
        status: 'shipped',
        title: 'Handed to Delivery Agent',
        description: 'Rider assigned (Rahim Miah, +880 1819-001122). On transit to Uttara Hub.',
        timestamp: '16 Sep 2026, 09:20 AM',
        completed: true,
        current: true
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Package delivered to customer.',
        timestamp: 'Expected today by 6:00 PM',
        completed: false
      }
    ]
  },
  {
    id: 'ord-2',
    orderNumber: 'GB-24088',
    date: '2026-09-14 10:15',
    customer: {
      name: 'Nusrat Jahan',
      phone: '01822334455',
      email: 'nusrat.jahan@example.com',
      address: 'Flat B3, Green View Tower, Nasirabad',
      city: 'Chittagong',
      area: 'Nasirabad',
      postalCode: '4000'
    },
    items: [
      {
        productId: 'prod-4',
        variantId: 'v4-2',
        variantName: '1 kg Gift Box',
        name: 'Saudi Medjool Premium Jumbo Dates',
        price: 1350,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=800&auto=format&fit=crop&q=80',
        total: 1350
      },
      {
        productId: 'prod-3',
        variantId: 'v3-1',
        variantName: '400 gm Glass Jar',
        name: 'Village Gawa Pure Cow Ghee',
        price: 880,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=800&auto=format&fit=crop&q=80',
        total: 880
      }
    ],
    subtotal: 2230,
    deliveryCharge: 0,
    discount: 150,
    couponCode: 'PUREFOOD',
    total: 2080,
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    status: 'delivered',
    courierName: 'Pathao Courier',
    trackingCode: 'PT-881920',
    trackingHistory: [
      {
        status: 'pending',
        title: 'Order Placed',
        description: 'Order placed with bKash Online Payment.',
        timestamp: '14 Sep 2026, 10:15 AM',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Payment Verified & Confirmed',
        description: 'Transaction ID: 9LK3M91J verified.',
        timestamp: '14 Sep 2026, 10:25 AM',
        completed: true
      },
      {
        status: 'shipped',
        title: 'In Transit to Chittagong',
        description: 'Shipped via overnight inter-district air/road courier.',
        timestamp: '14 Sep 2026, 05:00 PM',
        completed: true
      },
      {
        status: 'delivered',
        title: 'Delivered Successfully',
        description: 'Received and signed by customer.',
        timestamp: '15 Sep 2026, 01:45 PM',
        completed: true,
        current: true
      }
    ]
  }
];

export const demoUser: User = {
  id: 'usr-customer-1',
  name: 'Tanvir Ahmed',
  email: 'tanvir.ahmed@example.com',
  phone: '01711223344',
  role: 'customer',
  createdAt: '2025-11-10',
  addresses: [
    {
      id: 'addr-1',
      title: 'Home Address',
      recipientName: 'Tanvir Ahmed',
      phone: '01711223344',
      address: 'House 42, Road 7, Sector 3, Uttara',
      city: 'Dhaka',
      area: 'Uttara',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'Office Address',
      recipientName: 'Tanvir Ahmed',
      phone: '01711223344',
      address: 'Level 8, Concord Tower, Gulshan-2',
      city: 'Dhaka',
      area: 'Gulshan',
      isDefault: false
    }
  ]
};

export const demoAdminUser: User = {
  id: 'usr-admin-1',
  name: 'Rajin Ujaer (Admin)',
  email: 'rajinujaer6@gmail.com',
  phone: '01900000000',
  role: 'admin',
  createdAt: '2024-01-01',
  addresses: []
};

export const initialReviews: Record<string, { id: string; user: string; rating: number; date: string; comment: string; verified: boolean }[]> = {
  'prod-1': [
    {
      id: 'rev-1',
      user: 'Ashfaqur Rahman',
      rating: 5,
      date: '10 Sep 2026',
      comment: 'একদম প্রাকৃতিক সুন্দরবনের আসল মধুর ঘ্রাণ ও স্বাদ! পানির সাথে মিশিয়ে সকালে খেলে সারাদিন শরীর সতেজ থাকে। ঘরের বাজারের প্যাকেজিং অসাধারণ ছিল।',
      verified: true
    },
    {
      id: 'rev-2',
      user: 'Fatema Tuz Zohra',
      rating: 5,
      date: '02 Sep 2026',
      comment: 'Authentic pure wild honey. The slight sting and natural aroma prove it is completely raw and unfiltered. Will order regularly.',
      verified: true
    },
    {
      id: 'rev-3',
      user: 'Kamrul Islam',
      rating: 4,
      date: '28 Aug 2026',
      comment: 'Quality is very good. Fast delivery in Dhanmondi within 24 hours. Highly recommended.',
      verified: true
    }
  ],
  'prod-2': [
    {
      id: 'rev-4',
      user: 'Nazmul Hossain',
      rating: 5,
      date: '05 Sep 2026',
      comment: 'ঘানির তেলের এমন তীব্র খাঁটি ঝাঁজ এখন আর বাজারে পাওয়া যায় না। ইলিশ মাছ ও ভর্তায় অসাধারণ স্বাদ হয়েছে।',
      verified: true
    }
  ],
  'prod-3': [
    {
      id: 'rev-5',
      user: 'Dr. Shahriar Kabir',
      rating: 5,
      date: '08 Sep 2026',
      comment: 'Wonderful granular danader texture and sweet dairy aroma. Reminds me of pure village gawa ghee from childhood.',
      verified: true
    }
  ]
};
