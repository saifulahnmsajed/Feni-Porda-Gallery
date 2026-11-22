import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Settings as SettingsIcon, 
  Store, 
  Phone, 
  MapPin, 
  FileText, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  ShieldCheck 
} from 'lucide-react';

export default function Settings() {
  const { 
    shopSettings, 
    setShopSettings, 
    exportBackup, 
    importBackup, 
    resetToDemoData 
  } = useShop();

  const [formData, setFormData] = useState({ ...shopSettings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setShopSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      importBackup(event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-emerald-600" />
          <span>দোকানের সেটিংস ও ব্যাকআপ</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          আপনার দোকানের নাম, যোগাযোগের তথ্য, ক্যাশ মেমো ফরম্যাট ও ডেটাবেজ ম্যানেজমেন্ট
        </p>
      </div>

      {/* Store Profile Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-600" />
            <span>দোকানের প্রাথমিক তথ্য</span>
          </h3>
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>সংরক্ষণ সফল হয়েছে!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Logo Preview */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-amber-400 bg-slate-900 shadow flex-shrink-0">
              <img
                src={formData.logoUrl || `${import.meta.env.BASE_URL}logo.jpg`}
                alt="Logo Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <label className="block font-bold text-slate-700 mb-1">দোকানের লোগো ফাইল বা লিংক (Logo Path / URL)</label>
              <input
                type="text"
                value={formData.logoUrl || `${import.meta.env.BASE_URL}logo.jpg`}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
              />
              <span className="text-[10px] text-slate-400">ডিফল্ট: /logo.jpg (Feni Porda Gallery Official Logo)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">দোকানের নাম *</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">ট্যাগলাইন / উপাধি</label>
              <input
                type="text"
                value={formData.storeSubtitle}
                onChange={(e) => setFormData({ ...formData, storeSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ইমেইল (ঐচ্ছিক)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">দোকানের সম্পূর্ণ ঠিকানা *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">ক্যাশ মেমোর নিচের শর্ত / নোট (Footer Note)</label>
              <textarea
                rows="2"
                value={formData.invoiceFooter}
                onChange={(e) => setFormData({ ...formData, invoiceFooter: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors"
            >
              তথ্য সংরক্ষণ করুন (Save Settings)
            </button>
          </div>
        </form>
      </div>

      {/* Data Backup & Restore */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>ডেটা ব্যাকআপ ও রিস্টোর</span>
        </h3>
        <p className="text-xs text-slate-500">
          আপনার প্রোডাক্ট তালিকা, বিক্রয় হিসাব এবং অর্ডার ডাটা আপনার কম্পিউটারে ডাউনলোড করে ব্যাকআপ রাখুন। যেকোনো সময় পুনরায় রিস্টোর করতে পারবেন।
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Export JSON */}
          <button
            onClick={exportBackup}
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all space-y-1.5"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-slate-800">ব্যাকআপ ফাইল ডাউনলোড</h4>
            <p className="text-[10px] text-slate-500">সম্পূর্ণ ডেটা JSON ফাইলে সেভ করুন</p>
          </button>

          {/* Import JSON */}
          <label className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left transition-all space-y-1.5 cursor-pointer block">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-slate-800">ব্যাকআপ রিস্টোর করুন</h4>
            <p className="text-[10px] text-slate-500">কম্পিউটার থেকে ফাইল সিলেক্ট করুন</p>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>

          {/* Reset Demo */}
          <button
            onClick={resetToDemoData}
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-300 text-left transition-all space-y-1.5"
          >
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-slate-800">ডেমো ডেটা রিসেট</h4>
            <p className="text-[10px] text-slate-500">প্রাথমিক টেস্ট ডেটা ফিরিয়ে আনুন</p>
          </button>
        </div>
      </div>
    </div>
  );
}
