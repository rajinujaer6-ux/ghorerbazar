import React, { useState, useMemo } from 'react';
import {
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  Clock,
  Settings,
  RefreshCw,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  X,
  ShieldCheck,
  Lock,
  Tag,
  Users,
  Printer,
  Phone,
  MessageSquare,
  Copy,
  ExternalLink,
  ChevronDown,
  Check,
  ArrowRight,
  Save,
  Megaphone,
  CreditCard,
  Percent,
  Sliders,
  Store,
  MapPin
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus, Coupon } from '../types';

interface AdminDashboardProps {
  onNavigate: (view: string, param?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    updatePaymentStatus,
    updateOrder,
    coupons,
    addCoupon,
    toggleCouponStatus,
    deleteCoupon,
    settings,
    updateSettings,
    formatPrice,
    addToast,
    resetToInitialData,
    isAdmin,
    currentUser
  } = useStore();

  // Active Tab: 'overview' | 'orders' | 'products' | 'coupons' | 'customers' | 'settings' | 'banners'
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'coupons' | 'customers' | 'settings' | 'banners'
  >('overview');

  // --- Products State ---
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [pName, setPName] = useState('');
  const [pBengaliName, setPBengaliName] = useState('');
  const [pCategory, setPCategory] = useState('organic-honey');
  const [pPrice, setPPrice] = useState(650);
  const [pOriginalPrice, setPOriginalPrice] = useState<number | undefined>(750);
  const [pStock, setPStock] = useState(50);
  const [pImage, setPImage] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pIsFeatured, setPIsFeatured] = useState(true);

  // Preset demo image picker for easy adding
  const presetFoodImages = [
    { label: 'Honey (মধু)', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600' },
    { label: 'Mustard Oil (সরিষার তেল)', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600' },
    { label: 'Dates / Khejur (খেজুর)', url: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?auto=format&fit=crop&q=80&w=600' },
    { label: 'Ghee (খাঁটি ঘি)', url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=600' },
    { label: 'Chia Seed (চিয়া সিড)', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600' },
    { label: 'Pickle / Achar (আচার)', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600' },
  ];

  // --- Orders State ---
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [courierModalOrder, setCourierModalOrder] = useState<Order | null>(null);
  const [courierNameInput, setCourierNameInput] = useState('Steadfast Courier');
  const [trackingCodeInput, setTrackingCodeInput] = useState('');

  // --- Coupons State ---
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percent' | 'fixed'>('percent');
  const [couponValue, setCouponValue] = useState(10);
  const [couponMinOrder, setCouponMinOrder] = useState(500);
  const [couponExpiry, setCouponExpiry] = useState('2026-12-31');

  // --- Store Settings State ---
  const [storeName, setStoreName] = useState(settings.storeName || 'GHORER BAZAR');
  const [storeBengaliName, setStoreBengaliName] = useState(settings.storeBengaliName || 'ঘরের বাজার');
  const [bannerText, setBannerText] = useState(settings.announcementBarText || '🌿 খাঁটি ও স্বাস্থ্যসম্মত পণ্যের নিশ্চয়তা | সারাদেশে দ্রুত হোম ডেলিভারি | কল করুন: ০৯৬১৩-৮২৭৮২৭');
  const [showAnnouncement, setShowAnnouncement] = useState(settings.showAnnouncementBar ?? true);
  const [dhakaCharge, setDhakaCharge] = useState(settings.deliveryChargeDhaka ?? 70);
  const [outsideCharge, setOutsideCharge] = useState(settings.deliveryChargeOutside ?? 130);
  const [freeThreshold, setFreeThreshold] = useState(settings.freeDeliveryThreshold ?? 2000);
  const [phone, setPhone] = useState(settings.contactPhone || '+880 9613-827827');
  const [whatsapp, setWhatsapp] = useState(settings.whatsappNumber || '+880 1700-000000');
  const [bkashNumber, setBkashNumber] = useState(settings.bkashNumber || '01700-112233 (Merchant)');
  const [nagadNumber, setNagadNumber] = useState(settings.nagadNumber || '01800-445566 (Personal)');

  // Metrics
  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0),
    [orders]
  );
  const lowStockCount = useMemo(() => products.filter((p) => p.stock < 15).length, [products]);
  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'pending').length, [orders]);
  const deliveredOrders = useMemo(() => orders.filter((o) => o.status === 'delivered').length, [orders]);
  const activeCouponsCount = useMemo(() => coupons.filter((c) => c.isActive).length, [coupons]);

  // Derived Customers List from all orders
  const customersList = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; email?: string; address: string; city: string; orderCount: number; totalSpent: number }>();
    orders.forEach((ord) => {
      const key = ord.customer.phone || ord.customer.name;
      const existing = map.get(key);
      const addr = typeof ord.customer.address === 'string' ? ord.customer.address : (ord.customer.address as any)?.streetAddress || '';
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += ord.total;
      } else {
        map.set(key, {
          name: ord.customer.name,
          phone: ord.customer.phone,
          email: ord.customer.email,
          address: addr,
          city: ord.customer.city,
          orderCount: 1,
          totalSpent: ord.total,
        });
      }
    });
    return Array.from(map.values());
  }, [orders]);

  // Access Control Guard
  if (!isAdmin) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl border border-red-100 shadow-xl p-8 sm:p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-6 shadow-xs">
            <Lock className="w-10 h-10" />
          </div>

          <span className="inline-block px-3.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
            Access Denied / প্রবেশাধিকার সংরক্ষিত
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            অ্যাডমিন প্যানেল শুধুমাত্র অনুমোদিত আইডির জন্য
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-lg mx-auto">
            এই অ্যাডমিন প্যানেলে শুধুমাত্র অনুমোদিত অ্যাডমিন আইডি{' '}
            <strong className="text-slate-900 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              rajinujaer6@gmail.com
            </strong>{' '}
            দিয়ে লগইন করলেই প্রবেশ ও নিয়ন্ত্রণ করা যাবে। অন্য কোনো আইডি দিয়ে লগইন করলে অ্যাডমিন প্যানেল শো হবে না।
          </p>

          {currentUser && (
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-700">বর্তমানে লগইন আছেন:</p>
                <p className="text-slate-900 font-bold">
                  {currentUser.name} ({currentUser.email || currentUser.phone})
                </p>
                <p className="text-slate-500">পদবী: {currentUser.role}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-bold text-[11px]">
                অননুমোদিত
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              হোম পেইজে যান
            </button>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              লগইন পেইজে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Product Handlers ---
  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setPName('');
    setPBengaliName('');
    setPCategory('organic');
    setPPrice(500);
    setPOriginalPrice(600);
    setPStock(40);
    setPImage(presetFoodImages[0].url);
    setPDescription('১০০% খাঁটি ও স্বাস্থ্যসম্মত অর্গানিক পণ্য।');
    setPIsFeatured(true);
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setPName(p.name);
    setPBengaliName(p.bengaliName || '');
    setPCategory(p.category);
    setPPrice(p.price);
    setPOriginalPrice(p.originalPrice);
    setPStock(p.stock);
    setPImage(p.thumbnail);
    setPDescription(p.description);
    setPIsFeatured(p.isFeatured ?? true);
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: pName,
        bengaliName: pBengaliName,
        category: pCategory,
        price: Number(pPrice),
        originalPrice: pOriginalPrice ? Number(pOriginalPrice) : undefined,
        stock: Number(pStock),
        thumbnail: pImage,
        description: pDescription,
        isFeatured: pIsFeatured,
      });
      addToast('success', 'পণ্য আপডেট সম্পন্ন', `${pName} সফলভাবে পরিবর্তিত হয়েছে।`);
    } else {
      addProduct({
        name: pName,
        bengaliName: pBengaliName,
        slug: pName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: pCategory,
        price: Number(pPrice),
        originalPrice: pOriginalPrice ? Number(pOriginalPrice) : undefined,
        rating: 5.0,
        reviewsCount: 1,
        stock: Number(pStock),
        sku: `GB-${Math.floor(1000 + Math.random() * 9000)}`,
        thumbnail: pImage,
        images: [pImage],
        description: pDescription,
        shortDescription: pDescription.slice(0, 100),
        brand: 'Ghorer Bazar',
        isFeatured: pIsFeatured,
        visibility: true,
        specifications: [
          { label: 'Origin', value: 'Bangladesh' },
          { label: 'Quality', value: '100% Pure & Organic' }
        ],
        tags: [pCategory, 'pure', 'organic']
      });
      addToast('success', 'নতুন পণ্য যুক্ত হয়েছে', `${pName} স্টোরে যোগ করা হয়েছে।`);
    }
    setShowProductModal(false);
  };

  const handleQuickAdjustStock = (prodId: string, amount: number) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;
    const newStock = Math.max(0, prod.stock + amount);
    updateProduct(prodId, { stock: newStock });
    addToast('info', 'স্টক আপডেট', `${prod.name}: বর্তমান স্টক ${newStock} টি`);
  };

  // --- Orders Courier Handler ---
  const handleOpenCourierModal = (order: Order) => {
    setCourierModalOrder(order);
    setCourierNameInput(order.courierName || 'Steadfast Courier');
    setTrackingCodeInput(order.trackingCode || `CN-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleSaveCourier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courierModalOrder) return;
    updateOrder(courierModalOrder.id, {
      courierName: courierNameInput,
      trackingCode: trackingCodeInput,
      status: courierModalOrder.status === 'pending' || courierModalOrder.status === 'confirmed' ? 'shipped' : courierModalOrder.status
    });
    addToast('success', 'কুরিয়ার আপডেট', `অর্ডার #${courierModalOrder.orderNumber} এর জন্য ${courierNameInput} সেট করা হয়েছে।`);
    setCourierModalOrder(null);
  };

  // --- Coupon Handlers ---
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const cleanCode = couponCode.trim().toUpperCase().replace(/\s+/g, '');
    const newCoupon: Coupon = {
      code: cleanCode,
      type: couponType,
      value: Number(couponValue),
      minOrder: Number(couponMinOrder),
      expiryDate: couponExpiry,
      usageCount: 0,
      maxUsage: 1000,
      isActive: true
    };
    addCoupon(newCoupon);
    setCouponCode('');
    addToast('success', 'কুপন তৈরি হয়েছে', `প্রোমো কোড ${cleanCode} সক্রিয় করা হয়েছে।`);
  };

  // --- Settings Handler ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      storeBengaliName,
      announcementBarText: bannerText,
      showAnnouncementBar: showAnnouncement,
      deliveryChargeDhaka: Number(dhakaCharge),
      deliveryChargeOutside: Number(outsideCharge),
      freeDeliveryThreshold: Number(freeThreshold),
      contactPhone: phone,
      whatsappNumber: whatsapp,
      bkashNumber,
      nagadNumber
    });
    addToast('success', 'সেটিংস সংরক্ষিত', 'দোকানের কনফিগারেশন সফলভাবে আপডেট হয়েছে।');
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.bengaliName && p.bengaliName.includes(productSearch)) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory =
      selectedProductCategory === 'all' || p.category === selectedProductCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch =
      !orderSearch.trim() ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.phone.includes(orderSearch);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full px-3 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 max-w-[1550px] mx-auto font-['Plus_Jakarta_Sans']">
      {/* 1. TOP HEADER & BRANDING BAR */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="bg-[#053229] text-emerald-400 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Master Admin
            </span>
            <span className="bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              rajinujaer6@gmail.com
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Ghorer Bazar Store Manager v3.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>অ্যাডমিন ম্যানেজমেন্ট প্যানেল</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              All-in-One Dashboard
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            পণ্য, অর্ডার, কুরিয়ার, কুপন ও পেমেন্ট সেটিংস এক পেইজ থেকেই সহজভাবে পরিচালনা করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenNewProduct}
            className="px-4 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন পণ্য যোগ করুন</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="px-4 py-2.5 bg-[#053229] hover:bg-[#084236] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Store className="w-4 h-4 text-emerald-400" />
            <span>লাইভ শপ দেখুন</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('সকল ডেমো পণ্য ও অর্ডার প্রাথমিক অবস্থায় রিসেট করতে চান?')) {
                resetToInitialData();
                addToast('info', 'রিসেট সম্পন্ন', 'প্রাথমিক ডেমো ডেটা ফিরিয়ে আনা হয়েছে।');
              }
            }}
            className="p-2.5 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Restore Defaults"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. AT-A-GLANCE METRIC PULSE CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Card 1: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-600">মোট বিক্রয় (Total Revenue)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{formatPrice(totalRevenue)}</p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{deliveredOrders} টি ডেলিভারি সম্পন্ন</span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs relative overflow-hidden group hover:border-orange-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-600">মোট অর্ডার (Orders)</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{orders.length}</p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-orange-600 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingOrders} টি যাচাই পেন্ডিং</span>
          </div>
        </div>

        {/* Card 3: Products Catalog */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-600">মোট পণ্য (Catalog Items)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{products.length}</p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 font-bold">
            <span>সক্রিয় ক্যাটাগরি: ৮টি</span>
          </div>
        </div>

        {/* Card 4: Inventory Alerts & Coupons */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-600">স্টক সতর্কতা (Low Stock)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{lowStockCount}</p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-700 font-bold">
            <span>{activeCouponsCount} টি কুপন কোড অ্যাক্টিভ</span>
          </div>
        </div>
      </div>

      {/* 3. UNIFIED HORIZONTAL NAVIGATION TABS */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-[#053229] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>১. ওভারভিউ (Overview)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#053229] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>২. অর্ডার ও কুরিয়ার (Orders & Dispatch)</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'orders' ? 'bg-[#EA580C] text-white' : 'bg-slate-100 text-slate-700'}`}>
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-[#053229] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>৩. পণ্য ও স্টক (Products & Stock)</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'products' ? 'bg-[#EA580C] text-white' : 'bg-slate-100 text-slate-700'}`}>
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'coupons'
                ? 'bg-[#053229] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>৪. কুপন ও ডিসকাউন্ট (Coupons)</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'coupons' ? 'bg-[#EA580C] text-white' : 'bg-slate-100 text-slate-700'}`}>
              {coupons.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'customers'
                ? 'bg-[#053229] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>৫. কাস্টমার তালিকা (Customers)</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'customers' ? 'bg-[#EA580C] text-white' : 'bg-slate-100 text-slate-700'}`}>
              {customersList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'banners'
                ? 'bg-[#053229] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>৬. ব্যানার ও নোটিশ (Notice & Banners)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-[#053229] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>৭. দোকান ও পেমেন্ট (Store Settings)</span>
          </button>
        </div>
      </div>

      {/* 4. TAB CONTENTS */}

      {/* --- TAB 1: OVERVIEW --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recent Orders (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">সাম্প্রতিক কাস্টমার অর্ডার (Recent Orders)</h2>
                  <p className="text-[11px] text-slate-400">সর্বশেষ গ্রাহকদের অর্ডারসমূহ</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#EA580C] font-bold hover:underline flex items-center gap-1"
                >
                  <span>সব অর্ডার দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((ord) => (
                  <div key={ord.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/60 rounded-xl px-2 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                          {ord.orderNumber}
                        </span>
                        <span className="font-bold text-slate-800">{ord.customer.name}</span>
                        <span className="text-[11px] text-slate-400">({ord.customer.city})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                        <span>{ord.items.length} টি আইটেম</span>
                        <span>•</span>
                        <span className="font-semibold uppercase text-slate-700">{ord.paymentMethod}</span>
                        <span>•</span>
                        <span className="text-slate-400">{ord.date}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-right">
                        <p className="font-black text-slate-900 text-sm">{formatPrice(ord.total)}</p>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ord.status === 'shipped'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : ord.status === 'confirmed'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                        title="Print Invoice / View Slip"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (5 cols): Low Stock Alerts & Quick Store Status */}
            <div className="lg:col-span-5 space-y-6">
              {/* Low Stock Box */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <h2 className="text-sm sm:text-base font-bold text-slate-900">ইনভেন্টরি স্টক সতর্কতা</h2>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                    {lowStockCount} টি আইটেম লো-স্টক
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {products
                    .filter((p) => p.stock < 25)
                    .slice(0, 5)
                    .map((p) => (
                      <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.thumbnail}
                            alt=""
                            className="w-10 h-10 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100"
                          />
                          <div>
                            <p className="font-bold text-slate-800 truncate max-w-[150px]">{p.name}</p>
                            <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${p.stock < 10 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                            {p.stock} টি বাকি
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickAdjustStock(p.id, 10)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-bold text-[10px] transition-colors cursor-pointer"
                            title="Add 10 more to stock"
                          >
                            +10 স্টক
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Quick Info Tile */}
              <div className="bg-gradient-to-br from-[#053229] to-[#0A4B3E] rounded-3xl p-5 sm:p-6 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">ডেলিভারি চার্জ সারসংক্ষেপ</span>
                  <Truck className="w-4 h-4 text-emerald-300" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
                    <p className="text-emerald-200 text-[11px]">ঢাকা সিটির ভেতরে</p>
                    <p className="text-lg font-extrabold text-white mt-0.5">৳ {dhakaCharge}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
                    <p className="text-emerald-200 text-[11px]">ঢাকার বাইরে সারাদেশে</p>
                    <p className="text-lg font-extrabold text-white mt-0.5">৳ {outsideCharge}</p>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-200 pt-1">
                  * ৳ {freeThreshold} বা তদূর্ধ্ব অর্ডারে গ্রাহকের জন্য অটোমেটিক ফ্রি ডেলিভারি চালু আছে।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: ORDERS & DISPATCH --- */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Controls Bar: Search & Status Filter */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="অর্ডার নং, গ্রাহকের নাম বা মোবাইল নম্বর খুঁজুন..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap text-[11px] ${
                    orderStatusFilter === st
                      ? 'bg-[#053229] text-white shadow-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">অর্ডার নং ও তারিখ</th>
                    <th className="p-4">কাস্টমার ও ঠিকানা</th>
                    <th className="p-4">পেমেন্ট মেথড</th>
                    <th className="p-4">কুরিয়ার ও ট্র্যাকিং</th>
                    <th className="p-4">মোট বিল</th>
                    <th className="p-4">স্ট্যাটাস পরিবর্তন</th>
                    <th className="p-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400">
                        কোনো অর্ডার পাওয়া যায়নি
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => {
                      const fullAddress =
                        typeof ord.customer.address === 'string'
                          ? ord.customer.address
                          : (ord.customer.address as any)?.streetAddress || '';
                      return (
                        <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Col 1: Order # & Date */}
                          <td className="p-4">
                            <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-xs block w-max">
                              {ord.orderNumber}
                            </span>
                            <span className="text-[11px] text-slate-400 block mt-1">{ord.date}</span>
                          </td>

                          {/* Col 2: Customer info */}
                          <td className="p-4">
                            <p className="font-bold text-slate-900">{ord.customer.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <a
                                href={`tel:${ord.customer.phone}`}
                                className="text-slate-600 hover:text-[#EA580C] font-mono font-semibold flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3 text-emerald-600" />
                                {ord.customer.phone}
                              </a>
                              <a
                                href={`https://wa.me/${ord.customer.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-600 hover:text-emerald-700"
                                title="Chat on WhatsApp"
                              >
                                <MessageSquare className="w-3 h-3" />
                              </a>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px]" title={fullAddress}>
                              {ord.customer.city} - {fullAddress}
                            </p>
                          </td>

                          {/* Col 3: Payment */}
                          <td className="p-4">
                            <span className="uppercase font-extrabold text-slate-800 text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">
                              {ord.paymentMethod}
                            </span>
                            <div className="mt-1">
                              <button
                                type="button"
                                onClick={() =>
                                  updatePaymentStatus(
                                    ord.id,
                                    ord.paymentStatus === 'paid' ? 'pending' : 'paid'
                                  )
                                }
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                                  ord.paymentStatus === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                                title="Click to toggle Paid/Pending"
                              >
                                {ord.paymentStatus === 'paid' ? '✓ Paid (পরিশোধিত)' : '⏳ Due (বাকি)'}
                              </button>
                            </div>
                          </td>

                          {/* Col 4: Courier */}
                          <td className="p-4">
                            {ord.courierName ? (
                              <div>
                                <p className="font-bold text-slate-800 text-xs">{ord.courierName}</p>
                                <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                                  {ord.trackingCode}
                                </span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenCourierModal(ord)}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-bold border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Truck className="w-3 h-3 text-emerald-600" />
                                <span>কুরিয়ার দিন</span>
                              </button>
                            )}
                          </td>

                          {/* Col 5: Total */}
                          <td className="p-4">
                            <span className="font-black text-[#EA580C] text-sm">{formatPrice(ord.total)}</span>
                            <span className="text-[10px] text-slate-400 block">
                              {ord.items.length} পণ্য
                            </span>
                          </td>

                          {/* Col 6: Status Selector */}
                          <td className="p-4">
                            <select
                              value={ord.status}
                              onChange={(e) =>
                                updateOrderStatus(ord.id, e.target.value as OrderStatus)
                              }
                              className="text-[11px] font-bold uppercase px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer outline-hidden focus:border-[#EA580C]"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* Col 7: Actions */}
                          <td className="p-4 text-right space-x-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedInvoiceOrder(ord)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                              title="Print Invoice / View Memo"
                            >
                              <Printer className="w-3.5 h-3.5 text-slate-600" />
                              <span className="hidden sm:inline">ইনভয়েস</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="px-2.5 py-1.5 bg-[#053229] hover:bg-[#084236] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                              title="Order Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">ডিটেইলস</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: PRODUCTS & STOCK --- */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Action Header */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="পণ্য, ক্যাটাগরি বা SKU খুঁজুন..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={selectedProductCategory}
                onChange={(e) => setSelectedProductCategory(e.target.value)}
                className="text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-semibold cursor-pointer"
              >
                <option value="all">সকল ক্যাটাগরি (All)</option>
                <option value="organic">Organic Food</option>
                <option value="honey">Raw Honey</option>
                <option value="dates">Royal Dates</option>
                <option value="oil-ghee">Oil & Ghee</option>
                <option value="spices">Pure Spices</option>
                <option value="nuts-seeds">Nuts & Seeds</option>
                <option value="pickle">Traditional Pickle</option>
                <option value="tea-drinks">Tea & Drinks</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleOpenNewProduct}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন পণ্য যোগ করুন</span>
            </button>
          </div>

          {/* Product Catalog Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">পণ্য ও টাইটেল</th>
                    <th className="p-4">ক্যাটাগরি</th>
                    <th className="p-4">মূল্য (৳)</th>
                    <th className="p-4">বর্তমান স্টক ও কুইক অ্যাড</th>
                    <th className="p-4">দৃশ্যমানতা</th>
                    <th className="p-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.thumbnail}
                            alt=""
                            className="w-12 h-12 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{p.name}</p>
                            {p.bengaliName && (
                              <p className="text-[11px] text-slate-500 font-medium font-['Hind_Siliguri']">{p.bengaliName}</p>
                            )}
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {p.sku}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 capitalize text-slate-600 font-semibold">
                        {p.category.replace('-', ' ')}
                      </td>

                      <td className="p-4">
                        <span className="font-black text-slate-900 text-sm block">{formatPrice(p.price)}</span>
                        {p.originalPrice && (
                          <span className="text-[11px] text-slate-400 line-through">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                              p.stock < 15
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {p.stock} টি
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleQuickAdjustStock(p.id, 5)}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                              title="Add 5 units"
                            >
                              +5
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickAdjustStock(p.id, 10)}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                              title="Add 10 units"
                            >
                              +10
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => updateProduct(p.id, { visibility: !p.visibility })}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                            p.visibility !== false
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {p.visibility !== false ? '✓ দৃশ্যমান' : 'লুকানো'}
                        </button>
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-2 text-slate-500 hover:text-[#EA580C] hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
                          title="সম্পাদনা করুন"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`"${p.name}" পণ্যটি ডিলিট করতে চান?`)) {
                              deleteProduct(p.id);
                              addToast('info', 'পণ্য মুছে ফেলা হয়েছে', 'আইটেমটি স্টোর থেকে সরানো হয়েছে।');
                            }
                          }}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: COUPONS & DISCOUNTS --- */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Create Coupon Card (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Tag className="w-5 h-5 text-[#EA580C]" />
              <div>
                <h2 className="text-base font-bold text-slate-900">নতুন কুপন / প্রোমো কোড তৈরি করুন</h2>
                <p className="text-[11px] text-slate-400">গ্রাহকদের জন্য বিশেষ ছাড় কোড তৈরি করুন</p>
              </div>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">কুপন কোড (যেমন: EID2026, SAVE10) *</label>
                <input
                  type="text"
                  required
                  placeholder="GHORER20"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ছাড়ের ধরন</label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as 'percent' | 'fixed')}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-semibold cursor-pointer"
                  >
                    <option value="percent">শতাংশ (%) Percent</option>
                    <option value="fixed">নির্দিষ্ট টাকা (৳) Flat</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {couponType === 'percent' ? 'ছাড়ের পরিমাণ (%)' : 'ছাড়ের পরিমাণ (৳)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={couponValue}
                    onChange={(e) => setCouponValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ন্যূনতম অর্ডার (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={couponMinOrder}
                    onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">মেয়াদ উত্তীর্ণ তারিখ</label>
                  <input
                    type="date"
                    value={couponExpiry}
                    onChange={(e) => setCouponExpiry(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs mt-2"
              >
                + কুপন সক্রিয় করুন
              </button>
            </form>
          </div>

          {/* Existing Coupons List (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">বিদ্যমান কুপন ও প্রমোকোড তালিকা</h2>
                <p className="text-[11px] text-slate-400">মোট {coupons.length} টি কুপন সংরক্ষিত আছে</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className={`p-4 rounded-2xl border transition-all ${
                    c.isActive
                      ? 'bg-slate-50/70 border-slate-200 hover:border-emerald-300'
                      : 'bg-slate-100/50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-sm bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-900">
                      {c.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleCouponStatus(c.code)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {c.isActive ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Off)'}
                    </button>
                  </div>

                  <p className="text-xs font-extrabold text-[#EA580C]">
                    {c.type === 'percent' ? `${c.value}% ডিসকাউন্ট` : `৳${c.value} ফ্ল্যাট ছাড়`}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    ন্যূনতম অর্ডার: ৳{c.minOrder} • মেয়াদ: {c.expiryDate}
                  </p>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-200/60 text-[11px]">
                    <span className="text-slate-400">ব্যবহার হয়েছে: {c.usageCount || 0} বার</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`"${c.code}" কুপনটি মুছে ফেলতে চান?`)) {
                          deleteCoupon(c.code);
                          addToast('info', 'কুপন মুছে ফেলা হয়েছে', `${c.code} কোডটি রিমুভ করা হয়েছে।`);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                    >
                      মুছে ফেলুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 5: CUSTOMER CONTACTS --- */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">কাস্টমার ডিরেক্টরি ও যোগাযোগ</h2>
              <p className="text-xs text-slate-400">অর্ডার প্রদানকারী গ্রাহকদের তথ্য ও সরাসরি কল/হোয়াটসঅ্যাপ লিংক</p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full w-max">
              মোট কাস্টমার: {customersList.length} জন
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">গ্রাহকের নাম ও ইমেইল</th>
                  <th className="p-4">ফোন নম্বর</th>
                  <th className="p-4">ডেলিভারি এলাকা ও ঠিকানা</th>
                  <th className="p-4">অর্ডার সংখ্যা</th>
                  <th className="p-4">মোট কেনাকাটা</th>
                  <th className="p-4 text-right">যোগাযোগ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customersList.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{c.name}</p>
                      <p className="text-[11px] text-slate-400">{c.email || 'N/A'}</p>
                    </td>

                    <td className="p-4 font-mono font-bold text-slate-700">
                      {c.phone}
                    </td>

                    <td className="p-4 text-slate-600 max-w-xs truncate" title={c.address}>
                      <span className="font-bold text-slate-800">{c.city}: </span>
                      {c.address}
                    </td>

                    <td className="p-4">
                      <span className="bg-slate-100 font-bold text-slate-800 px-2.5 py-1 rounded-md">
                        {c.orderCount} টি
                      </span>
                    </td>

                    <td className="p-4 font-black text-[#EA580C]">
                      {formatPrice(c.totalSpent)}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <a
                        href={`tel:${c.phone}`}
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl inline-flex items-center gap-1 font-bold text-[11px] transition-colors"
                        title="সরাসরি কল দিন"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>কল</span>
                      </a>
                      <a
                        href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl inline-flex items-center gap-1 font-bold text-[11px] transition-colors"
                        title="হোয়াটসঅ্যাপে চ্যাট করুন"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 6: NOTICE & BANNERS --- */}
      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Megaphone className="w-5 h-5 text-[#EA580C]" />
              <div>
                <h2 className="text-base font-bold text-slate-900">নোটিশ বার ও ঘোষণা (Announcement Bar)</h2>
                <p className="text-[11px] text-slate-400">ওয়েবসাইটের একদম শীর্ষে চলমান নোটিশ টেক্সট পরিবর্তন করুন</p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">চলমান নোটিশ টেক্সট *</label>
                <textarea
                  rows={3}
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="toggleBanner"
                  checked={showAnnouncement}
                  onChange={(e) => setShowAnnouncement(e.target.checked)}
                  className="w-4 h-4 text-[#EA580C] rounded-sm cursor-pointer"
                />
                <label htmlFor="toggleBanner" className="font-bold text-slate-700 cursor-pointer">
                  ওয়েবসাইটে এই নোটিশ বার প্রদর্শন করুন (Enable Announcement Bar)
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">লাইভ প্রিভিউ (Preview)</h3>
            <div className="bg-[#053229] text-white p-3.5 rounded-2xl text-xs font-medium text-center shadow-xs">
              {bannerText}
            </div>
            <p className="text-[11px] text-slate-400">
              এটি গ্রাহকেরা ওয়েবসাইটের হোম পেইজ, শপ পেইজ সহ যেকোনো পেইজের একদম শীর্ষে দেখতে পাবেন।
            </p>
          </div>
        </div>
      )}

      {/* --- TAB 7: STORE SETTINGS & PAYMENTS --- */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 sm:p-8 max-w-4xl space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Settings className="w-5 h-5 text-[#EA580C]" />
            <div>
              <h2 className="text-base font-bold text-slate-900">দোকান, ডেলিভারি ও পেমেন্ট নম্বর কনফিগারেশন</h2>
              <p className="text-xs text-slate-400">ডেলিভারি চার্জ, হটলাইন এবং বিকাশ/নগদ নম্বর নির্ধারণ করুন</p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
            {/* Store Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">দোকানের নাম (English)</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">দোকানের নাম (বাংলা)</label>
                <input
                  type="text"
                  value={storeBengaliName}
                  onChange={(e) => setStoreBengaliName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white font-bold font-['Hind_Siliguri']"
                />
              </div>
            </div>

            {/* Delivery Charges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ঢাকা সিটির ভেতরে ডেলিভারি চার্জ (৳)
                </label>
                <input
                  type="number"
                  value={dhakaCharge}
                  onChange={(e) => setDhakaCharge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white font-black"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ঢাকার বাইরে ডেলিভারি চার্জ (৳)
                </label>
                <input
                  type="number"
                  value={outsideCharge}
                  onChange={(e) => setOutsideCharge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white font-black"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ফ্রি ডেলিভারি পেতে ন্যূনতম অর্ডার (৳)
                </label>
                <input
                  type="number"
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white font-black"
                />
              </div>
            </div>

            {/* Payment Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block"></span>
                  bKash পেমেন্ট নম্বর (কাস্টমারদের দেখানোর জন্য)
                </label>
                <input
                  type="text"
                  value={bkashNumber}
                  onChange={(e) => setBkashNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
                  Nagad পেমেন্ট নম্বর
                </label>
                <input
                  type="text"
                  value={nagadNumber}
                  onChange={(e) => setNagadNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white font-mono font-bold"
                />
              </div>
            </div>

            {/* Hotline Phone & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">হটলাইন ফোন নম্বর</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">হোয়াটসঅ্যাপ নম্বর (WhatsApp Support)</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white font-semibold"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-8 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                সংরক্ষণ করুন (Save Settings)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 1: ADD / EDIT PRODUCT --- */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'পণ্য সম্পাদনা (Edit Product)' : 'নতুন পণ্য যোগ করুন (Add New Product)'}
              </h3>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">পণ্যের ইংরেজি নাম (Product Title) *</label>
                <input
                  type="text"
                  required
                  placeholder="Pure Sundarban Wild Honey"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  পণ্যের বাংলা নাম (Bengali Title)
                </label>
                <input
                  type="text"
                  placeholder="সুন্দরবনের খাঁটি প্রাকৃতিক মধু"
                  value={pBengaliName}
                  onChange={(e) => setPBengaliName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#EA580C] focus:bg-white font-['Hind_Siliguri'] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি *</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-semibold"
                  >
                    <option value="organic">Organic Food</option>
                    <option value="honey">Raw Honey (খাঁটি মধু)</option>
                    <option value="dates">Royal Dates (খেজুর)</option>
                    <option value="oil-ghee">Oil & Ghee (তেল ও ঘি)</option>
                    <option value="spices">Pure Spices (মসলা)</option>
                    <option value="nuts-seeds">Nuts & Seeds (বাদাম ও বীজ)</option>
                    <option value="pickle">Traditional Pickle (আচার)</option>
                    <option value="tea-drinks">Tea & Drinks (চা ও পানীয়)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">স্টক সংখ্যা (Stock Quantity) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={pStock}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">বিক্রয় মূল্য (Sale Price ৳) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    পূর্বের রেগুলার মূল্য (Original Price ৳)
                  </label>
                  <input
                    type="number"
                    value={pOriginalPrice || ''}
                    onChange={(e) =>
                      setPOriginalPrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-bold"
                  />
                </div>
              </div>

              {/* Image URL & Preset Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">পণ্যের ছবির লিংক (Image URL) *</label>
                <input
                  type="url"
                  required
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-xs"
                />
                {/* Preset Picker */}
                <div className="mt-2">
                  <span className="text-[11px] text-slate-500 font-semibold block mb-1">বা নিচের ডেমো ছবি থেকে বেছে নিন:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {presetFoodImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPImage(img.url)}
                        className={`text-[10px] px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                          pImage === img.url ? 'bg-[#053229] text-white border-transparent' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বিবরণ (Product Description)</label>
                <textarea
                  rows={3}
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pFeatured"
                  checked={pIsFeatured}
                  onChange={(e) => setPIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#EA580C] rounded-sm cursor-pointer"
                />
                <label htmlFor="pFeatured" className="font-bold text-slate-700 cursor-pointer">
                  হোম পেইজে 'স্পেশাল কালেকশন / ফিচার্ড' হিসেবে দেখান
                </label>
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: INVOICE / MEMO SLIP (প্রিন্ট চালান) --- */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Invoice Top Actions */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ডেলিভারি চালান / ইনভয়েস মেমো</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Container */}
            <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-white space-y-4 text-xs font-['Plus_Jakarta_Sans']">
              {/* Store Header */}
              <div className="flex items-center justify-between border-b pb-4 border-slate-200">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">GHORER BAZAR</h2>
                  <p className="text-[11px] text-slate-500 font-semibold">ঘরের বাজার - ১০০% খাঁটি ও অর্গানিক গ্রোসারি</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">হটলাইন: {settings.contactPhone}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-slate-100 text-slate-900 font-mono font-black text-sm px-2.5 py-1 rounded-md">
                    {selectedInvoiceOrder.orderNumber}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">{selectedInvoiceOrder.date}</p>
                </div>
              </div>

              {/* Customer Box */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ডেলিভারি গ্রাহক</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedInvoiceOrder.customer.name}</p>
                  <p className="text-slate-600 font-mono">{selectedInvoiceOrder.customer.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ঠিকানা ও শহর</p>
                  <p className="text-slate-800 font-medium mt-0.5">
                    {typeof selectedInvoiceOrder.customer.address === 'string'
                      ? selectedInvoiceOrder.customer.address
                      : (selectedInvoiceOrder.customer.address as any)?.streetAddress}
                  </p>
                  <p className="text-slate-500 font-semibold">{selectedInvoiceOrder.customer.city}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100 pt-1">
                <div className="py-2 flex justify-between font-bold text-slate-400 uppercase text-[10px]">
                  <span>পণ্যের নাম</span>
                  <span>পরিমাণ ও মূল্য</span>
                </div>
                {selectedInvoiceOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{it.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {formatPrice(it.price)} × {it.quantity}
                      </p>
                    </div>
                    <span className="font-black text-slate-900">{formatPrice(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="border-t border-slate-200 pt-3 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>সাবটোটাল (Subtotal):</span>
                  <span className="font-bold">{formatPrice(selectedInvoiceOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ডেলিভারি চার্জ (Delivery Fee):</span>
                  <span className="font-bold">{formatPrice(selectedInvoiceOrder.deliveryCharge)}</span>
                </div>
                {selectedInvoiceOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>ডিসকাউন্ট (Discount):</span>
                    <span>-{formatPrice(selectedInvoiceOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-base text-slate-900 border-t border-slate-200 pt-2">
                  <span>সর্বমোট বিল (Grand Total):</span>
                  <span className="text-[#EA580C]">{formatPrice(selectedInvoiceOrder.total)}</span>
                </div>
              </div>

              {/* Footer Note */}
              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/60 flex items-center justify-between text-[11px]">
                <div>
                  <span className="font-bold text-slate-800 uppercase">পেমেন্ট: {selectedInvoiceOrder.paymentMethod}</span>
                  <span className="text-slate-500 block">
                    স্ট্যাটাস: {selectedInvoiceOrder.paymentStatus === 'paid' ? 'পরিশোধিত (Paid)' : 'ক্যাশ অন ডেলিভারি (Due)'}
                  </span>
                </div>
                {selectedInvoiceOrder.courierName && (
                  <div className="text-right">
                    <span className="font-bold text-slate-800 block">{selectedInvoiceOrder.courierName}</span>
                    <span className="font-mono text-[10px] text-slate-500">{selectedInvoiceOrder.trackingCode}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedInvoiceOrder(null)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ASSIGN COURIER MODAL --- */}
      {courierModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                কুরিয়ার ও ট্র্যাকিং কোড দিন
              </h3>
              <button
                type="button"
                onClick={() => setCourierModalOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourier} className="space-y-3.5 text-xs">
              <p className="text-slate-600">
                অর্ডার <strong className="font-mono">{courierModalOrder.orderNumber}</strong> এর জন্য কুরিয়ার নির্বাচন করুন:
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">কুরিয়ার সার্ভিস</label>
                <select
                  value={courierNameInput}
                  onChange={(e) => setCourierNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-bold"
                >
                  <option value="Steadfast Courier">Steadfast Courier (স্টেডফাস্ট)</option>
                  <option value="Pathao Courier">Pathao Courier (পাঠাও)</option>
                  <option value="RedX Logistics">RedX (রেডএক্স)</option>
                  <option value="Paperfly">Paperfly (পেপারফ্লাই)</option>
                  <option value="eCourier">eCourier (ই-কুরিয়ার)</option>
                  <option value="Sundarban Courier">Sundarban Courier Service</option>
                  <option value="Self Delivery Agent">নিজস্ব রাইডার / হোম ডেলিভারি</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">কনসাইনমেন্ট / ট্র্যাকিং কোড</label>
                <input
                  type="text"
                  required
                  value={trackingCodeInput}
                  onChange={(e) => setTrackingCodeInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-mono font-bold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCourierModalOrder(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#EA580C] text-white font-bold rounded-xl shadow-xs"
                >
                  সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: ORDER DETAILS VIEW --- */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-mono">
                Order #{selectedOrderDetails.orderNumber}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="font-bold text-slate-900 text-sm">{selectedOrderDetails.customer.name}</p>
                <p className="text-slate-600 mt-0.5">{selectedOrderDetails.customer.phone}</p>
                <p className="text-slate-600 mt-1">
                  {typeof selectedOrderDetails.customer.address === 'string'
                    ? selectedOrderDetails.customer.address
                    : (selectedOrderDetails.customer.address as any)?.streetAddress}
                  , {selectedOrderDetails.customer.city}
                </p>
              </div>

              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {selectedOrderDetails.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{it.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {it.quantity} × {formatPrice(it.price)}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between font-black text-sm">
                <span>Grand Total:</span>
                <span className="text-[#EA580C]">{formatPrice(selectedOrderDetails.total)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const ord = selectedOrderDetails;
                  setSelectedOrderDetails(null);
                  setSelectedInvoiceOrder(ord);
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>ইনভয়েস প্রিন্ট</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="flex-1 py-2.5 bg-[#053229] hover:bg-[#084236] text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
