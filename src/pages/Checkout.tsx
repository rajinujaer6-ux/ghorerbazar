import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
  AlertCircle,
  Tag,
  CheckCircle2,
  Lock,
  ChevronLeft
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

interface CheckoutProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {
  const {
    cart,
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
    currentUser,
    createOrder,
    settings,
    formatPrice,
    addToast
  } = useStore();

  // Form Fields
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [altPhone, setAltPhone] = useState('');
  const [city, setCity] = useState(currentUser?.addresses[0]?.city || 'Dhaka');
  const [thana, setThana] = useState(currentUser?.addresses[0]?.thana || '');
  const [address, setAddress] = useState(currentUser?.addresses[0]?.streetAddress || '');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('cod');
  const [bkashNumber, setBkashNumber] = useState('');
  const [bkashTrxId, setBkashTrxId] = useState('');
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Your shopping bag is empty</h2>
        <p className="text-xs text-slate-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-xs"
        >
          Explore Pure Harvests
        </button>
      </div>
    );
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCodeInput.trim()) {
      applyCoupon(couponCodeInput);
      setCouponCodeInput('');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      addToast('error', 'Required Field', 'Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 11) {
      addToast('error', 'Invalid Phone', 'Please provide a valid 11-digit mobile number.');
      return;
    }
    if (!address.trim()) {
      addToast('error', 'Address Missing', 'Please provide your full delivery address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = createOrder({
        customer: {
          name: fullName.trim(),
          phone: phone.trim(),
          email: currentUser?.email || `${phone}@ghorerbazar.customer`,
          address: {
            id: `addr-${Date.now()}`,
            name: fullName.trim(),
            phone: phone.trim(),
            city,
            thana: thana || 'Local Area',
            streetAddress: address.trim(),
            isDefault: true,
          },
        },
        items: [...cart],
        subtotal: cartSubtotal,
        discount: cartDiscount,
        deliveryCharge: cartDeliveryCharge,
        total: cartGrandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
        deliveryNotes: orderNotes.trim() || undefined,
      });

      setIsSubmitting(false);
      onNavigate('order-success', newOrder.orderNumber);
    }, 800);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8">
      {/* Checkout Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('cart')}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#EA580C] mb-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to cart</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Checkout & Order Confirmation
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-Bit SSL Encrypted & Protected</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Shipping & Payment (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Customer & Shipping Info */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#EA580C] text-white flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Delivery Address & Recipient</span>
                </h3>
                <span className="text-xs text-slate-400">All fields required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#EA580C] outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number (11 Digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#EA580C] outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alternative Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="018XXXXXXXX"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#EA580C] outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Division *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (e.target.value === 'Dhaka') {
                        setSelectedDeliveryArea('dhaka');
                      } else {
                        setSelectedDeliveryArea('outside');
                      }
                    }}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#EA580C] outline-hidden cursor-pointer"
                  >
                    <option value="Dhaka">Dhaka (ঢাকা)</option>
                    <option value="Chattogram">Chattogram (চট্টগ্রাম)</option>
                    <option value="Sylhet">Sylhet (সিলেট)</option>
                    <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                    <option value="Khulna">Khulna (খুলনা)</option>
                    <option value="Barishal">Barishal (বরিশাল)</option>
                    <option value="Rangpur">Rangpur (রংপুর)</option>
                    <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Area / Thana *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Uttara Sector 11, Dhanmondi 27, Mirpur 10, Agrabad..."
                    value={thana}
                    onChange={(e) => setThana(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#EA580C] outline-hidden transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Complete Street Address (House, Road, Flat) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="House #, Road #, Floor/Flat #, Landmark near delivery point"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#EA580C] outline-hidden transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Instructions / Special Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Deliver after 3 PM, Call before arriving"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#EA580C] outline-hidden transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Destination Speed Option */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#EA580C] text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Delivery Zone</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setSelectedDeliveryArea('dhaka')}
                  className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    selectedDeliveryArea === 'dhaka'
                      ? 'border-[#EA580C] bg-orange-50/40'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery_zone"
                    checked={selectedDeliveryArea === 'dhaka'}
                    onChange={() => setSelectedDeliveryArea('dhaka')}
                    className="sr-only"
                  />
                  <Truck className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-900">Inside Dhaka City</span>
                      <span className="font-extrabold text-xs text-[#EA580C]">
                        {cartSubtotal >= settings.freeDeliveryThreshold
                          ? 'FREE'
                          : formatPrice(settings.deliveryChargeDhaka)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Fast 24-hour doorstep delivery by rider
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setSelectedDeliveryArea('outside')}
                  className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    selectedDeliveryArea === 'outside'
                      ? 'border-[#EA580C] bg-orange-50/40'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery_zone"
                    checked={selectedDeliveryArea === 'outside'}
                    onChange={() => setSelectedDeliveryArea('outside')}
                    className="sr-only"
                  />
                  <Truck className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-900">All Outside Dhaka</span>
                      <span className="font-extrabold text-xs text-[#EA580C]">
                        {cartSubtotal >= settings.freeDeliveryThreshold
                          ? 'FREE'
                          : formatPrice(settings.deliveryChargeOutside)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      48-72 hours via Steadfast Express courier
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#EA580C] text-white flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>Select Payment Method</span>
                </h3>
              </div>

              <div className="space-y-3">
                {/* COD */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border-2 flex items-start gap-3.5 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#EA580C] bg-orange-50/40'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-900">
                        Cash on Delivery (ক্যাশ অন ডেলিভারি)
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      পণ্য হাতে পেয়ে পুরোপুরি চেক করে ডেলিভারি ম্যানের কাছে টাকা পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
                    </p>
                  </div>
                </label>

                {/* bKash */}
                <label
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-4 rounded-xl border-2 flex items-start gap-3.5 cursor-pointer transition-all ${
                    paymentMethod === 'bkash'
                      ? 'border-[#E2136E] bg-pink-50/40'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="w-5 h-5 rounded-md bg-[#E2136E] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    ৳
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-900">bKash Mobile Banking</span>
                      <span className="text-[10px] text-pink-700 font-semibold">Instant & Safe</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Pay directly using your bKash personal account.
                    </p>

                    {paymentMethod === 'bkash' && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-pink-200 text-xs space-y-2">
                        <p className="font-semibold text-slate-700">
                          Send Money to Ghorer Bazar Merchant: <strong>01711-223344</strong>
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Your bKash Number"
                            value={bkashNumber}
                            onChange={(e) => setBkashNumber(e.target.value)}
                            className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md"
                          />
                          <input
                            type="text"
                            placeholder="Transaction ID (TrxID)"
                            value={bkashTrxId}
                            onChange={(e) => setBkashTrxId(e.target.value)}
                            className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md uppercase"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* Nagad / Card */}
                <label
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-4 rounded-xl border-2 flex items-start gap-3.5 cursor-pointer transition-all ${
                    paymentMethod === 'nagad'
                      ? 'border-[#EA580C] bg-orange-50/40'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-xs text-slate-900">Nagad / Rocket</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pay via Nagad merchant wallet during order dispatch.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 flex items-start gap-3.5 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#EA580C] bg-orange-50/40'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-xs text-slate-900">
                      Credit / Debit Card (Visa, Mastercard, AMEX)
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Secured by SSLCommerz payment gateway.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 sticky top-24">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-semibold text-slate-500">{cart.length} items</span>
              </h3>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-contain bg-slate-50 p-1 border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Qty: {item.quantity} {item.variantName ? `• ${item.variantName}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-800 shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo code */}
              <div className="pt-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold">{appliedCoupon.code}</span> applied!
                      </div>
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
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Discount code"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Totals */}
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
                  <span>Delivery Charge</span>
                  <span className="font-bold text-slate-800">
                    {cartDeliveryCharge === 0 ? 'FREE' : formatPrice(cartDeliveryCharge)}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline text-base font-extrabold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-xl text-[#EA580C]">{formatPrice(cartGrandTotal)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#EA580C] hover:bg-[#C2410C] disabled:bg-slate-400 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                {isSubmitting ? (
                  <span>Placing Your Order...</span>
                ) : (
                  <>
                    <span>Confirm Order (অর্ডার নিশ্চিত করুন)</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Safe checkout with 100% money back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
