import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import Navbar from './components/Navbar';
import Storefront from './components/Storefront';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Orders from './components/Orders';
import Reports from './components/Reports';
import Settings from './components/Settings';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ReceiptModal from './components/ReceiptModal';
import AuthModal from './components/AuthModal';
import { Phone, MapPin, Mail, Clock, ShieldCheck } from 'lucide-react';

function AdminLock() {
  const { openAuthModal, setActiveTab } = useShop();

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
      <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-inner">
        🔒
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-900">শুধুমাত্র এডমিন প্যানেলের জন্য</h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          ইনভেন্টরি ম্যানেজমেন্ট, স্টক ট্র্যাকিং, পিওএস ক্যাশ কাউন্টার ও লাভ-ক্ষতির হিসাব শুধুমাত্র দোকান মালিক ও ম্যানেজারের জন্য সংরক্ষিত।
        </p>
      </div>

      <div className="pt-2 space-y-2 text-xs">
        <button
          onClick={() => openAuthModal('signin')}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>এডমিন হিসেবে সাইন ইন করুন (Admin Login)</span>
        </button>
        <button
          onClick={() => setActiveTab('storefront')}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
        >
          কাস্টমার প্রোডাক্ট স্টোরে ফিরে যান
        </button>
      </div>
    </div>
  );
}

function MainApp() {
  const { activeTab, shopSettings, isAdmin, openAuthModal } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content View Switcher with Admin Gate */}
      <main className="flex-1">
        {activeTab === 'storefront' && <Storefront />}
        {activeTab === 'orders' && <Orders />}
        {['pos', 'inventory', 'reports', 'settings'].includes(activeTab) && (
          isAdmin ? (
            <>
              {activeTab === 'pos' && <POS />}
              {activeTab === 'inventory' && <Inventory />}
              {activeTab === 'reports' && <Reports />}
              {activeTab === 'settings' && <Settings />}
            </>
          ) : (
            <AdminLock />
          )
        )}
      </main>

      {/* Modals & Overlays */}
      <CartDrawer />
      <CheckoutModal />
      <ReceiptModal />
      <AuthModal />

      {/* Footer with Helpline & Showroom Address (Bottom) */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-10 pb-6 text-xs no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8 border-b border-slate-800">
            {/* Col 1: Brand & Logo */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-400/50 bg-slate-950 flex-shrink-0">
                  <img
                    src={shopSettings.logoUrl || `${import.meta.env.BASE_URL}logo.jpg`}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base leading-tight">
                    {shopSettings.storeName}
                  </h3>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    Feni Porda Gallery
                  </span>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {shopSettings.storeSubtitle}
              </p>
            </div>

            {/* Col 2: Helpline Contact */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>যোগাযোগ ও হেল্পলাইন</span>
              </h4>
              {shopSettings.proprietor && (
                <p className="text-amber-300 font-bold text-xs">
                  {shopSettings.proprietor}
                </p>
              )}
              <p className="text-emerald-400 font-extrabold text-sm sm:text-base">
                <a href={`tel:${shopSettings.phone}`} className="hover:underline">
                  {shopSettings.phone}
                </a>
              </p>
              <p className="text-slate-400 text-xs flex items-center gap-1.5 pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>সকাল ৯:০০ টা - রাত ১০:০০ টা (প্রতিদিন)</span>
              </p>
              {shopSettings.email && (
                <p className="text-slate-400 text-xs flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{shopSettings.email}</span>
                </p>
              )}
            </div>

            {/* Col 3: Address & Showroom */}
            <div className="space-y-2 md:col-span-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>শোরুম ও দোকানের ঠিকানা</span>
              </h4>
              <p className="text-slate-300 font-medium leading-relaxed">
                {shopSettings.address}
              </p>
              <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg mt-1">
                <span>📍 শোরুমে এসে দেখে কেনার সুবিধা</span>
              </div>
            </div>

            {/* Col 4: Service Guarantee */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>আমাদের সেবাসমূহ</span>
              </h4>
              <ul className="text-slate-400 text-xs space-y-1">
                <li>• ১০০% অরিজিনাল পর্দা ও ফোম গ্যারান্টি</li>
                <li>• সারা দেশে ক্যাশ অন ডেলিভারি</li>
                <li>• ৩ দিনের মধ্যে মেমোসহ পরিবর্তনযোগ্য</li>
                <li>• পাইকারি ও খুচরা বিক্রয়</li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs">
            <p>
              © {new Date().getFullYear()} {shopSettings.storeName} — সর্বস্বত্ব সংরক্ষিত।
            </p>
            <div className="flex items-center gap-3">
              <span>পর্দা • ফোম • বালিশ • সোফা কভার • থান কাপড়</span>
              <span>•</span>
              <span className="font-mono text-emerald-500 font-bold">Dokan+ POS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <MainApp />
    </ShopProvider>
  );
}
