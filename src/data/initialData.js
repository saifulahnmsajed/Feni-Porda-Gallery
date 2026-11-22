export const INITIAL_PRODUCTS = [
  // ফোম (Foam)
  {
    id: "prod-1",
    name: "Orthopedic Foam Mattress Sheet (4\" x 7')",
    banglaName: "অর্থোপেডিক ফোম শিট (৪\" x ৭')",
    category: "ফোম (Foam)",
    sku: "FM-ORTH-47",
    price: 4500,
    costPrice: 3500,
    stock: 14,
    minStockAlert: 4,
    unit: "পিস",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=80",
    description: "উচ্চ ঘনত্বের আরামদায়ক অর্থোপেডিক ফোম শিট। পিঠের ব্যথায় আরামদায়ক এবং দীর্ঘস্থায়ী।"
  },
  {
    id: "prod-2",
    name: "High Density Sofa Cushion Foam (22\" x 22\" x 4\")",
    banglaName: "হাই ডেনসিটি সোফা কুশন ফোম (২২\" x ২২\" x ৪\")",
    category: "ফোম (Foam)",
    sku: "FM-CSH-22",
    price: 680,
    costPrice: 480,
    stock: 35,
    minStockAlert: 8,
    unit: "পিস",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
    description: "সোফার জন্য প্রিমিয়াম কোয়ালিটি স্পেশাল বাউন্স কুশন ফোম। সহজে ডেবে যায় না।"
  },
  {
    id: "prod-3",
    name: "Standard Cut Foam Roll Sheet (Per Yard)",
    banglaName: "স্ট্যান্ডার্ড কাটিং ফোম শিট (গজ হিসেবে)",
    category: "ফোম (Foam)",
    sku: "FM-CUT-YD",
    price: 320,
    costPrice: 220,
    stock: 3, // intentionally low stock for testing alert
    minStockAlert: 5,
    unit: "গজ",
    image: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?w=600&auto=format&fit=crop&q=80",
    description: "বক্স খাট ও চেয়ারে ব্যবহারের উপযোগী বিভিন্ন মাপের কাটিং ফোম রোল।"
  },

  // পর্দা (Curtains)
  {
    id: "prod-4",
    name: "Royal Velvet Eyelet Ring Curtain (7 Feet)",
    banglaName: "রয়্যাল ভেলভেট রিং পর্দা (৭ ফিট)",
    category: "পর্দা (Curtain)",
    sku: "CT-VEL-07",
    price: 1250,
    costPrice: 850,
    stock: 22,
    minStockAlert: 5,
    unit: "পিস",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    description: "ড্রয়িং রুম ও বেডরুমের জন্য লাক্সারি ভেলভেট কাপড় ও স্টিল আইলেট রিং যুক্ত রেডিমেড পর্দা।"
  },
  {
    id: "prod-5",
    name: "Floral Sheer Net Window Curtain (5.5 Feet)",
    banglaName: "ফ্লোরাল নেট উইন্ডো পর্দা (৫.৫ ফিট)",
    category: "পর্দা (Curtain)",
    sku: "CT-NET-55",
    price: 520,
    costPrice: 340,
    stock: 28,
    minStockAlert: 6,
    unit: "পিস",
    image: "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=600&auto=format&fit=crop&q=80",
    description: "আলো-বাতাস প্রবেশের উপযোগী সুন্দর ফ্লোরাল ডিজাইনের নেট পর্দা।"
  },
  {
    id: "prod-6",
    name: "100% Blackout Heavy Thermal Curtain (8 Feet)",
    banglaName: "১০০% ব্ল্যাকআউট থার্মাল পর্দা (৮ ফিট)",
    category: "পর্দা (Curtain)",
    sku: "CT-BLK-08",
    price: 1650,
    costPrice: 1150,
    stock: 12,
    minStockAlert: 4,
    unit: "পিস",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80",
    description: "বাইরের কড়া রোদ ও শব্দ প্রতিরোধক ট্রিপল উইভ ব্ল্যাকআউট পর্দা।"
  },

  // বালিশ ও কুশন (Pillows & Cushions)
  {
    id: "prod-7",
    name: "Microfiber Hotel Quality Soft Pillow (18\" x 26\")",
    banglaName: "মাইক্রোফাইবার সফট স্লিপিং বালিশ (১৮\" x ২৬\")",
    category: "বালিশ (Pillows)",
    sku: "PL-MIC-18",
    price: 480,
    costPrice: 320,
    stock: 45,
    minStockAlert: 10,
    unit: "পিস",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80",
    description: "হোটেল স্ট্যান্ডার্ড এক্সট্রা সফট সিলিকন মাইক্রোফাইবার বালিশ, ধোয়া যায় ও অ্যালার্জি প্রতিরোধী।"
  },
  {
    id: "prod-8",
    name: "Master Bed Fiber Bolster / Kol Balish",
    banglaName: "মাস্টার বেড সাইজ কোলবালিশ",
    category: "বালিশ (Pillows)",
    sku: "PL-BOL-01",
    price: 750,
    costPrice: 500,
    stock: 18,
    minStockAlert: 5,
    unit: "পিস",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80",
    description: "ভারী তুলার পরিবর্তে প্রিমিয়াম বল ফাইবার দ্বারা তৈরি টেকসই ও আরামদায়ক কোলবালিশ।"
  },
  {
    id: "prod-9",
    name: "Square Sofa Cushion with Filler (16\" x 16\")",
    banglaName: "সোফা কুশন উইথ ফিলার (১৬\" x ১৬\")",
    category: "বালিশ (Pillows)",
    sku: "PL-CSH-16",
    price: 290,
    costPrice: 180,
    stock: 2, // low stock alert
    minStockAlert: 8,
    unit: "পিস",
    image: "https://images.unsplash.com/photo-1584100936772-23c2a6bf95fc?w=600&auto=format&fit=crop&q=80",
    description: "সোফায় সাজানোর জন্য পারফেক্ট সাইজ চারকোনা কুশন ফিলার।"
  },

  // কভার ও চাদর (Covers & Bedding)
  {
    id: "prod-10",
    name: "Universal Stretchable 7-Seater Sofa Cover Set",
    banglaName: "৭ সিটের স্ট্রেচাবল ফুল সোফা কভার সেট (৩+২+১+১)",
    category: "কভার (Covers)",
    sku: "CV-SOFA-07",
    price: 3200,
    costPrice: 2400,
    stock: 9,
    minStockAlert: 3,
    unit: "সেট",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    description: "যেকোনো সোফায় সহজে ফিট হওয়া ইলাস্টিক জ্যাকার্ড ফেব্রিকের সম্পূর্ণ সোফা কভার সেট।"
  },
  {
    id: "prod-11",
    name: "King Size 100% Cotton Bed Sheet with 2 Pillow Covers",
    banglaName: "কিং সাইজ ১০০% সুতি বেডশিট ও ২ টি বালিশ কভার",
    category: "কভার (Covers)",
    sku: "CV-BED-KNG",
    price: 1190,
    costPrice: 820,
    stock: 24,
    minStockAlert: 6,
    unit: "সেট",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80",
    description: "রং উঠবে না এমন গ্যারান্টিযুক্ত প্রিমিয়াম কটনের কিং সাইজ চাদর ও বালিশের কভার।"
  },
  {
    id: "prod-12",
    name: "Waterproof Quilted Mattress Protector (King Size)",
    banglaName: "ওয়াটারপ্রুফ কুইল্টেড তোশক/ম্যাট্রেস প্রোটেক্টর",
    category: "কভার (Covers)",
    sku: "CV-PROT-01",
    price: 980,
    costPrice: 690,
    stock: 15,
    minStockAlert: 4,
    unit: "পিস",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80",
    description: "পানি, ময়লা ও তরল পদার্থ থেকে মূল্যবান গদি ও ম্যাট্রেস সুরক্ষিত রাখার ১০০% ওয়াটারপ্রুফ কভার।"
  },
  {
    id: "prod-13",
    name: "Luxury Embroidered Cushion Cover Pair (2 Pcs)",
    banglaName: "এমব্রয়ডারি কুশন কভার জোড়া (২ পিস)",
    category: "কভার (Covers)",
    sku: "CV-CSH-PR",
    price: 380,
    costPrice: 230,
    stock: 40,
    minStockAlert: 8,
    unit: "জোড়া",
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&auto=format&fit=crop&q=80",
    description: "আকর্ষণীয় সুতার কাজ করা ভেলভেট কুশন কভার।"
  },

  // কাপড় ও ক্লথস (Clothes & Fabrics)
  {
    id: "prod-14",
    name: "Heavy Jacquard Curtain Fabric (Per Yard)",
    banglaName: "হেভি জ্যাকার্ড পর্দার থান কাপড় (প্রতি গজ)",
    category: "কাপড় (Fabrics)",
    sku: "CL-JAC-YD",
    price: 240,
    costPrice: 165,
    stock: 85,
    minStockAlert: 20,
    unit: "গজ",
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&auto=format&fit=crop&q=80",
    description: "পর্দা, সোফা ও কুশন তৈরির জন্য উন্নতমানের মোটা টেক্সচার্ড জ্যাকার্ড ফেব্রিক।"
  },
  {
    id: "prod-15",
    name: "Pure Cotton Sheeting Fabric for Covers (Per Yard)",
    banglaName: "খাঁটি সুতি চাদর ও কভারের থান কাপড় (প্রতি গজ)",
    category: "কাপড় (Fabrics)",
    sku: "CL-COT-YD",
    price: 140,
    costPrice: 95,
    stock: 140,
    minStockAlert: 25,
    unit: "গজ",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80",
    description: "আরামদায়ক সুতি কাপড়, চাদর ও বালিশের কভার তৈরির উপযোগী।"
  }
];

