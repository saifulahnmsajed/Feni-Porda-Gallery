import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/initialData';
import { 
  Store, 
  ShoppingBag, 
  Layers, 
  ClipboardList, 
  BarChart3, 
  Settings, 
  ShoppingCart, 
  AlertTriangle,
  Sparkles,
  User,
  LogIn,
  LogOut,
  Shield,
  ChevronDown,
  Search,
  X
} from 'lucide-react';

export default function Navbar() {
  const { 
    activeTab, 
    setActiveTab, 
    cartTotalCount, 
    setIsCartOpen, 
    lowStockCount, 
    pendingOrdersCount,
    shopSettings,
    currentUser,
    openAuthModal,
    logout,
    isAdmin,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory
  } = useShop();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Separate Navigation for Admin vs Customer
  const navItems = isAdmin
    ? [
        { id: 'storefront', label: 'শপ ভিউ', icon: Store, badge: null },
        { id: 'pos', label: 'পিওএস কাউন্টার', icon: ShoppingBag, badge: null, highlight: true },
        { id: 'inventory', label: 'ইনভেন্টরি ও স্টক', icon: Layers, badge: lowStockCount > 0 ? lowStockCount : null, badgeColor: 'bg-amber-500' },
        { id: 'orders', label: 'অর্ডারসমূহ', icon: ClipboardList, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null, badgeColor: 'bg-emerald-500' },
        { id: 'reports', label: 'হিসাব ও রিপোর্ট', icon: BarChart3, badge: null },
        { id: 'settings', label: 'সেটিংস', icon: Settings, badge: null },
      ]
    : [
        ...(currentUser ? [{ id: 'orders', label: 'আমার অর্ডারসমূহ', icon: ClipboardList, badge: null }] : []),
      ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Store Name */}
          <div 
            onClick={() => setActiveTab('storefront')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-500/40 shadow-md group-hover:scale-105 transition-transform bg-slate-900 flex-shrink-0">
              <img
                src={shopSettings.logoUrl || "/logo.jpg"}
                alt="Feni Porda Gallery Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                  ফেনী পর্দা গ্যালারী
                </h1>
                {isAdmin && (
                  <span className="bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    👑 এডমিন প্যানেল
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 hidden lg:block">
                Feni Porda Gallery • পর্দা • ফোম • বালিশ • কভার
              </p>
            </div>
          </div>

          {/* Top Search Bar (Desktop) */}
          <div className="flex-1 min-w-[180px] max-w-sm lg:max-w-md mx-2 sm:mx-4 hidden sm:block">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'storefront') setActiveTab('storefront');
                }}
                placeholder="পর্দা, ফোম, বালিশ, কভার খুঁজুন..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 hover:bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs (Only when items exist, e.g. Admin or Logged-in Customer) */}
          {navItems.length > 0 && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    } ${item.highlight && !isActive ? 'text-emerald-700 font-bold' : ''}`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    
                    {item.badge !== null && (
                      <span className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold rounded-full text-white ${item.badgeColor || 'bg-emerald-600'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action: Customer Cart Trigger & User Auth */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 sm:gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-2 rounded-xl border border-emerald-200/80 transition-colors shadow-sm"
              title="কাস্টমার কার্ট দেখুন"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              <span className="hidden sm:inline text-xs font-bold">কার্ট</span>
              {cartTotalCount > 0 && (
                <span className="flex items-center justify-center min-w-[18px] h-4 sm:h-5 px-1.5 bg-emerald-600 text-white rounded-full text-[10px] sm:text-xs font-bold shadow-sm">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* User Auth Section */}
            {!currentUser ? (
              <button
                onClick={() => openAuthModal('signin')}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md shadow-slate-900/20 transition-all hover:scale-[1.02]"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">সাইন ইন / সাইন আপ</span>
                <span className="sm:hidden">লগইন</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate-800 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 transition-all text-xs font-bold"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black shadow-sm">
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="line-clamp-1 leading-tight text-slate-900 max-w-[85px]">{currentUser.name}</p>
                    <span className="text-[10px] text-emerald-700 font-extrabold block">
                      {currentUser.role === 'admin' ? 'ম্যানেজার 👑' : 'কাস্টমার 👤'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1 animate-fadeIn">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-1">
                      <p className="font-extrabold text-slate-900 line-clamp-1">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{currentUser.phone}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {currentUser.role === 'admin' ? 'ম্যানেজার / ক্যাশিয়ার' : 'কাস্টমার অ্যাকাউন্ট'}
                      </span>
                    </div>

                    <button
                      onClick={() => { setActiveTab('orders'); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-semibold"
                    >
                      <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
                      <span>আমার অর্ডার ট্র্যাকিং</span>
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => { setActiveTab('pos'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-emerald-800 font-bold"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ক্যাশ কাউন্টার (POS)</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => { logout(); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 font-bold flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>লগআউট করুন (Sign Out)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="sm:hidden pb-2.5 pt-1">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'storefront') setActiveTab('storefront');
              }}
              placeholder="পর্দা, ফোম, বালিশ, কভার খুঁজুন..."
              className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row (Only when items exist) */}
        {navItems.length > 0 && (
          <div className="flex md:hidden overflow-x-auto pb-2 gap-1 scrollbar-none border-t border-slate-100 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span className="bg-red-500 text-white text-[10px] px-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
