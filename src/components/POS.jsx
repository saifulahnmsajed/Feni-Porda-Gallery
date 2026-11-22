import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/initialData';
import { 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  Receipt, 
  User, 
  Phone, 
  Percent, 
  CreditCard, 
  DollarSign, 
  RotateCcw,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export default function POS() {
  const { 
    products, 
    posCart, 
    addToPosCart, 
    updatePosQty, 
    removeFromPosCart, 
    clearPosCart,
    completePosSale,
    shopSettings 
  } = useShop();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("সব (All)");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [saleNotes, setSaleNotes] = useState("");

  // Product filtering
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "সব (All)" || p.category.includes(selectedCategory.split(" ")[0]);
      const matchesSearch =
        (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.banglaName && p.banglaName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // POS Cart Calculations
  const subtotal = posCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountVal = Math.min(Number(discount) || 0, subtotal);
  const netTotal = Math.max(0, subtotal - discountVal);
  const receivedVal = Number(receivedAmount) || (receivedAmount === "" ? netTotal : 0);
  const changeVal = receivedVal >= netTotal ? receivedVal - netTotal : 0;
  const dueVal = receivedVal < netTotal ? netTotal - receivedVal : 0;

  // Complete POS Sale
  const handleCompleteSale = () => {
    if (posCart.length === 0) {
      alert("বিল কাটার জন্য প্রথমে প্রোডাক্ট যোগ করুন!");
      return;
    }

    const saleRecord = {
      customerName: customerName.trim() || "সাধারণ গ্রাহক (Walk-in)",
      customerPhone: customerPhone.trim() || "-",
      items: posCart.map(i => ({
        id: i.id,
        name: i.banglaName || i.name,
        price: i.price,
        costPrice: i.costPrice || (i.price * 0.7),
        quantity: i.quantity,
        unit: i.unit || 'পিস',
        total: i.price * i.quantity
      })),
      subtotal,
      discount: discountVal,
      total: netTotal,
      paidAmount: receivedVal,
      change: changeVal,
      due: dueVal,
      paymentMethod,
      notes: saleNotes
    };

    completePosSale(saleRecord);

    // Reset Form Fields
    setCustomerName("");
    setCustomerPhone("");
    setDiscount(0);
    setReceivedAmount("");
    setSaleNotes("");
  };

  return (
    <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-4 min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-4">
      {/* Left Column: Product Selection & Catalog */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 overflow-hidden">
        {/* Top Controls: Search + Categories */}
        <div className="space-y-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="দ্রুত প্রোডাক্ট খুঁজুন (নাম / কোড / বারকোড)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm font-medium"
              />
            </div>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("সব (All)"); }}
              className="px-3 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              title="রিসেট ফিল্টার"
            >
              রিসেট
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[calc(100vh-14rem)]">
          {filteredProducts.map((product) => {
            const inStock = product.stock > 0;
            const inCart = posCart.find(i => i.id === product.id);

            return (
              <div
                key={product.id}
                onClick={() => inStock && addToPosCart(product)}
                className={`relative p-2.5 rounded-2xl border transition-all duration-150 flex flex-col justify-between select-none ${
                  !inStock
                    ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                    : inCart
                    ? 'bg-emerald-50/70 border-emerald-400 shadow-sm cursor-pointer hover:border-emerald-500'
                    : 'bg-white border-slate-200/80 hover:border-emerald-400 hover:shadow-md cursor-pointer'
                }`}
              >
                {/* Product Image & Badge */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-2">
                  <img
                    src={product.image}
                    alt={product.banglaName}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    স্টক: {product.stock}
                  </span>
                  {inCart && (
                    <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
                      {inCart.quantity} {product.unit || 'টি'}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 leading-snug">
                    {product.banglaName || product.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-extrabold text-emerald-800">
                      ৳ {product.price}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      /{product.unit || 'পিস'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: POS Billing Memo & Register */}
      <div className="w-full lg:w-[460px] flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-lg p-4 justify-between">
        <div className="space-y-3">
          {/* Cashier Slip Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                ⚡
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-800">ক্যাশ সেল মেমো (POS)</h3>
                <p className="text-[10px] text-slate-400">কাউন্টার ক্যাশ রসিদ</p>
              </div>
            </div>

            {posCart.length > 0 && (
              <button
                onClick={clearPosCart}
                className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ক্লিয়ার</span>
              </button>
            )}
          </div>

          {/* Customer Input Row */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="relative">
              <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="গ্রাহকের নাম (ঐচ্ছিক)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="tel"
                placeholder="মোবাইল নম্বর"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
              />
            </div>
          </div>

          {/* Cart Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 grid grid-cols-12 gap-1">
              <span className="col-span-5">আইটেম</span>
              <span className="col-span-3 text-center">পরিমাণ</span>
              <span className="col-span-3 text-right">মোট (৳)</span>
              <span className="col-span-1 text-center"></span>
            </div>

            <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {posCart.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs space-y-1">
                  <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
                  <p>বিলের জন্য প্রোডাক্টে ক্লিক করুন</p>
                </div>
              ) : (
                posCart.map((item) => (
                  <div key={item.id} className="p-2.5 grid grid-cols-12 gap-1 items-center text-xs">
                    <div className="col-span-5">
                      <p className="font-bold text-slate-800 line-clamp-1 text-[11px]">
                        {item.banglaName || item.name}
                      </p>
                      <p className="text-[10px] text-slate-400">@৳{item.price}</p>
                    </div>

                    <div className="col-span-3 flex items-center justify-center gap-1">
                      <button
                        onClick={() => updatePosQty(item.id, item.quantity - 1)}
                        className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded flex items-center justify-center text-slate-700"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="font-bold text-slate-800 text-xs min-w-[18px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updatePosQty(item.id, item.quantity + 1)}
                        className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded flex items-center justify-center text-slate-700"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <div className="col-span-3 text-right font-bold text-slate-800 text-xs">
                      ৳{item.price * item.quantity}
                    </div>

                    <div className="col-span-1 text-center">
                      <button
                        onClick={() => removeFromPosCart(item.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Calculation & Checkout Area */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
          {/* Subtotal & Discount */}
          <div className="space-y-1.5 text-slate-600">
            <div className="flex justify-between items-center">
              <span>সাবটোটাল ({posCart.length} টি আইটেম):</span>
              <span className="font-bold text-slate-800">৳ {subtotal.toLocaleString('bn-BD')}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                <span>বিশেষ ছাড় (Discount ৳):</span>
              </span>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-20 px-2 py-1 text-right rounded-lg border border-slate-200 font-bold text-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-slate-200 text-base font-extrabold text-slate-900">
              <span>মোট প্রদেয় বিল:</span>
              <span className="text-emerald-700 font-black text-xl">
                ৳ {netTotal.toLocaleString('bn-BD')}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">পেমেন্ট মেথড:</label>
            <div className="grid grid-cols-5 gap-1 text-[11px]">
              {[
                { id: 'Cash', label: 'ক্যাশ' },
                { id: 'bKash', label: 'বিকাশ' },
                { id: 'Nagad', label: 'নগদ' },
                { id: 'Card', label: 'কার্ড' },
                { id: 'Due', label: 'বাকি' },
              ].map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPaymentMethod(p.id)}
                  className={`py-1.5 rounded-lg font-bold border transition-all text-center ${
                    paymentMethod === p.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cash Received & Change */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">গৃহীত টাকা (Paid):</label>
              <input
                type="number"
                placeholder={netTotal.toString()}
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
                className="w-full px-2 py-1 text-xs font-bold rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                {dueVal > 0 ? 'বাকি রইল (Due):' : 'ফেরত দিন (Change):'}
              </label>
              <div className={`px-2 py-1 text-xs font-extrabold rounded-lg ${dueVal > 0 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>
                ৳ {dueVal > 0 ? dueVal.toLocaleString('bn-BD') : changeVal.toLocaleString('bn-BD')}
              </div>
            </div>
          </div>

          {/* Action Button: Complete & Print */}
          <button
            onClick={handleCompleteSale}
            disabled={posCart.length === 0}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Receipt className="w-4 h-4" />
            <span>বিক্রি সম্পন্ন করুন ও মেমো প্রিন্ট</span>
          </button>
        </div>
      </div>
    </div>
  );
}
