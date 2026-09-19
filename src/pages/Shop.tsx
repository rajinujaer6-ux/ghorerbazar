import React, { useState, useMemo, useEffect } from 'react';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Sparkles,
  Check,
  Grid3X3,
  LayoutList,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

interface ShopProps {
  initialFilter?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const Shop: React.FC<ShopProps> = ({ initialFilter, onNavigate }) => {
  const { products, categories, formatPrice } = useStore();

  // Parsing initial parameters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(3500);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [offerZoneOnly, setOfferZoneOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Handle URL query string if provided
  useEffect(() => {
    if (!initialFilter) return;

    const params = new URLSearchParams(initialFilter);
    const categoryParam = params.get('category');
    const subParam = params.get('sub');
    const searchParam = params.get('search');
    const filterParam = params.get('filter');

    if (categoryParam) {
      if (categoryParam === 'offer-zone') {
        setOfferZoneOnly(true);
        setSelectedCategory('all');
      } else {
        setSelectedCategory(categoryParam);
      }
    }
    if (subParam) {
      setSelectedSubcategory(subParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (filterParam === 'certified') {
      setSelectedCategory('all');
    }
  }, [initialFilter]);

  // Available subcategories based on selected category
  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const availableSubcategories = activeCategoryObj?.subcategories || [];

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }

        // Subcategory filter
        if (selectedSubcategory !== 'all' && product.subcategory !== selectedSubcategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchBengali = product.bengaliName && product.bengaliName.includes(q);
          const matchCategory = product.category.toLowerCase().includes(q);
          const matchTags = product.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchBengali && !matchCategory && !matchTags) {
            return false;
          }
        }

        // Price range
        if (product.price > priceRange) {
          return false;
        }

        // In Stock
        if (inStockOnly && product.stock <= 0) {
          return false;
        }

        // Offer Zone Only
        if (offerZoneOnly && !product.isOfferZone && (!product.discountPercent || product.discountPercent < 12)) {
          return false;
        }

        // Minimum Rating
        if (minRating > 0 && product.rating < minRating) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
        if (sortBy === 'newest') return b.id.localeCompare(a.id);
        // default: featured / bestsellers first
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [
    products,
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    priceRange,
    inStockOnly,
    offerZoneOnly,
    minRating,
    sortBy,
  ]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSearchQuery('');
    setPriceRange(3500);
    setInStockOnly(false);
    setOfferZoneOnly(false);
    setMinRating(0);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSubcategory !== 'all' ||
    searchQuery.trim() !== '' ||
    priceRange < 3500 ||
    inStockOnly ||
    offerZoneOnly ||
    minRating > 0;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-6">
      {/* Breadcrumbs & Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-[#EA580C] cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Shop Pure Groceries</span>
          {selectedCategory !== 'all' && (
            <>
              <span>/</span>
              <span className="text-[#EA580C] font-semibold">
                {activeCategoryObj?.name || selectedCategory}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {offerZoneOnly
                ? '⚡ Offer Zone Deals'
                : selectedCategory !== 'all'
                ? activeCategoryObj?.name
                : 'All Pure & Organic Products'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {filteredProducts.length} of {products.length} lab-tested natural items
            </p>
          </div>

          {/* Controls: Mobile Filter toggle & Sort Selector */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Filters {hasActiveFilters && '•'}</span>
            </button>

            {/* View Mode (Grid vs List) */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'grid' ? 'bg-white text-[#EA580C] shadow-2xs' : 'text-slate-500'
                }`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'list' ? 'bg-white text-[#EA580C] shadow-2xs' : 'text-slate-500'
                }`}
                title="List View"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products by"
                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-3 py-2 pr-8 shadow-2xs focus:ring-1 focus:ring-[#EA580C] outline-hidden cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="discount">Highest Discount</option>
                <option value="newest">Newest Additions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-medium">Active Filters:</span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-orange-50 text-[#EA580C] border border-orange-200 text-xs px-2.5 py-1 rounded-full font-medium">
                Category: {activeCategoryObj?.name}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSubcategory('all');
                  }}
                  className="hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSubcategory !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-orange-50 text-[#EA580C] border border-orange-200 text-xs px-2.5 py-1 rounded-full font-medium">
                Sub: {selectedSubcategory}
                <button
                  type="button"
                  onClick={() => setSelectedSubcategory('all')}
                  className="hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 text-xs px-2.5 py-1 rounded-full font-medium">
                Keyword: "{searchQuery}"
                <button type="button" onClick={() => setSearchQuery('')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {offerZoneOnly && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs px-2.5 py-1 rounded-full font-medium">
                Offer Zone Only
                <button type="button" onClick={() => setOfferZoneOnly(false)} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-medium">
                In Stock Only
                <button type="button" onClick={() => setInStockOnly(false)} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-medium">
                ★ {minRating}+ Stars
                <button type="button" onClick={() => setMinRating(0)} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-red-600 hover:underline font-semibold ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          {/* Categories List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center justify-between">
              <span>Categories</span>
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSubcategory('all');
                  }}
                  className="text-[11px] text-[#EA580C] hover:underline normal-case font-normal"
                >
                  Reset
                </button>
              )}
            </h3>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                  setOfferZoneOnly(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                  selectedCategory === 'all' && !offerZoneOnly
                    ? 'bg-[#EA580C] text-white'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                <span>{products.length}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOfferZoneOnly(true);
                  setSelectedCategory('all');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                  offerZoneOnly ? 'bg-[#EA580C] text-white' : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <span>🔥 Offer Zone Deals</span>
                <span>
                  {products.filter((p) => p.isOfferZone || (p.discountPercent && p.discountPercent > 12)).length}
                </span>
              </button>

              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.slug).length;
                const isSelected = selectedCategory === cat.slug;
                return (
                  <div key={cat.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setSelectedSubcategory('all');
                        setOfferZoneOnly(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                        isSelected ? 'bg-[#EA580C] text-white' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={isSelected ? 'text-white/80' : 'text-slate-400'}>
                        {count}
                      </span>
                    </button>

                    {/* Subcategories */}
                    {isSelected && cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="pl-4 py-1 space-y-1 border-l-2 border-orange-200 ml-3">
                        <button
                          type="button"
                          onClick={() => setSelectedSubcategory('all')}
                          className={`block text-[11px] py-1 text-left ${
                            selectedSubcategory === 'all'
                              ? 'text-[#EA580C] font-bold'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          All {cat.name}
                        </button>
                        {cat.subcategories.map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => setSelectedSubcategory(sub)}
                            className={`block text-[11px] py-1 text-left truncate ${
                              selectedSubcategory === sub
                                ? 'text-[#EA580C] font-bold'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-900">
              <span className="uppercase tracking-wider">Max Price</span>
              <span className="text-[#EA580C] font-extrabold">{formatPrice(priceRange)}</span>
            </div>
            <input
              type="range"
              min="200"
              max="3500"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#EA580C] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>৳ 200</span>
              <span>৳ 3,500</span>
            </div>
          </div>

          {/* Availability & Quality Filters */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Preferences
            </h3>
            <div className="space-y-2 text-xs text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-sm text-[#EA580C] focus:ring-[#EA580C]"
                />
                <span>In Stock Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={offerZoneOnly}
                  onChange={(e) => setOfferZoneOnly(e.target.checked)}
                  className="rounded-sm text-[#EA580C] focus:ring-[#EA580C]"
                />
                <span>Discounted & Deals</span>
              </label>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Customer Rating
            </h3>
            <div className="space-y-1.5 text-xs text-slate-700">
              {[4, 3].map((stars) => (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    minRating === stars ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-1 text-amber-500">
                    {'★'.repeat(stars)}
                    <span className="text-slate-600 font-medium ml-1">& up</span>
                  </span>
                  {minRating === stars && <Check className="w-3.5 h-3.5 text-[#EA580C]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid / List */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-[#EA580C] mx-auto flex items-center justify-center mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No pure food items found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
                We couldn't find any products matching your specific filters. Try expanding your price limit or clearing active filters.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-5 px-5 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onNavigate('product', product.slug)}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#EA580C]/40 hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-4 cursor-pointer"
                >
                  <img
                    src={product.thumbnail || product.images[0]}
                    alt={product.name}
                    className="w-28 h-28 object-contain bg-slate-50 rounded-lg p-2 shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <span className="text-[11px] font-semibold text-[#EA580C] uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="font-bold text-base text-slate-800 mt-0.5">{product.name}</h3>
                    {product.bengaliName && (
                      <p className="text-xs text-slate-500 font-['Hind_Siliguri']">
                        {product.bengaliName}
                      </p>
                    )}
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {product.shortDescription || product.description}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                      <span className="text-base font-extrabold text-[#EA580C]">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      <span className="text-xs text-amber-500 font-bold">★ {product.rating}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('product', product.slug);
                    }}
                    className="px-4 py-2 bg-[#EA580C] text-white text-xs font-bold rounded-lg shrink-0 hover:bg-[#C2410C]"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          ></div>
          <div className="relative ml-auto w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto p-5 space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-800">Filter Products</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase">Categories</p>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setMobileFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg ${
                    selectedCategory === 'all' ? 'bg-[#EA580C] text-white' : 'text-slate-700'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg ${
                      selectedCategory === cat.slug ? 'bg-[#EA580C] text-white' : 'text-slate-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Max Price:</span>
                <span className="text-[#EA580C]">{formatPrice(priceRange)}</span>
              </div>
              <input
                type="range"
                min="200"
                max="3500"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#EA580C]"
              />
            </div>

            <div className="pt-4 border-t flex gap-2">
              <button
                type="button"
                onClick={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2 text-xs font-semibold border border-slate-300 rounded-lg text-slate-700"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2 text-xs font-bold bg-[#EA580C] text-white rounded-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
