import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  db,
  sanitizeInput,
  sanitizeObject,
  securityRateLimiter
} from '../lib/firebase';
import {
  Product,
  Category,
  CartItem,
  Coupon,
  Order,
  User,
  StoreSettings,
  HeroSlide,
  PromoBanner,
  ProductVariant,
} from '../types';
import {
  initialProducts,
  initialCategories,
  initialSettings,
  initialHeroSlides,
  initialPromoBanner,
  initialCoupons,
  initialOrders,
  demoUser,
  demoAdminUser,
} from '../data/initialData';

export const AUTHORIZED_ADMIN_EMAIL = 'rajinujaer6@gmail.com';

export const isAuthorizedAdmin = (user: User | null): boolean => {
  if (!user || !user.email) return false;
  return user.email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL;
};

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryCharge: number;
  cartGrandTotal: number;
  selectedDeliveryArea: 'dhaka' | 'outside';
  setSelectedDeliveryArea: (area: 'dhaka' | 'outside') => void;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  couponDiscountAmount: number;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCouponStatus: (code: string) => void;
  deleteCoupon: (code: string) => void;

  // Wishlist
  wishlist: string[]; // array of product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'trackingHistory'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], note?: string) => void;
  updatePaymentStatus: (orderId: string, paymentStatus: Order['paymentStatus']) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  findOrder: (query: string) => Order | undefined;

  // User & Auth
  currentUser: User | null;
  isAdmin: boolean;
  loginWithMobile: (phone: string, otp: string) => boolean;
  loginWithCredentials: (emailOrPhone: string, pass: string) => boolean;
  register: (name: string, email: string, phone: string, pass: string) => boolean;
  logout: () => void;
  switchToDemoAdmin: () => void;
  switchToDemoCustomer: () => void;
  updateProfile: (data: Partial<User>) => void;

  // CMS & Banners
  heroSlides: HeroSlide[];
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => void;
  promoBanner: PromoBanner;
  updatePromoBanner: (updates: Partial<PromoBanner>) => void;

  // Store Settings
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Currency helper
  formatPrice: (amount: number) => string;

  // Firebase & Security Status
  isFirebaseConnected: boolean;
  firebaseSyncStatus: 'synced' | 'syncing' | 'offline';
  resetToInitialData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper for localStorage
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`ghorer_bazar_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const saveStored = <T,>(key: string, value: T) => {
    try {
      localStorage.setItem(`ghorer_bazar_${key}`, JSON.stringify(value));
    } catch {
      // ignore
    }
  };

  // State initialization
  const [products, setProducts] = useState<Product[]>(() => loadStored('products', initialProducts));
  const [categories, setCategories] = useState<Category[]>(() => loadStored('categories', initialCategories));
  const [cart, setCart] = useState<CartItem[]>(() => loadStored('cart', []));
  const [wishlist, setWishlist] = useState<string[]>(() => loadStored('wishlist', ['prod-1', 'prod-4']));
  const [orders, setOrders] = useState<Order[]>(() => loadStored('orders', initialOrders));
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadStored('coupons', initialCoupons));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const loaded = loadStored<User | null>('user', demoAdminUser);
    if (!loaded) return demoAdminUser;
    if (loaded && !isAuthorizedAdmin(loaded) && loaded.role === 'admin') {
      return { ...loaded, role: 'customer' };
    }
    return loaded;
  });

  const isAdmin = useMemo(() => isAuthorizedAdmin(currentUser), [currentUser]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => loadStored('hero_slides_v2', initialHeroSlides));
  const [promoBanner, setPromoBanner] = useState<PromoBanner>(() => loadStored('promo_banner_v2', initialPromoBanner));
  const [settings, setSettings] = useState<StoreSettings>(() => loadStored('settings', initialSettings));

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDeliveryArea, setSelectedDeliveryArea] = useState<'dhaka' | 'outside'>('dhaka');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);
  const [firebaseSyncStatus, setFirebaseSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('syncing');

  // Background Ultra-Fast Firestore Synchronization with Offline Persistence
  useEffect(() => {
    if (!db) {
      setIsFirebaseConnected(false);
      setFirebaseSyncStatus('offline');
      return;
    }

    let unsubs: (() => void)[] = [];
    try {
      // 1. Live Sync Products with Firestore
      const unsubProducts = onSnapshot(
        collection(db, 'products'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Product[] = [];
            snapshot.forEach((docSnap) => list.push(docSnap.data() as Product));
            setProducts(list);
          } else {
            // Seed initial products to cloud firestore
            initialProducts.forEach((p) => {
              setDoc(doc(db, 'products', p.id), p).catch(() => {});
            });
          }
          setIsFirebaseConnected(true);
          setFirebaseSyncStatus('synced');
        },
        (err) => {
          console.warn('Firebase products offline:', err);
          setIsFirebaseConnected(false);
          setFirebaseSyncStatus('offline');
        }
      );
      unsubs.push(unsubProducts);

      // 2. Live Sync Orders with Firestore
      const unsubOrders = onSnapshot(
        collection(db, 'orders'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Order[] = [];
            snapshot.forEach((docSnap) => list.push(docSnap.data() as Order));
            list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setOrders(list);
          } else {
            initialOrders.forEach((ord) => {
              setDoc(doc(db, 'orders', ord.id), ord).catch(() => {});
            });
          }
        },
        (err) => {
          console.warn('Firebase orders offline:', err);
        }
      );
      unsubs.push(unsubOrders);

      // 3. Live Sync Coupons with Firestore
      const unsubCoupons = onSnapshot(
        collection(db, 'coupons'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Coupon[] = [];
            snapshot.forEach((docSnap) => list.push(docSnap.data() as Coupon));
            setCoupons(list);
          } else {
            initialCoupons.forEach((c) => {
              setDoc(doc(db, 'coupons', c.code), c).catch(() => {});
            });
          }
        },
        (err) => {
          console.warn('Firebase coupons offline:', err);
        }
      );
      unsubs.push(unsubCoupons);

      // 4. Live Sync Store Settings with Firestore
      const unsubSettings = onSnapshot(
        doc(db, 'settings', 'general'),
        (snapshot) => {
          if (snapshot.exists()) {
            setSettings(snapshot.data() as StoreSettings);
          } else {
            setDoc(doc(db, 'settings', 'general'), initialSettings).catch(() => {});
          }
        },
        (err) => {
          console.warn('Firebase settings offline:', err);
        }
      );
      unsubs.push(unsubSettings);
    } catch (e) {
      console.warn('Firebase init error:', e);
      setIsFirebaseConnected(false);
      setFirebaseSyncStatus('offline');
    }

    return () => {
      unsubs.forEach((u) => u());
    };
  }, []);

  // Sync to storage
  useEffect(() => saveStored('products', products), [products]);
  useEffect(() => saveStored('categories', categories), [categories]);
  useEffect(() => saveStored('cart', cart), [cart]);
  useEffect(() => saveStored('wishlist', wishlist), [wishlist]);
  useEffect(() => saveStored('orders', orders), [orders]);
  useEffect(() => saveStored('coupons', coupons), [coupons]);
  useEffect(() => saveStored('user', currentUser), [currentUser]);
  useEffect(() => saveStored('hero_slides_v2', heroSlides), [heroSlides]);
  useEffect(() => saveStored('promo_banner_v2', promoBanner), [promoBanner]);
  useEffect(() => saveStored('settings', settings), [settings]);

  // Toast System
  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Currency helper
  const formatPrice = (amount: number) => {
    return `${settings.currencySymbol} ${Math.round(amount).toLocaleString('en-US')}`;
  };

  // Cart calculations
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const cartDeliveryCharge = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (cartSubtotal >= settings.freeDeliveryThreshold) return 0;
    return selectedDeliveryArea === 'dhaka' ? settings.deliveryChargeDhaka : settings.deliveryChargeOutside;
  }, [cartSubtotal, selectedDeliveryArea, settings]);

  const couponDiscountAmount = useMemo(() => {
    if (!appliedCoupon || cartSubtotal < appliedCoupon.minOrder) return 0;
    if (appliedCoupon.type === 'percent') {
      const calculated = (cartSubtotal * appliedCoupon.value) / 100;
      return appliedCoupon.maxDiscount ? Math.min(calculated, appliedCoupon.maxDiscount) : calculated;
    }
    return appliedCoupon.value;
  }, [appliedCoupon, cartSubtotal]);

  const cartDiscount = couponDiscountAmount;
  const cartGrandTotal = Math.max(0, cartSubtotal + cartDeliveryCharge - cartDiscount);

  // Cart Actions
  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const variantId = variant ? variant.id : undefined;
    const variantName = variant ? variant.name : undefined;
    const price = variant ? variant.price : product.price;
    const originalPrice = variant ? variant.originalPrice : product.originalPrice;
    const maxStock = variant ? variant.stock : product.stock;
    const itemId = `${product.id}_${variantId || 'default'}`;

    if (maxStock <= 0) {
      addToast('error', 'Out of Stock', `${product.name} is currently out of stock.`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === itemId);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, maxStock);
        return prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: nextQty } : item
        );
      } else {
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          variantId,
          variantName,
          name: product.name,
          bengaliName: product.bengaliName,
          price,
          originalPrice,
          quantity: Math.min(quantity, maxStock),
          image: product.thumbnail || product.images[0],
          maxStock,
        };
        return [...prevCart, newItem];
      }
    });

    addToast('success', 'Added to Cart', `${product.name} has been added to your shopping bag.`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          return { ...item, quantity: Math.min(quantity, item.maxStock) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    addToast('info', 'Item Removed', 'Product removed from your cart.');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupons
  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      setCouponError('Invalid or expired coupon code.');
      addToast('error', 'Coupon Error', 'Invalid or expired coupon code.');
      return false;
    }

    if (cartSubtotal < found.minOrder) {
      const msg = `Minimum order of ${formatPrice(found.minOrder)} required for this coupon.`;
      setCouponError(msg);
      addToast('error', 'Coupon Requirements', msg);
      return false;
    }

    setAppliedCoupon(found);
    addToast('success', 'Coupon Applied!', `Promo code ${found.code} applied successfully.`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    addToast('info', 'Coupon Removed', 'Coupon removed from order.');
  };

  const addCoupon = (newCoupon: Coupon) => {
    const sanitized: Coupon = {
      ...newCoupon,
      code: sanitizeInput(newCoupon.code).toUpperCase(),
    };
    setCoupons((prev) => [...prev, sanitized]);
    if (db) setDoc(doc(db, 'coupons', sanitized.code), sanitized).catch(() => {});
    addToast('success', 'Coupon Created', `Coupon ${sanitized.code} created and synced to Firebase.`);
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.code === code) {
          const updated = { ...c, isActive: !c.isActive };
          if (db) updateDoc(doc(db, 'coupons', code), { isActive: updated.isActive }).catch(() => {});
          return updated;
        }
        return c;
      })
    );
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    if (db) deleteDoc(doc(db, 'coupons', code)).catch(() => {});
    if (appliedCoupon?.code === code) {
      setAppliedCoupon(null);
    }
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('info', 'Wishlist Updated', 'Item removed from your wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('success', 'Added to Wishlist', 'Item saved to your wishlist.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'trackingHistory'>): Order => {
    // Hacker & bot protection: Rate limiting
    if (!securityRateLimiter.isAllowed('create_order')) {
      addToast('error', 'নিরাপত্তা সতর্কতা (Security Protection)', 'খুব দ্রুত অতিরিক্ত রিকোয়েস্ট শনাক্ত হয়েছে। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।');
      throw new Error('Rate limit exceeded');
    }

    // Hacker defense: Sanitize all customer inputs against XSS & injections
    const sanitizedCustomer = sanitizeObject(orderData.customer);

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `GB-${randomNum}`;
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').slice(0, 16);

    const initialTracking = [
      {
        status: 'pending',
        title: 'Order Placed',
        description: 'Your order has been recorded and queued for verification.',
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
        completed: true,
        current: true,
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Quality check and packing at Tejgaon central hub.',
        timestamp: 'Pending verification',
        completed: false,
      },
      {
        status: 'shipped',
        title: 'Dispatched with Courier',
        description: 'Handed over to delivery rider for doorstep delivery.',
        timestamp: 'Upcoming',
        completed: false,
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Customer confirmation and signature.',
        timestamp: 'Upcoming',
        completed: false,
      },
    ];

    const newOrder: Order = {
      ...orderData,
      customer: sanitizedCustomer,
      id: `ord-${Date.now()}`,
      orderNumber,
      date: formattedDate,
      status: 'pending',
      trackingHistory: initialTracking,
      courierName: 'Steadfast Express',
      trackingCode: `ST-${Math.floor(1000000 + Math.random() * 9000000)}`,
    };

    // Optimistic UI state update (Instantaneous UX)
    setOrders((prev) => [newOrder, ...prev]);

    // Push to Firebase Cloud Firestore
    if (db) {
      setDoc(doc(db, 'orders', newOrder.id), newOrder).catch((err) => {
        console.warn('Firestore cloud sync notice:', err);
      });
    }

    // Update stock
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const matchingItem = orderData.items.find((i) => i.productId === p.id);
        if (matchingItem) {
          const updatedStock = Math.max(0, p.stock - matchingItem.quantity);
          // Sync stock to firestore
          if (db) updateDoc(doc(db, 'products', p.id), { stock: updatedStock }).catch(() => {});
          return {
            ...p,
            stock: updatedStock,
          };
        }
        return p;
      })
    );

    clearCart();
    addToast('success', 'Order Placed Successfully!', `Order ${orderNumber} has been received and saved.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], note?: string) => {
    let updatedOrderObj: Order | undefined;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today';
          const updatedHistory = ord.trackingHistory.map((step) => {
            if (step.status === status) {
              return {
                ...step,
                completed: true,
                current: true,
                timestamp: nowStr,
                description: note || step.description,
              };
            }
            return {
              ...step,
              current: step.status === status,
            };
          });

          const res = {
            ...ord,
            status,
            trackingHistory: updatedHistory,
          };
          updatedOrderObj = res;
          return res;
        }
        return ord;
      })
    );

    // Sync status with Firebase Cloud Firestore
    if (db && updatedOrderObj) {
      updateDoc(doc(db, 'orders', orderId), {
        status,
        trackingHistory: updatedOrderObj.trackingHistory,
      }).catch(() => {});
    }

    addToast('success', 'Order Status Updated', `Order marked as ${status}.`);
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: Order['paymentStatus']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, paymentStatus } : ord))
    );
    // Sync payment status with Firestore
    if (db) updateDoc(doc(db, 'orders', orderId), { paymentStatus }).catch(() => {});
    addToast('success', 'Payment Status Updated', `Payment marked as ${paymentStatus}.`);
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, ...updates } : ord))
    );
    // Sync with Firestore
    if (db) updateDoc(doc(db, 'orders', orderId), updates).catch(() => {});
    addToast('success', 'Order Updated', 'Order details have been saved.');
  };

  const findOrder = (query: string): Order | undefined => {
    const clean = query.trim().toUpperCase();
    return orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === clean ||
        o.orderNumber.toUpperCase() === `GB-${clean}` ||
        o.customer.phone.includes(clean)
    );
  };

  // Product CRUD with Sanitization & Cloud Firestore Sync
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const sanitized = sanitizeObject(prodData);
    const newProd: Product = {
      ...sanitized,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
    if (db) setDoc(doc(db, 'products', newProd.id), newProd).catch(() => {});
    addToast('success', 'Product Added', `${newProd.name} added to catalog and Firebase.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const sanitized = sanitizeObject(updates);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...sanitized } : p)));
    if (db) updateDoc(doc(db, 'products', id), sanitized).catch(() => {});
    addToast('success', 'Product Updated', 'Product updated in catalog and Firebase.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (db) deleteDoc(doc(db, 'products', id)).catch(() => {});
    addToast('info', 'Product Deleted', 'Product removed from store.');
  };

  const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
  const getProductById = (id: string) => products.find((p) => p.id === id);

  // Category CRUD
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
    addToast('success', 'Category Created', `Category ${newCat.name} created.`);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    addToast('success', 'Category Updated', 'Category updated successfully.');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addToast('info', 'Category Deleted', 'Category removed.');
  };

  // Auth
  const loginWithMobile = (phone: string, otp: string): boolean => {
    if (!phone || phone.length < 10) {
      addToast('error', 'Login Failed', 'Please provide a valid Bangladeshi mobile number.');
      return false;
    }
    // Simulated OTP check (any 4-6 digit OTP succeeds for seamless demo experience)
    const user: User = {
      id: `usr-${phone}`,
      name: phone === '01711223344' ? 'Tanvir Ahmed' : 'Valued Customer',
      phone,
      email: `${phone}@ghorerbazar.user`,
      role: 'customer',
      createdAt: new Date().toISOString().slice(0, 10),
      addresses: demoUser.addresses,
    };
    setCurrentUser(user);
    addToast('success', 'Welcome Back!', `Logged in successfully with ${phone}`);
    return true;
  };

  const loginWithCredentials = (emailOrPhone: string, pass: string): boolean => {
    if (!emailOrPhone || !pass) {
      addToast('error', 'Login Failed', 'Please enter your email/phone and password.');
      return false;
    }
    const normalizedInput = emailOrPhone.trim().toLowerCase();
    if (normalizedInput === AUTHORIZED_ADMIN_EMAIL) {
      const adminUser: User = {
        ...demoAdminUser,
        email: AUTHORIZED_ADMIN_EMAIL,
        role: 'admin',
      };
      setCurrentUser(adminUser);
      addToast('success', 'Admin Access Granted', `স্বাগতম ${AUTHORIZED_ADMIN_EMAIL}! অ্যাডমিন প্যানেলে প্রবেশাধিকার দেয়া হয়েছে।`);
      return true;
    }
    const user: User = {
      id: `usr-${Date.now()}`,
      name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Tanvir Ahmed',
      email: emailOrPhone.includes('@') ? emailOrPhone : 'customer@example.com',
      phone: emailOrPhone.includes('@') ? '01711223344' : emailOrPhone,
      role: 'customer',
      createdAt: new Date().toISOString().slice(0, 10),
      addresses: demoUser.addresses,
    };
    setCurrentUser(user);
    addToast('success', 'Login Successful', `Welcome back, ${user.name}!`);
    return true;
  };

  const register = (name: string, email: string, phone: string, pass: string): boolean => {
    if (!name || !phone) {
      addToast('error', 'Registration Failed', 'Name and phone number are required.');
      return false;
    }
    const isOwner = email?.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL;
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email: email || `${phone}@ghorerbazar.user`,
      phone,
      role: isOwner ? 'admin' : 'customer',
      createdAt: new Date().toISOString().slice(0, 10),
      addresses: [],
    };
    setCurrentUser(newUser);
    addToast('success', 'Account Created!', `Welcome to Ghorer Bazar, ${name}!`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('info', 'Logged Out', 'You have been signed out.');
  };

  const switchToDemoAdmin = () => {
    setCurrentUser(demoAdminUser);
    addToast('success', 'Admin Mode Active', `Switched to Admin (${AUTHORIZED_ADMIN_EMAIL}).`);
  };

  const switchToDemoCustomer = () => {
    setCurrentUser(demoUser);
    addToast('info', 'Customer Mode Active', 'Switched to Customer account (Tanvir Ahmed).');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const isOwner = (data.email || currentUser.email)?.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL;
    setCurrentUser({
      ...currentUser,
      ...data,
      role: isOwner ? 'admin' : 'customer',
    });
    addToast('success', 'Profile Updated', 'Your profile details have been saved.');
  };

  // CMS
  const updateHeroSlide = (id: string, updates: Partial<HeroSlide>) => {
    setHeroSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    addToast('success', 'Hero Slide Updated', 'Homepage carousel updated.');
  };

  const updatePromoBanner = (updates: Partial<PromoBanner>) => {
    setPromoBanner((prev) => ({ ...prev, ...updates }));
    addToast('success', 'Promo Banner Updated', 'Side promotional card updated.');
  };

  // Settings
  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      if (db) setDoc(doc(db, 'settings', 'general'), updated).catch(() => {});
      return updated;
    });
    addToast('success', 'Settings Saved', 'Store configuration updated in Firebase.');
  };

  const resetToInitialData = () => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setOrders(initialOrders);
    setCoupons(initialCoupons);
    setSettings(initialSettings);
    // Cloud sync
    if (db) {
      initialProducts.forEach((p) => setDoc(doc(db, 'products', p.id), p).catch(() => {}));
      initialOrders.forEach((o) => setDoc(doc(db, 'orders', o.id), o).catch(() => {}));
      initialCoupons.forEach((c) => setDoc(doc(db, 'coupons', c.code), c).catch(() => {}));
      setDoc(doc(db, 'settings', 'general'), initialSettings).catch(() => {});
    }
    addToast('info', 'রিসেট সম্পন্ন', 'প্রাথমিক ডেমো ডেটা পুনরায় ক্লাউড ও লোকাল স্টোরেজে সেট করা হয়েছে।');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductBySlug,
        getProductById,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartDeliveryCharge,
        cartGrandTotal,
        selectedDeliveryArea,
        setSelectedDeliveryArea,
        coupons,
        appliedCoupon,
        couponDiscountAmount,
        couponError,
        applyCoupon,
        removeCoupon,
        addCoupon,
        toggleCouponStatus,
        deleteCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        updateOrder,
        findOrder,
        currentUser,
        isAdmin,
        loginWithMobile,
        loginWithCredentials,
        register,
        logout,
        switchToDemoAdmin,
        switchToDemoCustomer,
        updateProfile,
        heroSlides,
        updateHeroSlide,
        promoBanner,
        updatePromoBanner,
        settings,
        updateSettings,
        quickViewProduct,
        setQuickViewProduct,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        formatPrice,
        isFirebaseConnected,
        firebaseSyncStatus,
        resetToInitialData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
