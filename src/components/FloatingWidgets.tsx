import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, X, Send, Phone, Shield } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FloatingWidgetsProps {
  onNavigate: (view: string, param?: string) => void;
}

export const FloatingWidgets: React.FC<FloatingWidgetsProps> = ({ onNavigate }) => {
  const { cartCount, cartGrandTotal, setIsCartOpen, settings, formatPrice, isAdmin } = useStore();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(chatMessage)}`;
    window.open(url, '_blank');
    setChatMessage('');
    setChatOpen(false);
  };

  return (
    <>
      {/* Floating Sticky Cart Button (Right Side, exactly matching screenshot 54, 55, 56) */}
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center bg-[#EA580C] hover:bg-[#C2410C] text-white py-3 px-3 rounded-l-xl shadow-xl transition-all cursor-pointer group"
        aria-label="View Shopping Cart"
      >
        <ShoppingBag className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
        <span className="text-[11px] font-bold tracking-tight whitespace-nowrap">
          {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
        </span>
        <span className="text-[11px] font-extrabold mt-0.5 whitespace-nowrap bg-black/15 px-1.5 py-0.5 rounded-sm">
          {formatPrice(cartGrandTotal)}
        </span>
      </button>

      {/* Floating Quick Admin Panel Shortcut for rajinujaer6@gmail.com */}
      {isAdmin && (
        <button
          type="button"
          onClick={() => onNavigate('admin')}
          className="fixed left-4 bottom-6 z-30 flex items-center gap-2 bg-[#053229] hover:bg-[#084236] text-white px-4 py-2.5 rounded-full shadow-2xl border-2 border-emerald-500/30 transition-all hover:scale-105 cursor-pointer"
          title="Open Store Admin Dashboard"
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold tracking-wide">Admin Dashboard</span>
        </button>
      )}

      {/* Floating WhatsApp/Help Bubble (Bottom Right, matching screenshot 54, 55, 56) */}
      <div className="fixed bottom-6 right-6 z-30">
        {chatOpen ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-80 overflow-hidden mb-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#EA580C] to-[#F97316] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Ghorer Bazar Support</h4>
                  <p className="text-[11px] text-orange-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online now
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 bg-slate-50 text-xs text-slate-700 space-y-3">
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                <p className="font-semibold text-slate-800 mb-1">
                  আসসালামু আলাইকুম! কেমন আছেন?
                </p>
                <p className="text-slate-600">
                  খাটি প্রাকৃতিক মধু, ঘানিভাঙা তেল বা অর্ডার সংক্রান্ত যেকোনো সহায়তার জন্য সরাসরি আমাদের মেসেজ দিন বা কল করুন।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold text-[11px] hover:bg-slate-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#EA580C]" />
                  Call: {settings.contactPhone}
                </a>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendWhatsApp} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 text-xs px-3 py-2 bg-slate-100 rounded-lg border-0 focus:ring-1 focus:ring-[#EA580C] outline-hidden"
              />
              <button
                type="submit"
                className="p-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg transition-colors cursor-pointer"
                title="Send via WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="w-13 h-13 rounded-full bg-[#EA580C] hover:bg-[#C2410C] text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all cursor-pointer"
            aria-label="Contact Customer Support"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}
      </div>
    </>
  );
};
