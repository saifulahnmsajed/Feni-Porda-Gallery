import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, CheckCircle, Truck, Phone, MapPin, User, FileText, ArrowRight } from 'lucide-react';

export default function CheckoutModal() {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    placeCustomerOrder,
    shopSettings,
    currentUser
  } = useShop();

  const [formData, setFormData] = useState({
    customerName: currentUser?.name || '',
    customerPhone: currentUser?.phone || '',
    deliveryAddress: currentUser?.address || '',
    paymentMethod: 'Cash on Delivery',
    notes: ''
  });

  React.useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || currentUser.name || '',
        customerPhone: prev.customerPhone || currentUser.phone || '',
        deliveryAddress: prev.deliveryAddress || currentUser.address || ''
      }));
    }
  }, [currentUser]);

  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isCheckoutOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 100;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.deliveryAddress.trim()) {
      alert("অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা লিখুন!");
      return;
    }

    const orderData = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      deliveryAddress: formData.deliveryAddress,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      items: cart.map(item => ({
        id: item.id,
        name: item.banglaName || item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      })),
      subtotal,
      deliveryFee,
      total
    };

    const newOrder = placeCustomerOrder(orderData);
    setCompletedOrder(newOrder);
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base sm:text-lg">
              {completedOrder ? 'অর্ডার সফল হয়েছে! 🎉' : 'কাস্টমার অর্ডার ও ডেলিভারি ফর্ম'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {completedOrder ? (
          /* Order Placed Success View */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-800">ধন্যবাদ, আপনার অর্ডার গৃহীত হয়েছে!</h4>
              <p className="text-xs text-slate-500 mt-1">আমাদের প্রতিনিধি শীঘ্রই আপনার নম্বরে কল করে অর্ডার কনফার্ম করবেন।</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between font-mono font-bold text-slate-700">
                <span>অর্ডার আইডি (Order ID):</span>
                <span className="text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded">
                  {completedOrder.id}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>গ্রাহকের নাম:</span>
                <span className="font-semibold">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>মোবাইল নম্বর:</span>
                <span className="font-semibold">{completedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>পেমেন্ট মেথড:</span>
                <span className="font-semibold text-emerald-800">{completedOrder.paymentMethod}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                <span>সর্বমোট প্রদেয় বিল:</span>
                <span className="text-emerald-700 font-black">
                  ৳ {completedOrder.total.toLocaleString('bn-BD')}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleClose}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
              >
                ঠিক আছে (Close)
              </button>
            </div>
          </div>
        ) : (
          /* Order Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Form Fields */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  আপনার সম্পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  মোবাইল নম্বর (সচল নম্বর দিন) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="যেমন: 017XXXXXXXX"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  ডেলিভারির সম্পূর্ণ ঠিকানা *
                </label>
                <textarea
                  required
                  rows="2"
                  placeholder="বাসা/হোল্ডিং নম্বর, রোড, এলাকা, থানা ও জেলা"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">পেমেন্ট মাধ্যম বেছে নিন *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Cash on Delivery', label: 'ক্যাশ অন ডেলিভারি', icon: '💵' },
                    { id: 'bKash', label: 'বিকাশ (bKash)', icon: '📱' },
                    { id: 'Nagad', label: 'নগদ (Nagad)', icon: '💳' },
                  ].map((method) => (
                    <button
                      type="button"
                      key={method.id}
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        formData.paymentMethod === method.id
                          ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 font-bold shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-base">{method.icon}</span>
                      <span className="text-[11px] leading-tight">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  বিশেষ কোনো নির্দেশনা (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: পর্দার রিং কালার সিলভার দিবেন"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Bill Preview */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>পণ্যের সাবটোটাল ({cart.length} টি পণ্য):</span>
                <span>৳ {subtotal.toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ:</span>
                <span>৳ {deliveryFee}</span>
              </div>
              <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-900 text-sm">
                <span>সর্বমোট প্রদেয় বিল:</span>
                <span className="text-emerald-700 font-black">৳ {total.toLocaleString('bn-BD')}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>অর্ডার নিশ্চিত করুন (Confirm Order)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
