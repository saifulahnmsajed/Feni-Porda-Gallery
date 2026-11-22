import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Wallet, 
  Receipt, 
  AlertTriangle, 
  ArrowUpRight, 
  Printer,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react';

export default function Reports() {
  const { sales, products, setActiveReceipt, setActiveTab } = useShop();

  const [dateFilter, setDateFilter] = useState("all"); // 'today' | 'week' | 'month' | 'all'

  // Filter sales based on date
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekStart = todayStart - 7 * 86400000;
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  const filteredSales = sales.filter((s) => {
    const saleTime = new Date(s.date).getTime();
    if (dateFilter === "today") return saleTime >= todayStart;
    if (dateFilter === "week") return saleTime >= weekStart;
    if (dateFilter === "month") return saleTime >= monthStart;
    return true;
  });

  // Analytics Calculations
  const totalSalesCount = filteredSales.length;
  const totalRevenue = filteredSales.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
  const totalProfit = filteredSales.reduce((sum, s) => sum + (Number(s.profit) || 0), 0);
  const totalDiscount = filteredSales.reduce((sum, s) => sum + (Number(s.discount) || 0), 0);

  // Today specific
  const todaySalesTotal = sales
    .filter(s => new Date(s.date).getTime() >= todayStart)
    .reduce((sum, s) => sum + (Number(s.total) || 0), 0);

  // Payment Breakdown
  const paymentBreakdown = filteredSales.reduce((acc, s) => {
    const method = s.paymentMethod || 'Cash';
    acc[method] = (acc[method] || 0) + (Number(s.total) || 0);
    return acc;
  }, {});

  // Top selling products
  const productSalesMap = {};
  filteredSales.forEach(s => {
    s.items.forEach(item => {
      productSalesMap[item.name] = (productSalesMap[item.name] || 0) + item.quantity;
    });
  });

  const topProducts = Object.entries(productSalesMap)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Date Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <span>বিক্রয়, লাভ ও ক্যাশ রিপোর্ট</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            দোকানের দৈনিক ও মাসিক বিক্রয়, অর্জিত নিট মুনাফা এবং পেমেন্ট হিসাব
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {[
            { id: 'today', label: 'আজকের হিসাব' },
            { id: 'week', label: 'গত ৭ দিন' },
            { id: 'month', label: 'চলতি মাস' },
            { id: 'all', label: 'সর্বমোট রেকর্ড' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDateFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dateFilter === tab.id
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">মোট বিক্রি (Revenue)</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">৳</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            ৳ {totalRevenue.toLocaleString('bn-BD')}
          </h3>
          <p className="text-[11px] text-slate-400">মোট {totalSalesCount} টি বিক্রয় ট্রানজেকশন</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-5 rounded-3xl shadow-lg shadow-emerald-900/20 space-y-2">
          <div className="flex items-center justify-between text-emerald-200">
            <span className="text-xs font-bold">অর্জিত মুনাফা / লাভ (Profit)</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            ৳ {totalProfit.toLocaleString('bn-BD')}
          </h3>
          <p className="text-[11px] text-emerald-200">
            বিক্রয়মূল্য থেকে ক্রয়মূল্য বাদ দিয়ে নিট লাভ
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">আজকের বিক্রি (Today)</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            ৳ {todaySalesTotal.toLocaleString('bn-BD')}
          </h3>
          <p className="text-[11px] text-slate-400">আজকে কাউন্টার ক্যাশ ও অর্ডার</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">মোট ছাড় দেওয়া হয়েছে</span>
            <Wallet className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-800">
            ৳ {totalDiscount.toLocaleString('bn-BD')}
          </h3>
          <p className="text-[11px] text-slate-400">কাস্টমারকে ডিসকাউন্ট বাবদ</p>
        </div>
      </div>

      {/* Payment Channels & Top Products Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Channels Breakdown */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>পেমেন্ট মাধ্যম অনুযায়ী মোট আদায়</span>
          </h3>

          <div className="space-y-3 pt-1">
            {Object.keys(paymentBreakdown).length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">কোন রেকর্ড নেই</p>
            ) : (
              Object.entries(paymentBreakdown).map(([method, amount]) => {
                const percent = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
                return (
                  <div key={method} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">{method}</span>
                      <span className="text-slate-900">৳ {amount.toLocaleString('bn-BD')} ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>সর্বাধিক বিক্রীত পণ্য (Top Selling)</span>
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {topProducts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">কোন বিক্রয় রেকর্ড নেই</p>
            ) : (
              topProducts.map((p, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 font-black flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-slate-800">{p.name}</span>
                  </div>
                  <span className="font-extrabold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-xl">
                    {p.qty} টি বিক্রি
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Sales History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-800 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            <span>সাম্প্রতিক বিক্রয় রশিদ ও লেনদেন ইতিহাস ({filteredSales.length})</span>
          </h3>
          <button
            onClick={() => setActiveTab('pos')}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
          >
            + নতুন বিক্রি (POS)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">মেমো আইডি</th>
                <th className="py-3 px-3">তারিখ ও সময়</th>
                <th className="py-3 px-3">গ্রাহক</th>
                <th className="py-3 px-3">আইটেম সংখ্যা</th>
                <th className="py-3 px-3 text-right">ডিসকাউন্ট</th>
                <th className="py-3 px-3 text-right">মোট বিল (৳)</th>
                <th className="py-3 px-3 text-right font-bold text-emerald-800">অর্জিত লাভ (৳)</th>
                <th className="py-3 px-3 text-center">পেমেন্ট</th>
                <th className="py-3 px-4 text-center">মেমো</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    কোন বিক্রয় রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => {
                  const formattedDate = new Date(sale.date).toLocaleDateString('bn-BD', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {sale.id}
                      </td>
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {sale.customerName || 'সাধারণ গ্রাহক'}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {sale.items.length} টি আইটেম
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        ৳{sale.discount || 0}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-black text-slate-900">
                        ৳{sale.total}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                        +৳{sale.profit || 0}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                          {sale.paymentMethod || 'Cash'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setActiveReceipt(sale)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 text-[11px] flex items-center gap-1 mx-auto"
                        >
                          <Printer className="w-3 h-3" />
                          <span>মেমো</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
