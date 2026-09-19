import React, { useState } from 'react';
import {
  User as UserIcon,
  KeyRound,
  Eye,
  EyeOff,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface LoginProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const {
    loginWithMobile,
    loginWithCredentials,
    register,
    switchToDemoAdmin,
    switchToDemoCustomer,
    currentUser,
    isAdmin,
    addToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Mobile OTP state
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Credentials state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // If already logged in
  if (currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">You are already logged in</h2>
        <p className="text-xs text-slate-500">
          Signed in as <strong>{currentUser.name}</strong> ({currentUser.phone || currentUser.email})
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('account')}
            className="px-5 py-2.5 bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Go to My Account
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="px-5 py-2.5 bg-[#053229] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Open Admin Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  // Handle Mobile OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 11) {
      addToast('error', 'Invalid Phone', 'Please provide a valid 11-digit mobile number.');
      return;
    }
    setOtpSent(true);
    addToast('info', 'OTP Sent', `Verification code sent to ${mobileNumber}. (Use 1234 for demo)`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginWithMobile(mobileNumber, otpCode || '1234');
    if (ok) onNavigate('account');
  };

  // Handle Credentials Login
  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginWithCredentials(identifier, password);
    if (ok) {
      if (identifier.trim().toLowerCase() === 'rajinujaer6@gmail.com') {
        onNavigate('admin');
      } else {
        onNavigate('account');
      }
    }
  };

  // Handle Register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = register(regName, regEmail, regPhone, regPassword);
    if (ok) {
      if (regEmail.trim().toLowerCase() === 'rajinujaer6@gmail.com') {
        onNavigate('admin');
      } else {
        onNavigate('account');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Top Header Card exactly matching screenshot 55 */}
      <div className="text-center space-y-3 mb-8">
        {/* Rounded orange squircle icon badge */}
        <div className="w-14 h-14 rounded-2xl bg-[#EA580C] text-white mx-auto flex items-center justify-center shadow-md">
          <div className="relative">
            <UserIcon className="w-7 h-7" />
            <KeyRound className="w-3.5 h-3.5 absolute -bottom-1 -right-1 text-amber-200" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
          {activeTab === 'signin' ? 'Signin' : 'Create Account'}
        </h1>

        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {activeTab === 'signin'
            ? 'Access your account securely'
            : 'Join Ghorer Bazar for authentic chemical-free groceries'}
        </p>

        {/* Tab switch */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 mt-2">
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'signin' ? 'bg-white text-[#EA580C] shadow-2xs' : 'text-slate-500'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'signup' ? 'bg-white text-[#EA580C] shadow-2xs' : 'text-slate-500'
            }`}
          >
            Register
          </button>
        </div>
      </div>

      {activeTab === 'signin' ? (
        /* Sign In: Dual Column with OR divider matching screenshot 55 */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-8 items-center">
            {/* Left Column: Login With Mobile Number (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Login With Mobile Number
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fast OTP verification with no password needed
                </p>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="01XXXXXXXXX"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#EA580C] outline-hidden"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Send OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-xs text-slate-700">
                    Enter the 4-digit code sent to <strong>{mobileNumber}</strong> (Demo code: <strong>1234</strong>)
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="1234"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full text-center text-sm font-mono tracking-widest py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#EA580C] outline-hidden"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Verify & Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 underline block mx-auto"
                  >
                    Change phone number
                  </button>
                </form>
              )}
            </div>

            {/* Middle Divider: OR badge (1 Col) */}
            <div className="lg:col-span-1 flex lg:flex-col items-center justify-center my-4 lg:my-0">
              <div className="h-px lg:h-24 w-full lg:w-px bg-slate-200"></div>
              <span className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-xs font-extrabold flex items-center justify-center shrink-0 my-2 lg:my-3">
                OR
              </span>
              <div className="h-px lg:h-24 w-full lg:w-px bg-slate-200"></div>
            </div>

            {/* Right Column: Login With Credentials (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Login With Credentials
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sign in with registered email or phone and password
                </p>
              </div>

              <form onSubmit={handleCredentialsLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email or Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. user@example.com or 017XXXXXXXX"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#EA580C] outline-hidden"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs pl-9 pr-10 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#EA580C] outline-hidden"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded-sm text-[#EA580C] focus:ring-[#EA580C]"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      addToast('info', 'Reset Password', 'Password recovery link has been sent.')
                    }
                    className="text-[#EA580C] hover:underline font-semibold"
                  >
                    Forgotten password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Login
                </button>
              </form>
            </div>
          </div>

          {/* Quick Demo Logins Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-slate-50/70 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-6">
            <div>
              <span className="text-slate-600 font-medium block">Quick 1-Click Demo Accounts:</span>
              <span className="text-[11px] text-slate-400 font-normal">অ্যাডমিন প্যানেল শুধুমাত্র rajinujaer6@gmail.com এর জন্য</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  switchToDemoCustomer();
                  onNavigate('account');
                }}
                className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-bold shadow-2xs transition-colors cursor-pointer"
              >
                👤 Customer
              </button>
              <button
                type="button"
                onClick={() => {
                  switchToDemoAdmin();
                  onNavigate('admin');
                }}
                className="px-3.5 py-1.5 bg-[#053229] hover:bg-[#084236] text-white rounded-lg font-bold shadow-2xs transition-colors cursor-pointer"
              >
                🛡️ Admin (rajinujaer6@gmail.com)
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Register Form */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 max-w-lg mx-auto">
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Tanvir Ahmed"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#EA580C] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number (11 Digits) *
              </label>
              <input
                type="tel"
                required
                placeholder="01XXXXXXXXX"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#EA580C] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#EA580C] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#EA580C] outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer mt-2"
            >
              Create My Account
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
