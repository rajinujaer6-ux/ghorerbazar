import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

interface TrackOrderProps {
  initialOrderNumber?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const TrackOrder: React.FC<TrackOrderProps> = ({ initialOrderNumber, onNavigate }) => {
  const { orders, findOrder, formatPrice } = useStore();
  const [searchQuery, setSearchQuery] = useState(initialOrderNumber || '');
  const [searchedOrder, setSearchedOrder] = useState<Order | undefined>(
    initialOrderNumber ? findOrder(initialOrderNumber) : orders[0]
  );
  const [hasSearched, setHasSearched] = useState(Boolean(initialOrderNumber));

  useEffect(() => {
    if (initialOrderNumber) {
      setSearchQuery(initialOrderNumber);
      setSearchedOrder(findOrder(initialOrderNumber));
      setHasSearched(true);
    }
  }, [initialOrderNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = findOrder(searchQuery.trim());
    setSearchedOrder(found);
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Header matching screenshot 56 */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-orange-100/70 border border-orange-200 text-[#EA580C] text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse"></span>
          <span>LIVE ORDER TRACKING</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
          Track Your Order
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Real-time updates on your shipment progress
        </p>

        {/* Search Box matching screenshot 56 */}
        <div className="pt-2 max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter order number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F3F4F6] text-slate-800 placeholder-slate-400 text-sm rounded-xl px-4 py-3 border border-transparent focus:border-[#EA580C] focus:bg-white outline-hidden transition-all shadow-2xs"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Search</span>
            </button>
          </form>

          {/* Quick sample chips for testing */}
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-400">
            <span>Quick test orders:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchQuery(o.orderNumber);
                  setSearchedOrder(o);
                  setHasSearched(true);
                }}
                className="font-mono text-[#EA580C] hover:underline bg-orange-50 px-2 py-0.5 rounded-sm border border-orange-200"
              >
                {o.orderNumber}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Container */}
      {hasSearched && !searchedOrder && (
        /* Empty / Not Found state matching screenshot 56 */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-2xs">
          <div className="w-24 h-24 mx-auto mb-4 relative flex items-center justify-center">
            {/* Box package icon */}
            <div className="w-20 h-20 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C]">
              <Package className="w-10 h-10 stroke-[1.5]" />
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 mb-2">Order Not Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            We couldn't find an order with that number. Please double-check the order code on your SMS or email invoice and try again.
          </p>

          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Back to Shopping
          </button>
        </div>
      )}

      {searchedOrder && (
        /* Populated Live Tracking State */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden space-y-6">
          {/* Header Card */}
          <div className="bg-slate-50 p-6 sm:p-8 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-extrabold text-slate-900 font-mono">
                  {searchedOrder.orderNumber}
                </h2>
                <span
                  className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                    searchedOrder.status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : searchedOrder.status === 'shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {searchedOrder.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Placed on: {searchedOrder.date} • Recipient: {searchedOrder.customer.name}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400">Total Bill (Payable):</span>
              <p className="text-xl font-extrabold text-[#EA580C]">
                {formatPrice(searchedOrder.total)}
              </p>
              <span className="text-[11px] text-slate-500 font-medium capitalize">
                Payment: {searchedOrder.paymentMethod.toUpperCase()} ({searchedOrder.paymentStatus})
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="p-6 sm:p-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              Live Courier Progress
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {searchedOrder.trackingHistory.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Step node */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                      step.completed
                        ? 'bg-[#EA580C] border-[#EA580C] text-white shadow-xs'
                        : step.current
                        ? 'bg-white border-[#EA580C] text-[#EA580C] ring-4 ring-orange-100'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4
                      className={`text-sm font-bold ${
                        step.current ? 'text-[#EA580C]' : 'text-slate-800'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {step.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Courier & Shipping Meta */}
          <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                Courier Tracking Code
              </p>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-800 text-sm">
                  {searchedOrder.trackingCode || 'Pending Assignment'}
                </span>
                <span className="text-slate-400">({searchedOrder.courierName})</span>
              </div>
              <p className="text-slate-500 mt-1">
                Rider contact details will be sent via SMS before delivery.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                Destination Address
              </p>
              <p className="text-slate-800 font-semibold">
                {searchedOrder.customer.address.streetAddress}, {searchedOrder.customer.address.thana},{' '}
                {searchedOrder.customer.address.city}
              </p>
              <p className="text-slate-500 mt-1">Mobile: {searchedOrder.customer.phone}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
