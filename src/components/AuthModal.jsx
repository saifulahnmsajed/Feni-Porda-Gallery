import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Lock, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    openAuthModal, 
    login, 
    signup, 
    shopSettings 
  } = useShop();

  // Tab: 'signin' | 'signup'
  const [activeTab, setActiveTab] = useState(authModalTab || 'signin');

  // Sign In state
  const [signInId, setSignInId] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signInError, setSignInError] = useState('');

  // Sign Up state
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    role: 'customer'
  });
  const [signUpError, setSignUpError] = useState('');

  if (!isAuthModalOpen) return null;

  // Handle Sign In Submit
  const handleSignIn = (e) => {
    e.preventDefault();
    setSignInError('');
    if (!signInId.trim() || !signInPassword) {
      setSignInError('মোবাইল/ইমেইল এবং পাসওয়ার্ড উভয়ই লিখুন!');
      return;
    }

    const res = login(signInId, signInPassword);
    if (!res.success) {
      setSignInError(res.message);
    }
  };

  // Handle Quick Demo Login
  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      login('01789123456', 'admin');
    } else {
      login('01711223344', '123');
    }
  };

  // Handle Sign Up Submit
  const handleSignUp = (e) => {
    e.preventDefault();
    setSignUpError('');
    if (!signUpForm.name.trim() || !signUpForm.phone.trim() || !signUpForm.password) {
      setSignUpError('নাম, মোবাইল নম্বর এবং পাসওয়ার্ড পূরণ করা আবশ্যক!');
      return;
    }

    const res = signup(signUpForm);
    if (!res.success) {
      setSignUpError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-400/50 bg-slate-900 flex-shrink-0">
              <img
                src={shopSettings.logoUrl || "/logo.jpg"}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                ফেনী পর্দা গ্যালারী
              </h3>
              <p className="text-[11px] text-emerald-300">
                {activeTab === 'signin' ? 'অ্যাকাউন্টে সাইন ইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1">
          <button
            onClick={() => { setActiveTab('signin'); setSignInError(''); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'signin'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>সাইন ইন (Sign In)</span>
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setSignUpError(''); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'signup'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>সাইন আপ (Sign Up)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              {signInError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{signInError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  মোবাইল নম্বর অথবা ইমেইল *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: 01789123456 বা ইমেইল"
                    value={signInId}
                    onChange={(e) => setSignInId(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  পাসওয়ার্ড *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="আপনার গোপন পাসওয়ার্ড"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-600/30 text-sm flex items-center justify-center gap-2 transition-all mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>লগইন করুন</span>
              </button>

              {/* Quick Demo Login Helper Box */}
              <div className="pt-4 mt-2 border-t border-slate-100">
                <span className="block text-[11px] font-bold text-slate-500 mb-2 text-center">
                  ⚡ দ্রুত টেস্ট লগইন করুন (১ ক্লিকে):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin')}
                    className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>ম্যানেজার (Admin)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">সব কন্ট্রোল ও পিওএস</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('customer')}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                      <User className="w-3.5 h-3.5 text-slate-600" />
                      <span>কাস্টমার (Client)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">অর্ডার ও শপিং</p>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-3.5 text-xs max-h-[70vh] overflow-y-auto">
              {signUpError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{signUpError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  আপনার সম্পূর্ণ নাম *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                    value={signUpForm.name}
                    onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  মোবাইল নম্বর * (সচল নম্বর)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 017XXXXXXXX"
                    value={signUpForm.phone}
                    onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ইমেইল ঠিকানা (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  গোপন পাসওয়ার্ড *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="কমপক্ষে ৪-৬ সংখ্যার পাসওয়ার্ড"
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ঠিকানা (ডেলিভারির জন্য ঐচ্ছিক)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <textarea
                    rows="2"
                    placeholder="বাসা/রোড, এলাকা ও জেলা"
                    value={signUpForm.address}
                    onChange={(e) => setSignUpForm({ ...signUpForm, address: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200/80 text-emerald-900 text-[11px] font-medium flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>নতুন কাস্টমার অ্যাকাউন্ট (পণ্য দেখা ও সহজেই অর্ডার করার জন্য)</span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-600/30 text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>অ্যাকাউন্ট তৈরি সম্পন্ন করুন</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
