import React, { useState } from 'react';
import {
  User as UserIcon,
  Package,
  MapPin,
  Settings,
  LogOut,
  Clock,
  CheckCircle2,
  ChevronRight,
  Plus,
  Trash2,
  ArrowRight,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Address } from '../types';

interface UserAccountProps {
  initialTab?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const UserAccount: React.FC<UserAccountProps> = ({ initialTab, onNavigate }) => {
  const { currentUser, isAdmin, logout, orders, formatPrice, updateProfile, addToast } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>(
    initialTab === 'orders' ? 'orders' : 'orders'
  );

  // Profile edit fields
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [emailInput, setEmailInput] = useState(currentUser?.email || '');
  const [phoneInput, setPhoneInput] = useState(currentUser?.phone || '');

  // Add Address Modal state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Dhaka');
  const [newAddrThana, setNewAddrThana] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Please sign in to view your account</h2>
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="px-6 py-2.5 bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Filter orders belonging to this user (or show all customer orders if demo)
  const myOrders = orders.filter(
    (o) =>
      o.customer.phone === currentUser.phone ||
      o.customer.email === currentUser.email ||
      isAdmin
  );

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput,
      email: emailInput,
      phone: phoneInput,
    });
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim()) return;

    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      name: newAddrName || currentUser.name,
      phone: newAddrPhone || currentUser.phone,
      city: newAddrCity,
      thana: newAddrThana || 'Local Area',
      streetAddress: newAddrStreet,
      isDefault: currentUser.addresses.length === 0,
    };

    updateProfile({
      addresses: [...currentUser.addresses, newAddress],
    });

    setShowAddAddress(false);
    setNewAddrStreet('');
    setNewAddrThana('');
    addToast('success', 'Address Saved', 'New delivery address added.');
  };

  const handleDeleteAddress = (id: string) => {
    updateProfile({
      addresses: currentUser.addresses.filter((a) => a.id !== id),
    });
    addToast('info', 'Address Removed', 'Address deleted.');
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8">
      {/* Account Profile Header */}
      <div className="bg-gradient-to-r from-[#053229] to-[#084236] rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl font-extrabold uppercase">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold">{currentUser.name}</h1>
                <span className="text-[10px] uppercase font-bold bg-[#EA580C] text-white px-2 py-0.5 rounded-full">
                  {isAdmin ? 'admin' : 'customer'}
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-1 flex items-center gap-3">
                <span>{currentUser.phone}</span>
                {currentUser.email && <span>• {currentUser.email}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl backdrop-blur-xs transition-colors"
              >
                Open Admin Panel
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                logout();
                onNavigate('home');
              }}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Tabs Sidebar & Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav (3 Cols) */}
        <div className="lg:col-span-3 space-y-2">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-[#EA580C] text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Order History</span>
            </div>
            <span className="text-[11px] opacity-80 font-normal">({myOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'addresses'
                ? 'bg-[#EA580C] text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>Delivery Addresses</span>
            </div>
            <span className="text-[11px] opacity-80 font-normal">
              ({currentUser.addresses.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-[#EA580C] text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UserIcon className="w-4 h-4" />
              <span>Profile Settings</span>
            </div>
          </button>
        </div>

        {/* Tab Content (9 Cols) */}
        <div className="lg:col-span-9">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 mb-2">My Recent Orders</h2>

              {myOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800">No orders placed yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    When you purchase our natural products, your orders will appear here.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('shop')}
                    className="mt-4 px-5 py-2 bg-[#EA580C] text-white text-xs font-bold rounded-xl"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
                    >
                      {/* Order summary bar */}
                      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-extrabold text-slate-900 text-sm">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                              order.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-slate-500">{order.date}</span>
                          <span className="font-extrabold text-[#EA580C] text-sm">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* Items in order */}
                      <div className="p-4 sm:p-5 divide-y divide-slate-100">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="py-2.5 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-contain bg-slate-50 p-1 border border-slate-100"
                              />
                              <div>
                                <p className="font-bold text-slate-800">{item.name}</p>
                                <p className="text-[11px] text-slate-400">
                                  Qty: {item.quantity} {item.variantName && `• ${item.variantName}`}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-slate-800">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onNavigate('track-order', order.orderNumber)}
                            className="px-3.5 py-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>Live Track</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Saved Delivery Addresses</h2>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(true)}
                  className="flex items-center gap-1 px-3.5 py-1.5 bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-2xs hover:bg-[#C2410C] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {currentUser.addresses.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                  No saved delivery addresses yet. Add one for faster checkouts.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentUser.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs relative space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">{addr.name}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {addr.streetAddress}, {addr.thana}, {addr.city}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">{addr.phone}</p>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-xs text-red-600 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Address Modal */}
              {showAddAddress && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Add New Address</h3>

                    <form onSubmit={handleAddNewAddress} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Recipient Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrName}
                          onChange={(e) => setNewAddrName(e.target.value)}
                          placeholder={currentUser.name}
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={newAddrPhone}
                          onChange={(e) => setNewAddrPhone(e.target.value)}
                          placeholder={currentUser.phone}
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            City
                          </label>
                          <select
                            value={newAddrCity}
                            onChange={(e) => setNewAddrCity(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                          >
                            <option value="Dhaka">Dhaka</option>
                            <option value="Chattogram">Chattogram</option>
                            <option value="Sylhet">Sylhet</option>
                            <option value="Rajshahi">Rajshahi</option>
                            <option value="Khulna">Khulna</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Area / Thana
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Mirpur"
                            value={newAddrThana}
                            onChange={(e) => setNewAddrThana(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Street Address
                        </label>
                        <textarea
                          rows={2}
                          required
                          placeholder="House, Road, Area"
                          value={newAddrStreet}
                          onChange={(e) => setNewAddrStreet(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddAddress(false)}
                          className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2 text-xs font-bold text-white bg-[#EA580C] rounded-lg"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs max-w-xl space-y-4">
              <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                Personal Information
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
