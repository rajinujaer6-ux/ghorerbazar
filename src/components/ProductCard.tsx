import React from 'react';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (view: string, param?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct, formatPrice } = useStore();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    addToCart(product, defaultVariant, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div
      onClick={() => onNavigate('product', product.slug)}
      className="group relative bg-white rounded-xl border border-slate-200/80 hover:border-[#EA580C]/40 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {product.discountPercent && product.discountPercent > 0 && (
          <span className="bg-[#EA580C] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-sm shadow-xs uppercase tracking-wider">
            {product.discountPercent}% OFF
          </span>
        )}
        {product.isBestseller && (
          <span className="bg-[#053229] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-xs uppercase tracking-wider">
            Bestseller
          </span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        type="button"
        onClick={handleToggleWishlist}
        className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-xs transition-all cursor-pointer ${
          inWishlist
            ? 'bg-red-50 text-red-500 hover:bg-red-100'
            : 'bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white shadow-2xs'
        }`}
        aria-label="Toggle Wishlist"
      >
        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500' : ''}`} />
      </button>

      {/* Image Container with Quick View on hover */}
      <div className="relative aspect-square w-full bg-[#F8F9FA] overflow-hidden flex items-center justify-center p-3">
        <img
          src={product.thumbnail || product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick View Button on Hover */}
        <button
          type="button"
          onClick={handleQuickView}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:text-[#EA580C]"
        >
          <Eye className="w-3.5 h-3.5" />
          Quick View
        </button>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Weight or Subcategory */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
            <span className="uppercase tracking-wider text-slate-400">
              {product.brand || 'Ghorer Bazar'}
            </span>
            {product.sizeOrWeight && (
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm">
                {product.sizeOrWeight}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-sm text-slate-800 group-hover:text-[#EA580C] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Bengali Name */}
          {product.bengaliName && (
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-['Hind_Siliguri']">
              {product.bengaliName}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating}</span>
            <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-[#EA580C]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {product.stock > 0 ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className="p-2 sm:px-3 sm:py-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
              title="Add to Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          ) : (
            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-sm">
              Stock Out
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
