import React, { useState, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle2,
  Heart,
  TrendingUp,
  Star,
  Clock,
  Phone
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

// Playful cartoonish style metadata with appetizing food & dry food pictures
const CATEGORY_STYLE_MAP: Record<string, {
  bg: string;
  border: string;
  badgeBg: string;
  badgeColor: string;
  badgeText: string;
  foodImage: string;
}> = {
  'nuts-seeds': {
    bg: 'bg-[#FFF7ED]',
    border: 'border-[#FDBA74] hover:border-[#EA580C]',
    badgeBg: 'bg-[#EA580C]',
    badgeColor: 'text-white',
    badgeText: '🥜 ড্রাই ফুডস',
    foodImage: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=500&auto=format&fit=crop&q=80',
  },
  'dates': {
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#FCD34D] hover:border-[#D97706]',
    badgeBg: 'bg-[#D97706]',
    badgeColor: 'text-white',
    badgeText: '🌴 মদিনার খেজুর',
    foodImage: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=500&auto=format&fit=crop&q=80',
  },
  'honey': {
    bg: 'bg-[#FEFCE8]',
    border: 'border-[#FDE047] hover:border-[#CA8A04]',
    badgeBg: 'bg-[#EAB308]',
    badgeColor: 'text-slate-900',
    badgeText: '🍯 খাঁটি মধু',
    foodImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80',
  },
  'oil-ghee': {
    bg: 'bg-[#FEF3C7]',
    border: 'border-[#F59E0B] hover:border-[#B45309]',
    badgeBg: 'bg-[#B45309]',
    badgeColor: 'text-white',
    badgeText: '🧈 গাওয়া ঘি',
    foodImage: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?w=500&auto=format&fit=crop&q=80',
  },
  'organic': {
    bg: 'bg-[#F0FDF4]',
    border: 'border-[#86EFAC] hover:border-[#16A34A]',
    badgeBg: 'bg-[#16A34A]',
    badgeColor: 'text-white',
    badgeText: '🌱 অর্গানিক সিডস',
    foodImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
  },
  'spices': {
    bg: 'bg-[#FFF1F2]',
    border: 'border-[#FDA4AF] hover:border-[#E11D48]',
    badgeBg: 'bg-[#E11D48]',
    badgeColor: 'text-white',
    badgeText: '🌶️ অকৃত্রিম মসলা',
    foodImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80',
  },
  'beverage': {
    bg: 'bg-[#F0FDFA]',
    border: 'border-[#99F6E4] hover:border-[#0D9488]',
    badgeBg: 'bg-[#0D9488]',
    badgeColor: 'text-white',
    badgeText: '🍵 সুবাসিত চা',
    foodImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
  },
  'rice': {
    bg: 'bg-[#F8FAFC]',
    border: 'border-[#CBD5E1] hover:border-[#475569]',
    badgeBg: 'bg-[#475569]',
    badgeColor: 'text-white',
    badgeText: '🍚 সুগন্ধি চাল',
    foodImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
  },
  'flours-lentils': {
    bg: 'bg-[#FAF5FF]',
    border: 'border-[#E9D5FF] hover:border-[#9333EA]',
    badgeBg: 'bg-[#9333EA]',
    badgeColor: 'text-white',
    badgeText: '🌾 লাল আটা ও ডাল',
    foodImage: 'https://images.unsplash.com/photo-1607672632458-9eb56696346b?w=500&auto=format&fit=crop&q=80',
  },
  'pickle': {
    bg: 'bg-[#ECFCCB]',
    border: 'border-[#BEF264] hover:border-[#65A30D]',
    badgeBg: 'bg-[#65A30D]',
    badgeColor: 'text-white',
    badgeText: '🍋 মুখরোচক আচার',
    foodImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80',
  },
};

interface HomeProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { products, categories, heroSlides, promoBanner, formatPrice } = useStore();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const activeSlides = heroSlides.filter((s) => s.active);
  const currentSlide = activeSlides.length > 0 ? (activeSlides[currentSlideIndex] || activeSlides[0]) : null;

  const nextSlide = () => {
    if (activeSlides.length > 0) {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }
  };

  const prevSlide = () => {
    if (activeSlides.length > 0) {
      setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    }
  };

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Prioritize categories with dry foods, dates, honey, organic up front
  const displayCategories = useMemo(() => {
    const all = categories.length > 0 ? [...categories] : [];
    const orderPriority: Record<string, number> = {
      'nuts-seeds': 1,
      'dates': 2,
      'honey': 3,
      'oil-ghee': 4,
      'organic': 5,
      'spices': 6,
      'beverage': 7,
      'rice': 8,
      'flours-lentils': 9,
      'pickle': 10,
    };
    return all.sort((a, b) => (orderPriority[a.slug] || 99) - (orderPriority[b.slug] || 99));
  }, [categories]);

  // Seamless infinite loop category list (duplicated for smooth uninterrupted marquee)
  const infiniteCategories = useMemo(() => {
    if (displayCategories.length === 0) return [];
    return [...displayCategories, ...displayCategories];
  }, [displayCategories]);

  const featuredCategories = categories.filter((c) => c.isFeatured);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 6);
  const honeyAndOils = products.filter((p) => p.category === 'honey' || p.category === 'oil-ghee').slice(0, 6);
  const datesAndNuts = products.filter((p) => p.category === 'dates' || p.category === 'nuts-seeds').slice(0, 6);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO SECTION & PROMO BANNER */}
      <section className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Hero Carousel (Left, 8 Cols) */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden shadow-sm bg-gradient-to-r from-emerald-900 to-teal-950 text-white min-h-[340px] sm:min-h-[400px] flex flex-col justify-between">
            {currentSlide && (
              <>
                {/* Slide Background Image with subtle gradient overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={currentSlide.imageUrl}
                    alt={currentSlide.bengaliTitle || currentSlide.title}
                    className="w-full h-full object-cover object-center opacity-90 scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent"></div>
                </div>

                {/* Slide Content - Minimal & Clean */}
                <div className="relative z-10 p-6 sm:p-10 max-w-md flex flex-col justify-center h-full">
                  {currentSlide.badge && (
                    <div className="inline-flex items-center gap-1.5 bg-[#EA580C] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2.5 w-fit shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>{currentSlide.badge}</span>
                    </div>
                  )}

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight font-['Hind_Siliguri'] drop-shadow-sm">
                    {currentSlide.bengaliTitle || currentSlide.title}
                  </h1>

                  {currentSlide.subtitle && (
                    <p className="text-xs sm:text-sm text-amber-200/90 font-medium mt-1.5 max-w-xs leading-relaxed">
                      {currentSlide.subtitle}
                    </p>
                  )}
                </div>

                {/* Carousel Controls & Pagination Dots */}
                <div className="relative z-10 px-6 sm:px-10 pb-5 flex items-center justify-between">
                  {/* Dots */}
                  <div className="flex items-center gap-2">
                    {activeSlides.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`h-2.5 rounded-full transition-all cursor-pointer ${
                          currentSlideIndex === idx ? 'w-8 bg-[#EA580C]' : 'w-2.5 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Prev / Next Arrows */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={prevSlide}
                      className="w-8 h-8 rounded-full bg-black/20 hover:bg-[#EA580C] text-white flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Previous Slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      className="w-8 h-8 rounded-full bg-black/20 hover:bg-[#EA580C] text-white flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Next Slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Side Promotional Banner (Right, 4 Cols) - Minimal with High Quality Picture */}
          <div className="lg:col-span-4 relative rounded-2xl overflow-hidden shadow-sm min-h-[340px] sm:min-h-[400px] flex flex-col justify-end p-6 text-white group cursor-pointer" onClick={() => onNavigate('shop', 'category=honey')}>
            {/* Background High-Quality Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={promoBanner.imageUrl}
                alt={promoBanner.bengaliTitle || promoBanner.title}
                className="w-full h-full object-cover object-center opacity-90 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
            </div>

            {/* Clean Minimal Content */}
            <div className="relative z-10">
              {promoBanner.badge && (
                <span className="inline-block bg-[#EA580C] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2.5 shadow-xs">
                  {promoBanner.badge}
                </span>
              )}

              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug font-['Hind_Siliguri'] drop-shadow-sm">
                {promoBanner.bengaliTitle || promoBanner.title}
              </h3>

              {promoBanner.description && (
                <p className="text-xs text-amber-200/90 font-medium mt-1.5 line-clamp-1 leading-relaxed">
                  {promoBanner.description}
                </p>
              )}

              <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-medium">প্রাকৃতিক ফসল</span>
                <span className="text-sm font-extrabold text-amber-300">৳ ৯৫০ - ১৮০০</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES - Playful Cartoonish Style with Real Delicious Food & Dry Food Photos */}
      <section className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        {/* Playful Friendly Section Header - Compact */}
        <div className="flex flex-col items-center text-center mb-3">
          <div className="inline-flex items-center gap-1 bg-amber-100/90 text-[#B45309] text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300 shadow-2xs mb-1">
            <Sparkles className="w-3 h-3 text-[#EA580C] animate-pulse" />
            <span>১০০% খাঁটি ও পুষ্টিকর খাদ্যসম্ভার</span>
            <Sparkles className="w-3 h-3 text-[#EA580C] animate-pulse" />
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 font-['Hind_Siliguri'] flex items-center justify-center gap-1.5">
            <span>জনপ্রিয় খাবার ও ড্রাই ফুড ক্যাটাগরি</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 max-w-md font-medium font-['Hind_Siliguri']">
            প্রাকৃতিক উপায়ে সংগৃহীত পুষ্টিকর ড্রাই ফুডস, কাজু-কাঠবাদাম, মদিনার খেজুর ও খাঁটি পণ্য
          </p>
        </div>

        {/* Playful Cartoonish Category Cards - Smooth Continuous Infinite Loop Carousel */}
        <div className="relative overflow-hidden w-full py-1 group/marquee">
          {/* Subtle gradient fades on edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

          {/* Infinite Moving Loop Track */}
          <div className="animate-infinite-loop flex items-stretch gap-2.5 sm:gap-3 py-2 px-1">
            {infiniteCategories.map((cat, index) => {
              const style = CATEGORY_STYLE_MAP[cat.slug] || {
                bg: 'bg-emerald-50/70',
                border: 'border-emerald-300 hover:border-emerald-500',
                badgeBg: 'bg-emerald-600',
                badgeColor: 'text-white',
                badgeText: '🌿 খাঁটি খাদ্য',
                foodImage: cat.image,
              };

              return (
                <button
                  key={`${cat.id}-${index}`}
                  type="button"
                  onClick={() => onNavigate('shop', `category=${cat.slug}`)}
                  className={`shrink-0 w-28 sm:w-32 group/item relative flex flex-col items-center justify-between p-2 sm:p-2.5 ${style.bg} border-2 ${style.border} rounded-2xl transition-all duration-200 shadow-[0_3px_0_rgba(0,0,0,0.05)] hover:shadow-[0_6px_0_rgba(234,88,12,0.25)] hover:-translate-y-1 active:translate-y-0.5 active:shadow-[0_1px_0_rgba(0,0,0,0.05)] cursor-pointer text-center select-none overflow-hidden`}
                >
                  {/* Cute Cartoonish Sticker Badge */}
                  <div className="w-full flex items-center justify-center">
                    <span className={`inline-flex items-center gap-0.5 ${style.badgeBg} ${style.badgeColor} text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-2xs tracking-tight transform group-hover/item:scale-105 transition-transform truncate max-w-full`}>
                      {style.badgeText}
                    </span>
                  </div>

                  {/* Appetizing Real Food Picture in Cute Rounded Cartoonish Frame */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 my-1.5 rounded-xl bg-white p-0.5 ring-2 ring-white shadow-xs overflow-hidden relative group-hover/item:scale-110 group-hover/item:rotate-3 transition-transform duration-300">
                    <img
                      src={style.foodImage || cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>

                  {/* Playful Bilingual Typography */}
                  <div className="w-full mt-0.5">
                    <span className="block text-[11px] sm:text-xs font-black text-slate-900 group-hover/item:text-[#EA580C] transition-colors leading-tight truncate">
                      {cat.name}
                    </span>
                    {cat.bengaliName && (
                      <span className="block text-[10px] sm:text-[11px] font-bold text-slate-600 font-['Hind_Siliguri'] mt-0.5 truncate">
                        {cat.bengaliName}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION */}
      <section className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Customer Best Sellers
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The highest-rated pure groceries loved by over 100,000+ households
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-[#EA580C] hover:text-[#C2410C] flex items-center gap-1 cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* 5. HERITAGE CATEGORY SHOWCASE: SUNDARBAN HONEY & GHANI OILS */}
      <section className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Raw Wild Honey & Traditional Cold-Pressed Oils
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Harvested deep from the Sundarbans and slow-pressed in heritage wooden ghanis
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shop', 'category=honey')}
            className="text-xs font-bold text-[#EA580C] hover:text-[#C2410C] flex items-center gap-1 cursor-pointer"
          >
            <span>Browse Honey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
          {honeyAndOils.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE GHORER BAZAR BANNER */}
      <section className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <div className="bg-[#053229] rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-emerald-800 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>THE GHORER BAZAR PLEDGE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              কেন ঘরের বাজারের পণ্য সম্পূর্ণ আলাদা?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              আমরা মধ্যস্বত্বভোগী ছাড়া সরাসরি সুন্দরবনের মৌয়াল, গ্রামের গাভী পালনকারী ও মাঠের কৃষকের কাছ থেকে পণ্য সংগ্রহ করি। কোনো প্রকার রাসায়নিক, কৃত্রিম সুবাস বা প্রিজারভেটিভ ব্যবহার না করে প্রাকৃতিক খাঁটি স্বাদ আপনার খাবার টেবিলে পৌঁছে দেওয়াই আমাদের ব্রত।
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ল্যাব টেস্ট রিপোর্ট সহ নিশ্চিত বিশুদ্ধতা</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>কাঠের ঘানিতে ভাঙা কোনো রাসায়নিক ছাড়া</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>পণ্য দেখে ক্যাশ অন ডেলিভারিতে নেওয়ার সুযোগ</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Learn Our Story →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DATES & NUTS SHOWCASE */}
      <section className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Arabian Dates & Royal Roasted Nuts
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Grade-A Ajwa, Medjool, and dry-air roasted dry fruits for clean stamina
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shop', 'category=dates')}
            className="text-xs font-bold text-[#EA580C] hover:text-[#C2410C] flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Dates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
          {datesAndNuts.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* 8. CUSTOMER TESTIMONIALS */}
      <section className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Real Words from Real Customers
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Thousands of families in Dhaka and all 64 districts trust Ghorer Bazar daily
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "সুন্দরবনের খলিসা ফুলের মধু সত্যিই অসাধারণ। কোনো ভেজাল নেই, আসল প্রাকৃতিক ঘ্রাণ। ঢাকায় ২৪ ঘণ্টার মধ্যে ডেলিভারি পেয়েছি।"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Ashfaqur Rahman</h4>
                <p className="text-[11px] text-slate-400">Uttara, Dhaka</p>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Verified Buyer
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "গাওয়া ঘিয়ের দানাদার টেক্সচার এবং ঘ্রাণ অতুলনীয়! গরম ভাতে একটু দিলেই পুরো খাবার আনন্দদায়ক হয়ে ওঠে। ধন্যবাদ ঘরের বাজার।"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Dr. Shahriar Kabir</h4>
                <p className="text-[11px] text-slate-400">Dhanmondi, Dhaka</p>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Verified Buyer
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "কাঠের ঘানির সরিষার তেল দিয়ে ইলিশ ভুনা ও ভর্তা বানিয়েছি। ঝাঝ এবং খাঁটি স্বাদ বজায় আছে। সবার ট্রাই করা উচিত।"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Nusrat Jahan</h4>
                <p className="text-[11px] text-slate-400">Nasirabad, Chittagong</p>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Verified Buyer
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
