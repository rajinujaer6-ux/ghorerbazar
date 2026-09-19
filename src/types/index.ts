export interface ProductVariant {
  id: string;
  name: string; // e.g. "500 gm", "1 kg", "2 Ltr"
  price: number;
  originalPrice?: number;
  stock: number;
  sku: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'hidden';
}

export interface Product {
  id: string;
  name: string;
  bengaliName?: string;
  slug: string;
  sku: string;
  category: string;
  subcategory?: string;
  brand: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  thumbnail: string;
  variants?: ProductVariant[];
  sizeOrWeight?: string;
  specifications: ProductSpecification[];
  tags: string[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isOfferZone?: boolean;
  visibility: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Category {
  id: string;
  name: string;
  bengaliName?: string;
  slug: string;
  image: string;
  icon?: string;
  description?: string;
  banner?: string;
  subcategories: string[];
  isFeatured: boolean;
  order: number;
}

export interface CartItem {
  id: string; // unique cart item id (product.id + variant.id)
  productId: string;
  variantId?: string;
  variantName?: string;
  name: string;
  bengaliName?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  maxStock: number;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number; // e.g. 10 for 10%, or 100 for 100 Taka
  minOrder: number;
  maxDiscount?: number;
  expiryDate: string;
  usageCount: number;
  maxUsage: number;
  isActive: boolean;
}

export interface TrackingEvent {
  status: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  variantName?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  total: number;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string; // e.g. Dhaka, Chittagong, Sylhet
  area: string;
  postalCode?: string;
  deliveryNote?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "GB-84920"
  date: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  trackingHistory: TrackingEvent[];
  courierName?: string;
  trackingCode?: string;
}

export type OrderStatus = Order['status'];

export interface UserAddress {
  id: string;
  title?: string; // e.g. "Home", "Office"
  recipientName?: string;
  name?: string;
  phone: string;
  address?: string;
  streetAddress?: string;
  city: string;
  area?: string;
  thana?: string;
  isDefault: boolean;
}

export type Address = UserAddress;

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: UserAddress[];
  createdAt: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  bengaliTitle?: string;
  subtitle: string;
  imageUrl: string;
  badge?: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  order: number;
}

export interface PromoBanner {
  id: string;
  title: string;
  bengaliTitle?: string;
  description: string;
  imageUrl: string;
  badge?: string;
  ctaText: string;
  ctaLink: string;
  bullets?: string[];
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  storeBengaliName: string;
  tagline: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  currency: string;
  currencySymbol: string;
  deliveryChargeDhaka: number;
  deliveryChargeOutside: number;
  freeDeliveryThreshold: number;
  announcementBarText: string;
  showAnnouncementBar: boolean;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  bkashNumber?: string;
  nagadNumber?: string;
  codEnabled?: boolean;
}