export const CATEGORIES = [
  "সব (All)",
  "ফোম (Foam)",
  "পর্দা (Curtain)",
  "বালিশ (Pillows)",
  "কভার (Covers)",
  "কাপড় (Fabrics)"
];

export const INITIAL_SHOP_SETTINGS = {
  storeName: "ফেনী পর্দা গ্যালারী (Feni Porda Gallery)",
  storeSubtitle: "ঘরের সৌন্দর্যে নতুন ছোঁয়া — প্রিমিয়াম পর্দা • আধুনিক ডিজাইন • সাশ্রয়ী মূল্য",
  logoUrl: `${import.meta.env.BASE_URL}logo.jpg`,
  bannerUrl: `${import.meta.env.BASE_URL}banner.webp`,
  proprietor: "প্রোঃ মোঃ সেলিম",
  phone: "০১৮১৮-০৫৬৩৫৪ / ০১৯১৮-২৪৪৬৯০",
  email: "fenipordagallery@gmail.com",
  address: "হক প্লাজা (এ.বি. ব্যাংক এর নিচে), শহীদ শহীদুল্লাহ কায়সার সড়ক, ফেনী",
  website: "www.fenipordagallery.com",
  currency: "৳",
  invoiceFooter: "আমাদের পণ্য কেনার জন্য আন্তরিক ধন্যবাদ। ৩ দিনের মধ্যে মেমোসহ পরিবর্তনযোগ্য।"
};

