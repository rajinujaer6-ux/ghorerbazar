import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  AlertCircle,
  Truck,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CartPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryCharge,
    cartGrandTotal,
    selectedDeliveryArea,
    setSelectedDeliveryArea,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponError,
    settings,
    formatPrice
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        {/* Shopping cart empty illustration matching screenshot 54 */}
        <div className="relative w-36 h-36 mx-auto mb-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-50/70 rounded-full scale-110"></div>
          <svg
            viewBox="0 0 100 100"
            fill="none"
            className="w-28 h-28 text-[#1D77FF] relative z-10"
          >
            <path
              d="M20 28H28L36 65H78L86 38H32"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="42" cy="76" r="4.5" fill="currentColor" />
            <circle cx="72" cy="76" r="4.5" fill="currentColor" />
            <circle cx="58" cy="38" r="14" fill="currentColor" />
            <path d="M52 32L64 44M64 32L52 44" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">No items in your cart!</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
          Your shopping cart is currently empty. Explore our 100% pure Sundarban honey, mustard oil, and premium dates.
        </p>

        <button
          type="button"
          onClick={() => onNavigate('shop')}
          className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Start Shopping Pure Groceries
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#EA580C] mb-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
            Your Shopping Bag ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline font-semibold"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <span className="col-span-6">Product</span>
            <span className="col-span-2 text-center">Unit Price</span>
            <span className="col-span-2 text-center">Quantity</span>
            <span className="col-span-2 text-right">Subtotal</span>
          </div>

          <div className="divide-y divide-slate-100">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center"
              >
                {/* Product info */}
                <div className="sm:col-span-6 flex items-center gap-3 w-full">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-contain bg-slate-50 p-1.5 border border-slate-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-slate-800 truncate">{item.name}</h3>
                    {item.bengaliName && (
                      <p className="text-xs text-slate-500 font-['Hind_Siliguri']">
                        {item.bengaliName}
                      </p>
                    )}
                    {item.variantName && (
                      <span className="inline-block text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm mt-1">
                        {item.variantName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="sm:col-span-2 text-center text-xs font-bold text-slate-700">
                  <span className="sm:hidden text-slate-400 font-normal">Price: </span>
                  {formatPrice(item.price)}
                </div>

                {/* Qty */}
                <div className="sm:col-span-2 flex items-center justify-center">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-white text-slate-600 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-white text-slate-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtotal & Remove */}
                <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <span className="text-sm font-extrabold text-[#EA580C]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Delivery Destination (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Destination Selector */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Truck className="w-4 h-4 text-[#EA580C]" />
              <span>Choose Delivery Destination</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedDeliveryArea('dhaka')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedDeliveryArea === 'dhaka'
                    ? 'border-[#EA580C] bg-orange-50/50 text-[#EA580C] font-bold'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <div>Inside Dhaka</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {cartSubtotal >= settings.freeDeliveryThreshold
                    ? 'FREE'
                    : formatPrice(settings.deliveryChargeDhaka)}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDeliveryArea('outside')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedDeliveryArea === 'outside'
                    ? 'border-[#EA580C] bg-orange-50/50 text-[#EA580C] font-bold'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <div>Outside Dhaka</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {cartSubtotal >= settings.freeDeliveryThreshold
                    ? 'FREE'
                    : formatPrice(settings.deliveryChargeOutside)}
                </div>
              </button>
            </div>
          </div>

          {/* Totals & Checkout */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Coupon Box */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>
                      <strong>{appliedCoupon.code}</strong> applied!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-red-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. GHORER10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {couponError}
                </p>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">{formatPrice(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount</span>
                  <span>- {formatPrice(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="font-bold text-slate-800">
                  {cartDeliveryCharge === 0 ? 'FREE' : formatPrice(cartDeliveryCharge)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-xl text-[#EA580C]">{formatPrice(cartGrandTotal)}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={() => onNavigate('checkout')}
              className="w-full py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
