import React, { useState } from 'react';
import {
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  CheckCircle2,
  AlertCircle,
  Truck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  onNavigate: (view: string, param?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
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

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const success = applyCoupon(couponInput);
      if (success) setCouponInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    onNavigate('checkout');
  };

  const handleViewCartPage = () => {
    setIsCartOpen(false);
    onNavigate('cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Header matching screenshot 54 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold tracking-tight text-slate-900 uppercase font-['Plus_Jakarta_Sans']">
              SHOPPING CART
            </h2>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-[#EA580C] transition-colors cursor-pointer"
            >
              <span>Close</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              /* Exact reproduction of Empty Cart in Screenshot 54 */
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="relative w-36 h-36 mb-4 flex items-center justify-center">
                  {/* Subtle soft circular background */}
                  <div className="absolute inset-0 bg-blue-50/70 rounded-full scale-110"></div>
                  
                  {/* Blue shopping cart SVG with circular cross badge */}
                  <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-28 h-28 text-[#1D77FF] relative z-10"
                  >
                    {/* Shopping cart outline */}
                    <path
                      d="M20 28H28L36 65H78L86 38H32"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Cart wheels */}
                    <circle cx="42" cy="76" r="4.5" fill="currentColor" />
                    <circle cx="72" cy="76" r="4.5" fill="currentColor" />
                    
                    {/* Circular blue cross (X) badge */}
                    <circle cx="58" cy="38" r="14" fill="currentColor" />
                    <path
                      d="M52 32L64 44M64 32L52 44"
                      stroke="white"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <p className="text-lg font-bold text-slate-800 mb-2">
                  No items in your cart!
                </p>
                <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">
                  Browse our natural honey, premium ghee, and fresh organic harvest to begin your healthy journey.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('shop');
                  }}
                  className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Items list */}
                <div className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div key={item.id} className="py-4 flex gap-3.5 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">
                          {item.name}
                        </h4>
                        {item.variantName && (
                          <span className="inline-block text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm mt-0.5">
                            {item.variantName}
                          </span>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-[#EA580C]">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 hover:bg-white text-slate-600 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-bold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-white text-slate-600 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-xs font-semibold text-slate-600">
                            Total: {formatPrice(item.price * item.quantity)}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Area Selection */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Truck className="w-4 h-4 text-[#EA580C]" />
                    <span>Choose Delivery Destination</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label
                      className={`flex flex-col p-2 rounded-lg border cursor-pointer transition-all ${
                        selectedDeliveryArea === 'dhaka'
                          ? 'border-[#EA580C] bg-orange-50/50 text-[#EA580C] font-bold'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery_location"
                        className="sr-only"
                        checked={selectedDeliveryArea === 'dhaka'}
                        onChange={() => setSelectedDeliveryArea('dhaka')}
                      />
                      <span>Inside Dhaka</span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {cartSubtotal >= settings.freeDeliveryThreshold
                          ? 'FREE'
                          : formatPrice(settings.deliveryChargeDhaka)}
                      </span>
                    </label>

                    <label
                      className={`flex flex-col p-2 rounded-lg border cursor-pointer transition-all ${
                        selectedDeliveryArea === 'outside'
                          ? 'border-[#EA580C] bg-orange-50/50 text-[#EA580C] font-bold'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery_location"
                        className="sr-only"
                        checked={selectedDeliveryArea === 'outside'}
                        onChange={() => setSelectedDeliveryArea('outside')}
                      />
                      <span>Outside Dhaka</span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {cartSubtotal >= settings.freeDeliveryThreshold
                          ? 'FREE'
                          : formatPrice(settings.deliveryChargeOutside)}
                      </span>
                    </label>
                  </div>
                  {cartSubtotal < settings.freeDeliveryThreshold && (
                    <p className="text-[11px] text-emerald-700 font-medium pt-1">
                      💡 Add {formatPrice(settings.freeDeliveryThreshold - cartSubtotal)} more to get{' '}
                      <strong>FREE Delivery</strong>!
                    </p>
                  )}
                </div>

                {/* Promo Code Input */}
                <div className="pt-2">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="font-bold">{appliedCoupon.code}</span> applied (
                          {appliedCoupon.type === 'percent'
                            ? `${appliedCoupon.value}% OFF`
                            : `${formatPrice(appliedCoupon.value)} OFF`}
                          )
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-red-600 hover:underline font-semibold"
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
                        className="flex-1 text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#EA580C] uppercase"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors cursor-pointer"
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
              </div>
            )}
          </div>

          {/* Footer Total & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>- {formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-slate-800">
                    {cartDeliveryCharge === 0 ? 'FREE' : formatPrice(cartDeliveryCharge)}
                  </span>
                </div>
                <div className="border-t border-slate-200 my-2 pt-2 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-[#EA580C]">{formatPrice(cartGrandTotal)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleProceedCheckout}
                  className="w-full py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={handleViewCartPage}
                  className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  View Full Cart & Items
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