export const INITIAL_SALES = [
  {
    id: "POS-1001",
    date: new Date(Date.now() - 3600000 * 4).toISOString(),
    customerName: "মোঃ রফিকুল ইসলাম",
    customerPhone: "01711223344",
    items: [
      { id: "prod-4", name: "Royal Velvet Eyelet Ring Curtain (7 Feet)", price: 1250, costPrice: 850, quantity: 2, total: 2500 },
      { id: "prod-7", name: "Microfiber Hotel Quality Soft Pillow (18\" x 26\")", price: 480, costPrice: 320, quantity: 2, total: 960 }
    ],
    subtotal: 3460,
    discount: 160,
    total: 3300,
    totalCost: 2340,
    profit: 960,
    paidAmount: 3300,
    change: 0,
    paymentMethod: "Cash",
    notes: "কাউন্টার ক্যাশ সেল"
  },
  {
    id: "POS-1002",
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    customerName: "সুলতানা বেগম",
    customerPhone: "01822334455",
    items: [
      { id: "prod-10", name: "Universal Stretchable 7-Seater Sofa Cover Set", price: 3200, costPrice: 2400, quantity: 1, total: 3200 }
    ],
    subtotal: 3200,
    discount: 200,
    total: 3000,
    totalCost: 2400,
    profit: 600,
    paidAmount: 3000,
    change: 0,
    paymentMethod: "bKash",
    notes: "বিকাশ ট্রানজেকশন আইডি: 9B7X24K"
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-801",
    date: new Date(Date.now() - 3600000 * 6).toISOString(),
    customerName: "ফারহানা হক",
    customerPhone: "01933445566",
    deliveryAddress: "বাড়ি # ১২, রোড # ৪, ধানমন্ডি, ঢাকা",
    items: [
      { id: "prod-11", name: "King Size 100% Cotton Bed Sheet with 2 Pillow Covers", price: 1190, quantity: 2, total: 2380 },
      { id: "prod-8", name: "Master Bed Fiber Bolster / Kol Balish", price: 750, quantity: 1, total: 750 }
    ],
    subtotal: 3130,
    deliveryFee: 100,
    total: 3230,
    status: "Pending", // Pending, Confirmed, Shipped, Delivered, Cancelled
    paymentMethod: "Cash on Delivery",
    notes: "কাল সকাল ১১টার মধ্যে পাঠালে ভালো হয়।"
  },
  {
    id: "ORD-802",
    date: new Date(Date.now() - 3600000 * 24).toISOString(),
    customerName: "তানভীর হাসান",
    customerPhone: "01655667788",
    deliveryAddress: "সেক্টর # ৭, উত্তরা, ঢাকা",
    items: [
      { id: "prod-1", name: "Orthopedic Foam Mattress Sheet (4\" x 7')", price: 4500, quantity: 1, total: 4500 }
    ],
    subtotal: 4500,
    deliveryFee: 150,
    total: 4650,
    status: "Confirmed",
    paymentMethod: "bKash",
    notes: "ফোনের মাধ্যমে অর্ডার কনফার্ম করা হয়েছে।"
  }
];

export const INITIAL_USERS = [
  {
    id: "user-admin",
    name: "দোকান ম্যানেজার (Admin)",
    phone: "01789123456",
    email: "admin@fpg.com",
    role: "admin",
    password: "admin",
    address: "ফেনী পর্দা গ্যালারী, ফেনী"
  },
  {
    id: "user-cust-1",
    name: "মোঃ রফিকুল ইসলাম",
    phone: "01711223344",
    email: "customer@gmail.com",
    role: "customer",
    password: "123",
    address: "বাড়ি # ১২, মেইন রোড, ফেনী"
  }
];
