import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQty, 
    removeFromCart, 
    clearCart,
    setIsCheckoutOpen,
    shopSettings 
  } = useShop();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 100 : 0;
  const grandTotal = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h2 className="font-bold text-base">আপনার শপিং ব্যাগ</h2>
              <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {cart.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                <span className="text-6xl">🛍️</span>
                <p className="font-bold text-slate-700 text-base">আপনার কার্ট খালি!</p>
                <p className="text-xs">আমাদের পণ্য তালিকা থেকে পছন্দের আইটেম যোগ করুন।</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                >
                  কেনাকাটা শুরু করুন
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.banglaName}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-xs line-clamp-1">
                      {item.banglaName || item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      ৳{item.price} × {item.quantity} = <strong>৳{item.price * item.quantity}</strong>
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateCartQty(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.unit || 'পিস'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-red-500 p-2"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>পণ্যের মূল্য (Subtotal):</span>
                  <span className="font-bold text-slate-800">৳ {subtotal.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ (ঢাকা ও সারা দেশ):</span>
                  <span className="font-bold text-slate-800">৳ {deliveryFee}</span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>সর্বমোট বিল (Total):</span>
                  <span className="text-emerald-700 font-black text-base">
                    ৳ {grandTotal.toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="px-3 py-2.5 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-200 transition-colors"
                >
                  খালি করুন
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <span>অর্ডার সম্পন্ন করতে এগিয়ে যান</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
