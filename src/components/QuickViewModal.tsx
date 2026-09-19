import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Heart, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductVariant } from '../types';

interface QuickViewModalProps {
  onNavigate: (view: string, param?: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onNavigate }) => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    setIsCartOpen,
  } = useStore();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (quickViewProduct) {
      if (quickViewProduct.variants && quickViewProduct.variants.length > 0) {
        setSelectedVariant(quickViewProduct.variants[0]);
      } else {
        setSelectedVariant(undefined);
      }
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const currentPrice = selectedVariant ? selectedVariant.price : quickViewProduct.price;
  const currentOriginalPrice = selectedVariant
    ? selectedVariant.originalPrice
    : quickViewProduct.originalPrice;
  const currentStock = selectedVariant ? selectedVariant.stock : quickViewProduct.stock;
  const inWishlist = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedVariant, quantity);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, selectedVariant, quantity);
    setQuickViewProduct(null);
    setIsCartOpen(false);
    onNavigate('checkout');
  };

  const handleViewFullDetails = () => {
    const slug = quickViewProduct.slug;
    setQuickViewProduct(null);
    onNavigate('product', slug);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square bg-[#F8F9FA] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-slate-100">
              <img
                src={quickViewProduct.images[activeImageIndex] || quickViewProduct.thumbnail}
                alt={quickViewProduct.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
              {quickViewProduct.discountPercent && quickViewProduct.discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-[#EA580C] text-white text-xs font-extrabold px-2.5 py-1 rounded-sm shadow-xs uppercase">
                  {quickViewProduct.discountPercent}% OFF
                </span>
              )}
            </div>

            {quickViewProduct.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-[#EA580C]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Variant Picker */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="uppercase tracking-wider font-semibold text-[#EA580C]">
                  {quickViewProduct.category}
                </span>
                <span className="font-mono text-slate-400">SKU: {quickViewProduct.sku}</span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {quickViewProduct.name}
              </h2>
              {quickViewProduct.bengaliName && (
                <p className="text-sm text-slate-500 font-['Hind_Siliguri'] mt-0.5">
                  {quickViewProduct.bengaliName}
                </p>
              )}

              {/* Rating & Stock */}
              <div className="flex items-center gap-3 mt-2.5">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-xs font-bold text-slate-800">{quickViewProduct.rating}</span>
                  <span className="text-xs text-slate-400">({quickViewProduct.reviewsCount} reviews)</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="text-xs font-semibold">
                  {currentStock > 0 ? (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ In Stock ({currentStock} available)
                    </span>
                  ) : (
                    <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="mt-3.5 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-[#EA580C]">
                  {formatPrice(currentPrice)}
                </span>
                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(currentOriginalPrice)}
                  </span>
                )}
              </div>

              {/* Description preview */}
              <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {quickViewProduct.shortDescription || quickViewProduct.description}
              </p>

              {/* Variants Picker */}
              {quickViewProduct.variants && quickViewProduct.variants.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Size / Packaging:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.variants.map((variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          selectedVariant?.id === variant.id
                            ? 'border-[#EA580C] bg-orange-50 text-[#EA580C]'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {variant.name} - {formatPrice(variant.price)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-4 flex items-center gap-4">
                <label className="text-xs font-bold text-slate-700">Quantity:</label>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-white text-slate-600 transition-colors text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-800">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="px-3 py-1.5 hover:bg-white text-slate-600 transition-colors text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={currentStock <= 0}
                  onClick={handleAddToCart}
                  className="py-3 bg-[#EA580C] hover:bg-[#C2410C] disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  disabled={currentStock <= 0}
                  onClick={handleBuyNow}
                  className="py-3 bg-[#053229] hover:bg-[#084236] disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-red-500 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleViewFullDetails}
                  className="text-[#EA580C] font-semibold hover:underline"
                >
                  View Full Details →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
