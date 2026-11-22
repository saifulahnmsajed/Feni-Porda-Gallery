import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ClipboardList, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  Printer,
  ChevronDown
} from 'lucide-react';

export default function Orders() {
  const { orders, updateOrderStatus, setActiveReceipt, shopSettings, currentUser, isAdmin } = useShop();
  const [statusFilter, setStatusFilter] = useState("all");
  const [showOnlyMine, setShowOnlyMine] = useState(currentUser && !isAdmin);

  const filteredOrders = orders.filter((o) => {
    if (showOnlyMine && currentUser) {
      const matchPhone = o.customerPhone && currentUser.phone && o.customerPhone.includes(currentUser.phone.slice(-6));
      const matchName = o.customerName && currentUser.name && o.customerName.toLowerCase() === currentUser.name.toLowerCase();
      if (!matchPhone && !matchName) return false;
    }
    if (statusFilter === "all") return true;
    return o.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> অপেক্ষমান (Pending)</span>;
      case 'Confirmed':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> নিশ্চিত (Confirmed)</span>;
      case 'Delivered':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Truck className="w-3 h-3" /> ডেলিভার্ড (Delivered)</span>;
      case 'Cancelled':
        return <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> বাতিল (Cancelled)</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const handlePrintSlip = (order) => {
    setActiveReceipt({
      id: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      date: order.date,
      items: order.items,
      subtotal: order.subtotal,
      discount: 0,
      total: order.total,
      paidAmount: order.paymentMethod === 'Cash on Delivery' ? 0 : order.total,
      due: order.paymentMethod === 'Cash on Delivery' ? order.total : 0,
      paymentMethod: order.paymentMethod,
      notes: `ডেলিভারি ঠিকানা: ${order.deliveryAddress}`
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-emerald-600" />
            <span>{isAdmin ? 'সমস্ত কাস্টমার অর্ডারসমূহ (Admin Management)' : 'আমার অর্ডারসমূহ (My Orders)'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdmin
              ? 'কাস্টমার স্টোরফ্রন্ট থেকে আসা সমস্ত নতুন অর্ডার ও ডেলিভারি ট্র্যাকিং'
              : 'আপনার অর্ডারের বর্তমান অবস্থা এবং ডেলিভারি ট্র্যাকিং'}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {[
            { id: 'all', label: 'সব অর্ডার' },
            { id: 'Pending', label: 'অপেক্ষমান' },
            { id: 'Confirmed', label: 'নিশ্চিত' },
            { id: 'Delivered', label: 'ডেলিভার্ড' },
            { id: 'Cancelled', label: 'বাতিল' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === tab.id
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 space-y-3">
            <span className="text-5xl">📦</span>
            <h3 className="text-base font-bold text-slate-700">কোন অর্ডার নেই</h3>
            <p className="text-xs">কাস্টমার যখন স্টোর থেকে অর্ডার করবে তখন এখানে দেখা যাবে।</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const formattedDate = new Date(order.date).toLocaleDateString('bn-BD', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow p-5 space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black bg-slate-100 text-slate-800 px-3 py-1 rounded-xl">
                      #{order.id}
                    </span>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <button
                      onClick={() => handlePrintSlip(order)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
                      title="ডেলিভারি স্লিপ প্রিন্ট"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>স্লিপ প্রিন্ট</span>
                    </button>
                  </div>
                </div>

                {/* Customer Details & Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  {/* Customer Info */}
                  <div className="md:col-span-5 space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                    <div>
                      <span className="text-slate-400 block text-[10px]">গ্রাহকের নাম:</span>
                      <strong className="text-slate-900 font-bold text-sm">{order.customerName}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <a href={`tel:${order.customerPhone}`} className="text-emerald-700 font-bold hover:underline">
                        {order.customerPhone}
                      </a>
                    </div>

                    <div className="flex items-start gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>{order.deliveryAddress}</span>
                    </div>

                    {order.notes && (
                      <div className="pt-1 text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                        <strong>নোট:</strong> {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Ordered Items List */}
                  <div className="md:col-span-7 flex flex-col justify-between space-y-2">
                    <div className="space-y-1.5 divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center pt-1.5 first:pt-0">
                          <div>
                            <span className="font-bold text-slate-800">{item.name}</span>
                            <span className="text-slate-400 ml-2 font-mono">({item.quantity} × ৳{item.price})</span>
                          </div>
                          <span className="font-bold text-slate-900 font-mono">৳{item.total || item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Total & Status Actions */}
                    <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] text-slate-500">পেমেন্ট: <strong>{order.paymentMethod}</strong> • ডেলিভারি: ৳{order.deliveryFee || 100}</span>
                        <div className="text-base font-black text-slate-900">
                          মোট বিল: <span className="text-emerald-700">৳ {order.total.toLocaleString('bn-BD')}</span>
                        </div>
                      </div>

                      {/* Status Change Buttons (Admin only) */}
                      {isAdmin ? (
                        <div className="flex items-center gap-1.5">
                          {order.status === 'Pending' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
                            >
                              কনফার্ম করুন
                            </button>
                          )}
                          {order.status === 'Confirmed' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Delivered')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                            >
                              ডেলিভার্ড মার্ক করুন
                            </button>
                          )}
                          {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-bold rounded-xl text-xs"
                            >
                              বাতিল
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs font-semibold text-slate-500">
                          {order.status === 'Pending' && 'অর্ডার প্রক্রিয়াধীন রয়েছে'}
                          {order.status === 'Confirmed' && 'অর্ডার নিশ্চিত হয়েছে, ডেলিভারির জন্য তৈরি হচ্ছে'}
                          {order.status === 'Delivered' && 'অর্ডার সফলভাবে পৌঁছে গেছে!'}
                          {order.status === 'Cancelled' && 'অর্ডারটি বাতিল করা হয়েছে'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
