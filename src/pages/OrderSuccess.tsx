import React from 'react';
import {
  CheckCircle2,
  PackageCheck,
  Printer,
  ShoppingBag,
  ArrowRight,
  Phone,
  Truck,
  MapPin
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface OrderSuccessProps {
  orderNumber?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const OrderSuccess: React.FC<OrderSuccessProps> = ({ orderNumber, onNavigate }) => {
  const { orders, findOrder, formatPrice, settings } = useStore();

  const currentOrder = orderNumber ? findOrder(orderNumber) : orders[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print:border-none print:shadow-none">
        {/* Banner */}
        <div className="bg-gradient-to-br from-[#053229] to-[#04241E] text-white p-8 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4 border border-emerald-400/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
            Order has been placed and registered. Our customer support will contact you for verification shortly.
          </p>
          {currentOrder && (
            <div className="mt-4 inline-block bg-white/10 backdrop-blur-xs px-4 py-1.5 rounded-full border border-white/20">
              <span className="text-xs text-orange-200">Order Reference: </span>
              <span className="text-sm font-extrabold text-white font-mono">
                {currentOrder.orderNumber}
              </span>
            </div>
          )}
        </div>

        {/* Order Details Body */}
        {currentOrder ? (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Delivery Alert */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3.5">
              <Truck className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  Estimated Delivery: 24 - 48 Hours
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Your pure food items are being carefully packed at our Tejgaon organic hub. We will deliver straight to your door.
                </p>
              </div>
            </div>

            {/* Recipient & Courier Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                  Recipient Information
                </p>
                <p className="font-bold text-slate-800 text-sm">{currentOrder.customer.name}</p>
                <p className="text-slate-600 mt-0.5">{currentOrder.customer.phone}</p>
                <p className="text-slate-600 mt-1 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    {currentOrder.customer.address.streetAddress}, {currentOrder.customer.address.thana},{' '}
                    {currentOrder.customer.address.city}
                  </span>
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                  Payment & Delivery Details
                </p>
                <p className="font-semibold text-slate-800">
                  Method:{' '}
                  <span className="uppercase text-[#EA580C] font-bold">
                    {currentOrder.paymentMethod}
                  </span>
                </p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  Payment Status:{' '}
                  <span className="capitalize font-bold text-emerald-700">
                    {currentOrder.paymentStatus}
                  </span>
                </p>
                <p className="text-slate-500 mt-1">
                  Courier Partner: {currentOrder.courierName || 'Steadfast Courier'}
                </p>
              </div>
            </div>

            {/* Items Summary Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Items In This Order
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {currentOrder.items.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-contain bg-slate-50 p-1 border border-slate-100"
                      />
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {item.variantName || 'Standard'} • Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-800">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Totals */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">{formatPrice(currentOrder.subtotal)}</span>
              </div>
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>- {formatPrice(currentOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-slate-800">
                  {currentOrder.deliveryCharge === 0 ? 'FREE' : formatPrice(currentOrder.deliveryCharge)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Amount Payable</span>
                <span className="text-[#EA580C]">{formatPrice(currentOrder.total)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 print:hidden">
              <button
                type="button"
                onClick={() => onNavigate('track-order', currentOrder.orderNumber)}
                className="w-full sm:flex-1 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Track Order Live</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full sm:w-auto px-5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('shop')}
                className="w-full sm:w-auto px-5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Back to Shop</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            No order details found.
          </div>
        )}
      </div>
    </div>
  );
};
