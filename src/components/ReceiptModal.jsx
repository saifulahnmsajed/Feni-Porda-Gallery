import React from 'react';
import { useShop } from '../context/ShopContext';
import { Printer, X, CheckCircle, Download } from 'lucide-react';

export default function ReceiptModal() {
  const { activeReceipt, setActiveReceipt, shopSettings } = useShop();

  if (!activeReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(activeReceipt.date || Date.now()).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      {/* Outer Card */}
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Controls (No print) */}
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold">বিক্রি সফল হয়েছে! ক্যাশ মেমো প্রস্তুত</span>
          </div>
          <button
            onClick={() => setActiveReceipt(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-receipt" className="p-6 overflow-y-auto font-sans text-slate-800 text-xs space-y-4 bg-white">
          {/* Shop Header */}
          <div className="text-center space-y-1.5 pb-3 border-b-2 border-slate-900">
            <div className="flex items-center justify-center gap-3">
              <img
                src={shopSettings.logoUrl || `${import.meta.env.BASE_URL}logo.jpg`}
                alt="Logo"
                className="w-12 h-12 rounded-lg object-cover border border-slate-400 shadow-sm"
              />
              <div className="text-left">
                <h2 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                  {shopSettings.storeName}
                </h2>
                <p className="text-[10px] font-semibold text-slate-600">
                  {shopSettings.storeSubtitle}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500">
              {shopSettings.address}
            </p>
            <p className="text-[10px] text-slate-700 font-bold">
              মোবাইল: {shopSettings.phone}
            </p>
            <div className="inline-block mt-1 px-3 py-0.5 border border-slate-900 rounded font-black text-[11px] uppercase tracking-wider">
              ক্যাশ মেমো / ইনভয়েস
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pb-2 border-b border-dashed border-slate-300">
            <div>
              <p><span className="text-slate-500">মেমো নং:</span> <strong className="font-mono">{activeReceipt.id}</strong></p>
              <p><span className="text-slate-500">গ্রাহক:</span> <strong>{activeReceipt.customerName || 'সাধারণ গ্রাহক'}</strong></p>
            </div>
            <div className="text-right">
              <p><span className="text-slate-500">তারিখ:</span> {formattedDate}</p>
              <p><span className="text-slate-500">মোবাইল:</span> <strong>{activeReceipt.customerPhone || '-'}</strong></p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-400 text-[10px] font-bold text-slate-700">
                <th className="py-1 text-left">আইটেম</th>
                <th className="py-1 text-center">পরিমাণ</th>
                <th className="py-1 text-right">দর (৳)</th>
                <th className="py-1 text-right">মোট (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {activeReceipt.items.map((item, idx) => (
                <tr key={idx} className="py-1">
                  <td className="py-1.5 font-medium">{item.name}</td>
                  <td className="py-1.5 text-center">{item.quantity} {item.unit || ''}</td>
                  <td className="py-1.5 text-right font-mono">৳{item.price}</td>
                  <td className="py-1.5 text-right font-mono font-bold">৳{item.total || item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Section */}
          <div className="pt-2 border-t-2 border-slate-900 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">সাবটোটাল:</span>
              <span className="font-mono font-semibold">৳ {activeReceipt.subtotal}</span>
            </div>

            {activeReceipt.discount > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>বিশেষ ছাড় (Discount):</span>
                <span className="font-mono font-bold">-৳ {activeReceipt.discount}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-1">
              <span>মোট প্রদেয় বিল:</span>
              <span className="font-mono font-black">৳ {activeReceipt.total}</span>
            </div>

            <div className="flex justify-between text-slate-600 pt-1 border-t border-dashed border-slate-200">
              <span>পেমেন্ট মাধ্যম:</span>
              <span className="font-bold text-slate-800">{activeReceipt.paymentMethod || 'Cash'}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>গৃহীত টাকা:</span>
              <span className="font-mono font-semibold">৳ {activeReceipt.paidAmount || activeReceipt.total}</span>
            </div>

            {activeReceipt.change > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>ফেরত দেওয়া হয়েছে:</span>
                <span className="font-mono font-bold text-emerald-700">৳ {activeReceipt.change}</span>
              </div>
            )}

            {activeReceipt.due > 0 && (
              <div className="flex justify-between text-red-600 font-bold">
                <span>বাকি (Due):</span>
                <span className="font-mono">৳ {activeReceipt.due}</span>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center pt-4 border-t border-dashed border-slate-300 space-y-1">
            <p className="text-[10px] text-slate-600 font-medium">
              {shopSettings.invoiceFooter}
            </p>
            <p className="text-[9px] text-slate-400">
              Software by Dokan+ POS • দোকান ম্যানেজমেন্ট সিস্টেম
            </p>
          </div>
        </div>

        {/* Action Buttons (No print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2 no-print">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন (Print Memo)</span>
          </button>
          <button
            onClick={() => setActiveReceipt(null)}
            className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs sm:text-sm"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
