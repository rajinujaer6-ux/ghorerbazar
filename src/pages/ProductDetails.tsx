import React, { useState, useEffect } from 'react';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageCircle,
  Share2,
  Tag,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductVariant, Review } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailsProps {
  productSlug: string;
  onNavigate: (view: string, param?: string) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ productSlug, onNavigate }) => {
  const {
    products,
    getProductBySlug,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    formatPrice,
    settings,
    addToast
  } = useStore();

  const product = getProductBySlug(productSlug) || products[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  // New review form state
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews || []);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(undefined);
      }
      setQuantity(1);
      setActiveImageIndex(0);
      setReviewsList(product.reviews || []);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [productSlug, product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <button
          type="button"
          onClick={() => onNavigate('shop')}
          className="mt-4 px-6 py-2.5 bg-[#EA580C] text-white rounded-lg text-sm font-semibold"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOriginalPrice = selectedVariant ? selectedVariant.originalPrice : product.originalPrice;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const savings = currentOriginalPrice ? currentOriginalPrice - currentPrice : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    setIsCartOpen(false);
    onNavigate('checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('success', 'Link Copied', 'Product link copied to clipboard.');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      addToast('error', 'Incomplete Review', 'Please provide your name and comments.');
      return;
    }
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userName: reviewerName.trim(),
      rating: reviewRating,
      date: 'Just now',
      comment: reviewComment.trim(),
      verifiedPurchase: true,
      status: 'approved',
    };
    setReviewsList([newRev, ...reviewsList]);
    setReviewerName('');
    setReviewComment('');
    setReviewSubmitted(true);
    addToast('success', 'Review Submitted', 'Thank you for your valuable feedback!');
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 6);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-6 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="hover:text-[#EA580C] cursor-pointer"
        >
          Home
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => onNavigate('shop', `category=${product.category}`)}
          className="hover:text-[#EA580C] capitalize cursor-pointer"
        >
          {product.category.replace('-', ' ')}
        </button>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </div>

      {/* Main Product Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square bg-[#F8F9FA] rounded-2xl overflow-hidden p-6 border border-slate-200/80 flex items-center justify-center">
            <img
              src={product.images[activeImageIndex] || product.thumbnail}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-110"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="bg-[#EA580C] text-white text-xs font-extrabold px-3 py-1 rounded-sm shadow-xs uppercase tracking-wider">
                  {product.discountPercent}% OFF
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-[#053229] text-white text-[11px] font-bold px-2.5 py-1 rounded-sm shadow-xs uppercase tracking-wider">
                  Bestseller
                </span>
              )}
            </div>

            {/* Wishlist button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-2.5 rounded-full shadow-sm backdrop-blur-xs transition-colors cursor-pointer ${
                inWishlist
                  ? 'bg-red-50 text-red-500'
                  : 'bg-white/90 text-slate-400 hover:text-red-500'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails Rail */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-18 h-18 rounded-xl overflow-hidden bg-[#F8F9FA] p-1.5 border-2 transition-all shrink-0 cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#EA580C] shadow-xs'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Buy Box & Options (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="uppercase font-bold text-[#EA580C] tracking-wider">
                {product.brand || 'Ghorer Bazar Authentic'}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-400">SKU: {product.sku}</span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1 text-slate-500 hover:text-[#EA580C] transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {product.name}
            </h1>

            {product.bengaliName && (
              <p className="text-lg sm:text-xl font-bold text-slate-700 font-['Hind_Siliguri'] mt-1">
                {product.bengaliName}
              </p>
            )}

            {/* Ratings & Stock info */}
            <div className="flex flex-wrap items-center gap-4 mt-3 pb-4 border-b border-slate-200">
              <div
                onClick={() => setActiveTab('reviews')}
                className="flex items-center gap-1.5 cursor-pointer group"
              >
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-sm font-bold text-slate-800">{product.rating}</span>
                <span className="text-xs text-slate-400 group-hover:text-[#EA580C] group-hover:underline">
                  ({reviewsList.length} Customer Reviews)
                </span>
              </div>

              <span className="text-slate-300">•</span>

              <div className="text-xs font-semibold">
                {currentStock > 0 ? (
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    In Stock ({currentStock} units ready for dispatch)
                  </span>
                ) : (
                  <span className="text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-[#EA580C]">
              {formatPrice(currentPrice)}
            </span>
            {currentOriginalPrice && currentOriginalPrice > currentPrice && (
              <>
                <span className="text-base text-slate-400 line-through">
                  {formatPrice(currentOriginalPrice)}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
                  You Save {formatPrice(savings)}
                </span>
              </>
            )}
          </div>

          {/* Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Select Packaging / Net Weight:</span>
                <span className="text-[#EA580C]">{selectedVariant?.name}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                      selectedVariant?.id === v.id
                        ? 'border-[#EA580C] bg-orange-50 text-[#EA580C] shadow-xs ring-1 ring-[#EA580C]'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span>{v.name}</span>
                    <span className="text-slate-400">•</span>
                    <span>{formatPrice(v.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold text-slate-700">Quantity:</label>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 hover:bg-slate-100 text-slate-600 transition-colors font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 text-xs font-extrabold text-slate-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="px-3.5 py-2 hover:bg-slate-100 text-slate-600 transition-colors font-bold text-sm"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Total: {formatPrice(currentPrice * quantity)}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={currentStock <= 0}
                onClick={handleAddToCart}
                className="py-3.5 px-6 bg-[#EA580C] hover:bg-[#C2410C] disabled:bg-slate-300 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Add to Shopping Cart</span>
              </button>

              <button
                type="button"
                disabled={currentStock <= 0}
                onClick={handleBuyNow}
                className="py-3.5 px-6 bg-[#053229] hover:bg-[#084236] disabled:bg-slate-300 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buy Now (এক ক্লিকে অর্ডার)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Order by Call or WhatsApp */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-950 font-semibold text-center sm:text-left">
                <Phone className="w-4 h-4 text-[#EA580C] shrink-0" />
                <span>ফোনে সরাসরি অর্ডার করতে কল করুন বা হোয়াটসঅ্যাপে মেসেজ দিন:</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-900 font-bold rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  {settings.contactPhone}
                </a>
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি "${product.name}" অর্ডার করতে চাই।`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#1EBE5D] transition-colors flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Delivery & Service Assurance Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
              <Truck className="w-4 h-4 text-[#EA580C]" />
              <span className="font-bold text-slate-800">Fast Delivery</span>
              <span className="text-[11px] text-slate-500">Inside Dhaka 24h</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
              <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
              <span className="font-bold text-slate-800">100% Genuine</span>
              <span className="text-[11px] text-slate-500">Pure & lab tested</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
              <RotateCcw className="w-4 h-4 text-[#EA580C]" />
              <span className="font-bold text-slate-800">Doorstep Check</span>
              <span className="text-[11px] text-slate-500">Inspect before pay</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
              <Tag className="w-4 h-4 text-[#EA580C]" />
              <span className="font-bold text-slate-800">Best Price</span>
              <span className="text-[11px] text-slate-500">Direct from farmers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Specifications / Reviews */}
      <div className="pt-8 border-t border-slate-200">
        <div className="flex border-b border-slate-200 gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('desc')}
            className={`pb-3 text-sm font-bold tracking-tight transition-colors cursor-pointer border-b-2 ${
              activeTab === 'desc'
                ? 'border-[#EA580C] text-[#EA580C]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Product Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold tracking-tight transition-colors cursor-pointer border-b-2 ${
              activeTab === 'specs'
                ? 'border-[#EA580C] text-[#EA580C]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Specifications & Purity
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-bold tracking-tight transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-[#EA580C] text-[#EA580C]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Customer Reviews</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
              {reviewsList.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'desc' && (
          <div className="py-6 max-w-4xl space-y-4 text-sm text-slate-700 leading-relaxed">
            <p className="text-base font-semibold text-slate-800">{product.description}</p>

            <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-200/60 my-4 space-y-2">
              <h4 className="font-bold text-[#78350F] text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />
                পণ্যটির বিশেষত্ব ও স্বাস্থ্যগত উপকারিতা:
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
                <li>সম্পূর্ণ প্রাকৃতিক ও কৃত্রিম রাসায়নিক মুক্ত উপায়ে সংগৃহীত ও প্রস্তুত।</li>
                <li>রোগ প্রতিরোধ ক্ষমতা এবং হজম শক্তি বৃদ্ধিতে অত্যন্ত কার্যকরী ভূমিকা রাখে।</li>
                <li>পরিবারের শিশু ও বয়স্কদের পুষ্টির চাহিদা পূরণে শতভাগ নিরাপদ।</li>
                <li>BSTI নির্দেশিকা ও আন্তর্জাতিক স্বাস্থ্যমান বজায় রেখে স্বাস্থ্যকর পরিবেশে বোতলজাতকৃত।</li>
              </ul>
            </div>

            <p className="text-xs text-slate-500">
              সংরক্ষণ পদ্ধতি: আর্দ্রতা ও সরাসরি সূর্যালোক থেকে দূরে শুষ্ক ও স্বাভাবিক তাপমাত্রায় সংরক্ষণ করুন। ফ্রিজে রাখার প্রয়োজন নেই।
            </p>
          </div>
        )}

        {/* Tab 2: Specifications */}
        {activeTab === 'specs' && (
          <div className="py-6 max-w-3xl">
            <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs sm:text-sm">
              <div className="grid grid-cols-3 p-3 bg-slate-50">
                <span className="font-bold text-slate-700">Category</span>
                <span className="col-span-2 text-slate-600 capitalize">{product.category}</span>
              </div>
              <div className="grid grid-cols-3 p-3">
                <span className="font-bold text-slate-700">Origin / Source</span>
                <span className="col-span-2 text-slate-600">
                  {product.origin || 'Sundarbans / Rural Farms of Bangladesh'}
                </span>
              </div>
              <div className="grid grid-cols-3 p-3 bg-slate-50">
                <span className="font-bold text-slate-700">Purity Guarantee</span>
                <span className="col-span-2 text-emerald-700 font-semibold">
                  100% Pure, Unfiltered & Lab Tested
                </span>
              </div>
              <div className="grid grid-cols-3 p-3">
                <span className="font-bold text-slate-700">Net Weight / Volume</span>
                <span className="col-span-2 text-slate-600">
                  {product.sizeOrWeight || 'Multiple Variants Available'}
                </span>
              </div>
              <div className="grid grid-cols-3 p-3 bg-slate-50">
                <span className="font-bold text-slate-700">Shelf Life</span>
                <span className="col-span-2 text-slate-600">12 - 24 Months from packaging</span>
              </div>
              <div className="grid grid-cols-3 p-3">
                <span className="font-bold text-slate-700">Packaging Type</span>
                <span className="col-span-2 text-slate-600">Food-grade airtight glass & pet jar</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-base font-bold text-slate-800">
                Customer Ratings ({reviewsList.length})
              </h3>

              {reviewsList.length === 0 ? (
                <p className="text-xs text-slate-500 italic">
                  No reviews yet. Be the first to share your experience with this pure food product!
                </p>
              ) : (
                <div className="space-y-3">
                  {reviewsList.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm font-semibold">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{rev.date}</span>
                      </div>

                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write Review Form (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 h-fit space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Share Your Honest Experience</h4>
              <p className="text-xs text-slate-500">
                Help other families choose authentic, healthy groceries.
              </p>

              <form onSubmit={handleAddReview} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:border-[#EA580C] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Feedback</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about the taste, aroma, delivery speed, and overall satisfaction..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:border-[#EA580C] outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Submit Product Review
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Similar Pure Food Products</h3>
            <button
              type="button"
              onClick={() => onNavigate('shop', `category=${product.category}`)}
              className="text-xs font-bold text-[#EA580C] hover:underline"
            >
              See More in {product.category} →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
