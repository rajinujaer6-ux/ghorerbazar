import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  User as UserIcon,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Info,
  Phone,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  LogOut,
  Settings as SettingsIcon,
  PackageCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const {
    cartCount,
    cartGrandTotal,
    wishlist,
    setIsCartOpen,
    currentUser,
    isAdmin,
    logout,
    switchToDemoAdmin,
    switchToDemoCustomer,
    settings,
    products,
    categories,
    formatPrice,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeCategoryMenu, setActiveCategoryMenu] = useState<string | null>(null);

  // Live search state
  const [searchInput, setSearchInput] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter products for search autocomplete
  const searchResults = searchInput.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            (p.bengaliName && p.bengaliName.includes(searchInput)) ||
            p.category.toLowerCase().includes(searchInput.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchInput.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onNavigate('shop', `search=${encodeURIComponent(searchInput.trim())}`);
      setSearchFocused(false);
    }
  };

  return (
    <>
      <header className="relative w-full bg-white border-b border-slate-100">
        {/* Main Header Row */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-3">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Ghorer Bazar Authentic Logo */}
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center shadow-sm text-white p-2 transition-transform group-hover:scale-105">
                {/* Organic Leaf emblem */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold tracking-tight text-xl sm:text-2xl text-[#EA580C] leading-none font-['Plus_Jakarta_Sans']">
                    GHORER
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">®</span>
                </div>
                <span className="font-bold tracking-widest text-xs sm:text-sm text-[#053229] leading-tight">
                  BAZAR
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar (Centered, matching screenshot) */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search in..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full bg-[#F3F4F6] hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 text-sm rounded-lg pl-4 pr-11 py-2.5 border border-transparent focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all outline-hidden"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-[#EA580C] transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Live Autocomplete Results */}
            {searchFocused && searchInput.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    <div className="p-2 text-xs font-semibold text-slate-400 bg-slate-50 flex items-center justify-between">
                      <span>Products Found ({searchResults.length})</span>
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="text-[#EA580C] hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          onNavigate('product', product.slug);
                          setSearchFocused(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 text-left transition-colors"
                      >
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {product.name}
                          </p>
                          {product.bengaliName && (
                            <p className="text-xs text-slate-500 truncate font-['Hind_Siliguri']">
                              {product.bengaliName}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-[#EA580C]">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-[11px] text-slate-400 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">
                    No products found for "{searchInput}".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons (Matching Screenshot) */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
            {/* Direct Admin Panel Button (Visible immediately when logged in as rajinujaer6@gmail.com) */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-[#053229] text-white ring-2 ring-[#EA580C]'
                    : 'bg-[#EA580C] hover:bg-[#C2410C] text-white'
                }`}
                title="Open Store Admin Dashboard"
              >
                <SettingsIcon className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Admin Panel</span>
              </button>
            )}

            {/* Track Order */}
            <button
              type="button"
              onClick={() => onNavigate('track-order')}
              className={`flex flex-col items-center gap-0.5 text-xs font-medium transition-colors hover:text-[#EA580C] cursor-pointer ${
                currentView === 'track-order' ? 'text-[#EA580C]' : 'text-slate-700'
              }`}
            >
              <PackageCheck className="w-5 h-5 text-slate-700 hover:text-[#EA580C] transition-colors" />
              <span className="hidden sm:inline">Track Order</span>
            </button>

            {/* Sign In / Account Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  if (currentUser) {
                    setUserDropdownOpen(!userDropdownOpen);
                  } else {
                    onNavigate('login');
                  }
                }}
                className={`flex flex-col items-center gap-0.5 text-xs font-medium transition-colors hover:text-[#EA580C] cursor-pointer ${
                  currentView === 'login' || currentView === 'account'
                    ? 'text-[#EA580C]'
                    : 'text-slate-700'
                }`}
              >
                <UserIcon className="w-5 h-5 text-slate-700 hover:text-[#EA580C] transition-colors" />
                <span className="hidden sm:inline">
                  {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
                </span>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                    <span className="inline-block mt-0.5 text-[10px] uppercase font-bold px-1.5 py-0.2 bg-orange-100 text-[#EA580C] rounded-sm">
                      {currentUser.role}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('account');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    My Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('account', 'tab=orders');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <PackageCheck className="w-4 h-4 text-slate-400" />
                    Order History
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#053229] font-semibold hover:bg-slate-50 flex items-center gap-2"
                    >
                      <SettingsIcon className="w-4 h-4 text-[#053229]" />
                      Store Admin Panel
                    </button>
                  )}
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button
              type="button"
              onClick={() => onNavigate('wishlist')}
              className={`relative flex flex-col items-center gap-0.5 text-xs font-medium transition-colors hover:text-[#EA580C] cursor-pointer ${
                currentView === 'wishlist' ? 'text-[#EA580C]' : 'text-slate-700'
              }`}
            >
              <div className="relative">
                <Heart className="w-5 h-5 text-slate-700 hover:text-[#EA580C] transition-colors" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#EA580C] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Wishlist</span>
            </button>

            {/* Cart Icon with Counter */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex flex-col items-center gap-0.5 text-xs font-medium text-slate-700 hover:text-[#EA580C] transition-colors cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-slate-700 hover:text-[#EA580C] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#EA580C] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-scale">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>

            {/* More Menu (Dropdown matching screenshot) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="flex flex-col items-center gap-0.5 text-xs font-medium text-slate-700 hover:text-[#EA580C] transition-colors cursor-pointer"
              >
                <div className="flex items-center">
                  <Menu className="w-5 h-5 text-slate-700 hover:text-[#EA580C] transition-colors" />
                </div>
                <span className="hidden sm:inline">More</span>
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('about');
                      setMoreDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <Info className="w-4 h-4 text-slate-400" />
                    About Us
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('wishlist');
                      setMoreDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <Heart className="w-4 h-4 text-slate-400" />
                    Wishlists
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('faq');
                      setMoreDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    Faqs
                  </button>
                  <a
                    href={`tel:${settings.contactPhone}`}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <Phone className="w-4 h-4 text-slate-400" />
                    Call Us
                  </a>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left px-4 py-2 text-sm text-[#25D366] font-semibold hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    WhatsApp
                  </a>
                  {isAdmin && (
                    <>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('admin');
                          setMoreDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#EA580C] font-semibold hover:bg-orange-50 flex items-center gap-2.5"
                      >
                        <SettingsIcon className="w-4 h-4 text-[#EA580C]" />
                        Admin Panel
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="mt-3 sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search in Ghorer Bazar..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-[#F3F4F6] text-slate-800 placeholder-slate-400 text-sm rounded-lg pl-4 pr-10 py-2 border border-transparent focus:border-[#EA580C] outline-hidden"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-slate-500"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </header>

    {/* Second Nav Bar (Dark Forest Green) - Hardware-accelerated smooth sticky navigation */}
    <nav className="sticky top-0 z-40 w-full bg-[#053229] text-white shadow-md border-b border-emerald-950/40">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex items-center justify-start lg:justify-between text-xs font-semibold tracking-wide overflow-x-auto py-2.5 scrollbar-none gap-3 lg:gap-0">
          {/* Offer Zone with special badge */}
            <button
              type="button"
              onClick={() => onNavigate('shop', 'category=offer-zone')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-amber-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Offer Zone</span>
            </button>

            {/* Main Categories with dropdown indicator */}
            {categories.slice(0, 9).map((cat) => (
              <div
                key={cat.id}
                className="relative group"
                onMouseEnter={() => setActiveCategoryMenu(cat.id)}
                onMouseLeave={() => setActiveCategoryMenu(null)}
              >
                <button
                  type="button"
                  onClick={() => onNavigate('shop', `category=${cat.slug}`)}
                  className="flex items-center gap-1 px-3 py-1 rounded-md text-slate-100 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                >
                  <span>{cat.name}</span>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <ChevronDown className="w-3 h-3 text-slate-300 group-hover:rotate-180 transition-transform" />
                  )}
                </button>

                {/* Subcategory Dropdown */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-100 py-1.5 z-50">
                    <button
                      type="button"
                      onClick={() => onNavigate('shop', `category=${cat.slug}`)}
                      className="w-full text-left px-3 py-1.5 text-xs font-bold text-[#EA580C] hover:bg-slate-50"
                    >
                      All {cat.name}
                    </button>
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => onNavigate('shop', `category=${cat.slug}&sub=${encodeURIComponent(sub)}`)}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#EA580C] transition-colors"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Extra Categories / Labels from screenshot */}
            <button
              type="button"
              onClick={() => onNavigate('shop', 'filter=certified')}
              className="px-3 py-1 rounded-md text-slate-100 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            >
              Certified
            </button>
            <button
              type="button"
              onClick={() => onNavigate('shop', 'category=pickle')}
              className="px-3 py-1 rounded-md text-slate-100 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            >
              Pickle
            </button>
            <button
              type="button"
              onClick={() => onNavigate('shop', 'category=organic')}
              className="px-3 py-1 rounded-md text-slate-100 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            >
              Tabaya
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Header */}
            <div className="p-4 bg-[#053229] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-[#EA580C]">GHORER BAZAR</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Quick Info */}
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              {currentUser ? (
                <div>
                  <p className="text-xs text-slate-500">Welcome,</p>
                  <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('account');
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs text-[#EA580C] font-semibold"
                    >
                      My Account →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('login');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2 text-center text-xs font-bold bg-[#EA580C] text-white rounded-lg shadow-xs"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            {/* Navigation List */}
            <div className="p-4 space-y-1 flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Categories
              </p>
              <button
                type="button"
                onClick={() => {
                  onNavigate('shop', 'category=offer-zone');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-600 bg-amber-50"
              >
                <span>🔥 Offer Zone</span>
                <span className="text-xs bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-sm">
                  Deals
                </span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onNavigate('shop', `category=${cat.slug}`);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 text-left"
                >
                  <span>{cat.name}</span>
                  {cat.bengaliName && (
                    <span className="text-xs text-slate-400 font-['Hind_Siliguri']">
                      {cat.bengaliName}
                    </span>
                  )}
                </button>
              ))}

              <div className="border-t border-slate-100 my-4 pt-3 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Quick Links
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('track-order');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <PackageCheck className="w-4 h-4 text-slate-500" />
                  Track Order
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('wishlist');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 text-slate-500" />
                  Wishlist ({wishlist.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('about');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Info className="w-4 h-4 text-slate-500" />
                  About Us
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('faq');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  FAQs
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('contact');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-slate-500" />
                  Contact Us
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-[#053229] font-bold hover:bg-slate-50 flex items-center gap-2"
                  >
                    <SettingsIcon className="w-4 h-4 text-[#053229]" />
                    Store Admin Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
