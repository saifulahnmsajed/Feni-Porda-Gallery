import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/initialData';
import { 
  Search, 
  ShoppingCart, 
  Check, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  PhoneCall, 
  X,
  Filter
} from 'lucide-react';

export default function Storefront() {
  const { 
    products, 
    addToCart, 
    cart, 
    shopSettings, 
    setActiveTab, 
    isAdmin, 
    searchQuery, 
    setSearchQuery,
    selectedCategory,
    setSelectedCategory
  } = useShop();

  const [sortBy, setSortBy] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedNotice, setAddedNotice] = useState(null);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === "সব (All)" || p.category.includes(selectedCategory.split(" ")[0]);
        const matchesSearch =
          (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.banglaName && p.banglaName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "stock-low") return a.stock - b.stock;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setAddedNotice(product.id);
    setTimeout(() => {
      setAddedNotice(null);
    }, 1500);
  };

  const getItemCartQty = (productId) => {
    const item = cart.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Official Feni Porda Gallery Banner (Full Space / Matching Content Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div 
          onClick={() => {
            const el = document.getElementById('product-catalog');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl border border-amber-200/50 bg-amber-50/20 cursor-pointer transition-shadow"
        >
          <img
            src={`${import.meta.env.BASE_URL}banner.webp?v=4`}
            alt="ফেনী পর্দা গ্যালারী - ঘরের সৌন্দর্যে নতুন ছোঁয়া"
            className="w-full h-auto block"
          />
        </div>
      </div>

      {/* Sticky Category Pills & Filters Bar (Sticks under top header on scroll) */}
      <div className="sticky top-16 z-30 bg-slate-50/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-3 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs sm:text-sm text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold">সাজান:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            >
              <option value="default">সব পণ্য (ডিফল্ট)</option>
              <option value="price-low">দাম: কম থেকে বেশি</option>
              <option value="price-high">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div id="product-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">

        {/* Results Counter */}
        <div className="py-4 flex items-center justify-between text-xs text-slate-500">
          <span>মোট <strong className="text-slate-800">{filteredProducts.length}</strong> টি প্রোডাক্ট পাওয়া গেছে</span>
          {selectedCategory !== "সব (All)" && (
            <button
              onClick={() => setSelectedCategory("সব (All)")}
              className="text-emerald-600 font-semibold hover:underline"
            >
              সব ক্যাটাগরি দেখুন
            </button>
          )}
        </div>

        {/* Products Grid (Desktop multi-column layout) */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <span className="text-5xl">🔍</span>
            <h3 className="text-lg font-bold text-slate-800 mt-4">কোন প্রোডাক্ট পাওয়া যায়নি!</h3>
            <p className="text-slate-500 text-sm mt-1">অন্য কোনো নাম দিয়ে সার্চ করুন অথবা ক্যাটাগরি পরিবর্তন করুন।</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("সব (All)"); }}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700"
            >
              সব প্রোডাক্ট দেখুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const inStock = product.stock > 0;
              const isLowStock = product.stock > 0 && product.stock <= (product.minStockAlert || 5);
              const cartQty = getItemCartQty(product.id);
              const isJustAdded = addedNotice === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.banglaName || product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Category Tag */}
                    <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                      {product.category}
                    </span>

                    {/* Stock Status Badge (No numbers shown to customers) */}
                    <div className="absolute top-2.5 right-2.5">
                      {!inStock ? (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                          স্টক আউট
                        </span>
                      ) : (
                        <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                          স্টকে আছে
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 text-base">
                        {product.banglaName || product.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Pricing & Add to Cart button */}
                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-emerald-700 font-bold">৳</span>
                          <span className="text-xl font-extrabold text-slate-900">
                            {product.price.toLocaleString('bn-BD')}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          প্রতি {product.unit || 'পিস'}
                        </span>
                      </div>

                      <button
                        disabled={!inStock}
                        onClick={(e) => handleAddToCart(product, e)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                          !inStock
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>যোগ হয়েছে!</span>
                          </>
                        ) : cartQty > 0 ? (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>কার্টে আছে ({cartQty})</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>কার্ট</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="relative aspect-video bg-slate-100">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.banglaName}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {selectedProduct.category}
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {selectedProduct.banglaName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedProduct.name}</p>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">SKU: {selectedProduct.sku}</p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedProduct.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-slate-500 block">স্টক অবস্থা</span>
                  <span className="text-sm font-bold text-emerald-800">
                    {selectedProduct.stock > 0 ? "স্টকে এভেইলেবল আছে" : "স্টক আউট"}
                  </span>
                </div>
                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-slate-500 block">একক বিক্রয় মূল্য</span>
                  <span className="text-sm font-bold text-emerald-800">
                    ৳ {selectedProduct.price} / {selectedProduct.unit}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  disabled={selectedProduct.stock <= 0}
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>কার্টে যোগ করুন</span>
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
