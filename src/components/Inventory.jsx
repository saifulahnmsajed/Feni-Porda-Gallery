import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/initialData';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Layers, 
  DollarSign, 
  PackageCheck, 
  ArrowUpDown, 
  X,
  Check,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function Inventory() {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    adjustStock,
    lowStockCount 
  } = useShop();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("সব (All)");
  const [stockFilter, setStockFilter] = useState("all"); // 'all' | 'low' | 'out'
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [restockItem, setRestockItem] = useState(null);
  const [restockAmount, setRestockAmount] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    banglaName: '',
    category: 'ফোম (Foam)',
    sku: '',
    price: '',
    costPrice: '',
    stock: '',
    minStockAlert: 5,
    unit: 'পিস',
    image: '',
    description: ''
  });

  // Calculate Metrics
  const totalStockQuantity = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const totalCostValue = products.reduce((sum, p) => sum + (Number(p.costPrice || 0) * Number(p.stock || 0)), 0);
  const totalRetailValue = products.reduce((sum, p) => sum + (Number(p.price || 0) * Number(p.stock || 0)), 0);
  const potentialProfit = Math.max(0, totalRetailValue - totalCostValue);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "সব (All)" || p.category.includes(selectedCategory.split(" ")[0]);
      const matchesSearch =
        (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.banglaName && p.banglaName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchesStock = true;
      if (stockFilter === "low") matchesStock = p.stock > 0 && p.stock <= (p.minStockAlert || 5);
      if (stockFilter === "out") matchesStock = p.stock <= 0;

      return matchesCategory && matchesSearch && matchesStock;
    });
  }, [products, selectedCategory, searchQuery, stockFilter]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      banglaName: '',
      category: 'ফোম (Foam)',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      price: '',
      costPrice: '',
      stock: '',
      minStockAlert: 5,
      unit: 'পিস',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80',
      description: ''
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name || '',
      banglaName: p.banglaName || '',
      category: p.category || 'ফোম (Foam)',
      sku: p.sku || '',
      price: p.price || '',
      costPrice: p.costPrice || '',
      stock: p.stock || 0,
      minStockAlert: p.minStockAlert || 5,
      unit: p.unit || 'পিস',
      image: p.image || '',
      description: p.description || ''
    });
    setIsModalOpen(true);
  };

  // Save Product
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.banglaName.trim() && !formData.name.trim()) {
      alert("পণ্যের নাম আবশ্যক!");
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price) || 0,
      costPrice: Number(formData.costPrice) || 0,
      stock: Number(formData.stock) || 0,
      minStockAlert: Number(formData.minStockAlert) || 5,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }
    setIsModalOpen(false);
  };

  // Quick Restock submit
  const handleQuickRestock = () => {
    if (!restockItem) return;
    adjustStock(restockItem.id, Number(restockAmount) || 0);
    setRestockItem(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Title & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-600" />
            <span>ইনভেন্টরি ও পণ্য স্টক ম্যানেজমেন্ট</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            দোকানের সমস্ত পণ্যের ক্রয়-বিক্রয় মূল্য, বর্তমান স্টক এবং রিস্টক ব্যবস্থাপনা
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পণ্য যোগ করুন</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">মোট পণ্য সংখ্যা</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-slate-900">{products.length}</h3>
            <span className="text-xs text-slate-400">আইটেম</span>
          </div>
          <p className="text-[11px] text-slate-400">মোট মজুদ: {totalStockQuantity} পিস/গজ</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">মোট ক্রয়মূল্য ইনভেস্ট</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-slate-900">৳ {totalCostValue.toLocaleString('bn-BD')}</h3>
            <span className="text-xs text-slate-400">আসল</span>
          </div>
          <p className="text-[11px] text-slate-400">বর্তমান স্টকের মোট খরচ</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">সম্ভাব্য মোট বিক্রয়মূল্য</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-emerald-800">৳ {totalRetailValue.toLocaleString('bn-BD')}</h3>
            <span className="text-xs text-emerald-600 font-bold">বিক্রি</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-bold">সম্ভাব্য লাভ: ৳ {potentialProfit.toLocaleString('bn-BD')}</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-sm space-y-1 ${
          lowStockCount > 0 ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-slate-200/80'
        }`}>
          <span className="text-xs font-semibold text-amber-800 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>লো-স্টক সতর্কতা</span>
          </span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-amber-900">{lowStockCount}</h3>
            <span className="text-xs text-amber-700">পণ্য</span>
          </div>
          <p className="text-[11px] text-amber-700">দ্রুত রিস্টক করা প্রয়োজন</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="পণ্য বা SKU দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
          />
        </div>

        {/* Categories & Stock Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">সব স্টক অবস্থা</option>
            <option value="low">সীমিত স্টক (Low Stock)</option>
            <option value="out">স্টক শেষ (Out of Stock)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 text-xs font-bold">
                <th className="py-3 px-4">পণ্য</th>
                <th className="py-3 px-3">ক্যাটাগরি</th>
                <th className="py-3 px-3 text-right">ক্রয়মূল্য (৳)</th>
                <th className="py-3 px-3 text-right">বিক্রয়মূল্য (৳)</th>
                <th className="py-3 px-3 text-center">বর্তমান স্টক</th>
                <th className="py-3 px-3 text-center">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    কোন পণ্য খুঁজে পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOut = p.stock <= 0;
                  const isLow = p.stock > 0 && p.stock <= (p.minStockAlert || 5);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Product Name & Image */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.banglaName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{p.banglaName || p.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku || '-'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 font-medium text-slate-600">
                        {p.category}
                      </td>

                      {/* Cost Price */}
                      <td className="py-3 px-3 text-right font-mono text-slate-600">
                        ৳{p.costPrice || 0}
                      </td>

                      {/* Selling Price */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        ৳{p.price}
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3 px-3 text-center font-bold">
                        <span className="font-mono text-sm">{p.stock}</span>
                        <span className="text-[10px] text-slate-400 ml-1">{p.unit || 'পিস'}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {isOut ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                            স্টক আউট
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            সীমিত ({p.stock})
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            পর্যাপ্ত
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Quick Restock button */}
                          <button
                            onClick={() => { setRestockItem(p); setRestockAmount(10); }}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 text-[11px]"
                            title="স্টক বাড়ান"
                          >
                            + রিস্টক
                          </button>
                          
                          {/* Edit button */}
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                            title="সম্পাদনা করুন"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingProduct ? 'পণ্য সম্পাদনা করুন' : 'নতুন পণ্য যোগ করুন'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">পণ্যের নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: রয়্যাল ভেলভেট পর্দা ৭ ফিট"
                    value={formData.banglaName}
                    onChange={(e) => setFormData({ ...formData, banglaName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">পণ্যের নাম (ইংরেজি / অল্টারনেট)</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Velvet Curtain 7ft"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="ফোম (Foam)">ফোম (Foam)</option>
                    <option value="পর্দা (Curtain)">পর্দা (Curtain)</option>
                    <option value="বালিশ (Pillows)">বালিশ (Pillows)</option>
                    <option value="কভার (Covers)">কভার (Covers)</option>
                    <option value="কাপড় (Fabrics)">কাপড় (Fabrics)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU / বারকোড</label>
                  <input
                    type="text"
                    placeholder="e.g. FM-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্রয়মূল্য (আসল খরচ ৳) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="যেমন: 850"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">বিক্রয়মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="যেমন: 1200"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">স্টক পরিমাণ *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="যেমন: 20"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">একক (Unit)</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="পিস">পিস (Piece)</option>
                    <option value="গজ">গজ (Yard)</option>
                    <option value="মিটার">মিটার (Meter)</option>
                    <option value="সেট">সেট (Set)</option>
                    <option value="জোড়া">জোড়া (Pair)</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">ছবি (Image URL)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">বিবরণ (Description)</label>
                  <textarea
                    rows="2"
                    placeholder="পণ্যের সাইজ, ফেব্রিক, বা ব্যবহারের বিবরণ..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors"
                >
                  সংরক্ষণ করুন (Save Product)
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Restock Dialog */}
      {restockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-black text-slate-900 text-base">দ্রুত রিস্টক (Add Stock)</h3>
            <p className="text-xs text-slate-600">
              <strong>{restockItem.banglaName}</strong> - বর্তমান স্টক: {restockItem.stock} {restockItem.unit}
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">কতগুলো যোগ করবেন?</label>
              <input
                type="number"
                min="1"
                value={restockAmount}
                onChange={(e) => setRestockAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-lg text-emerald-800"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleQuickRestock}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
              >
                স্টক আপডেট করুন
              </button>
              <button
                onClick={() => setRestockItem(null)}
                className="py-2.5 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                বাতিল
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
