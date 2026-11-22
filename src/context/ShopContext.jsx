import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_SHOP_SETTINGS, INITIAL_SALES, INITIAL_ORDERS, INITIAL_USERS } from '../data/initialData';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  // LocalStorage initialization helper
  const loadLocal = (key, fallback) => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(`Error loading ${key} from localStorage:`, e);
    }
    return fallback;
  };

  const [products, setProducts] = useState(() => loadLocal('dokan_products', INITIAL_PRODUCTS));
  const [sales, setSales] = useState(() => loadLocal('dokan_sales', INITIAL_SALES));
  const [orders, setOrders] = useState(() => loadLocal('dokan_orders', INITIAL_ORDERS));
  const [users, setUsers] = useState(() => loadLocal('dokan_users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState(() => loadLocal('dokan_current_user', null));

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signin'); // 'signin' | 'signup'

  const [shopSettings, setShopSettings] = useState(() => {
    const saved = loadLocal('dokan_settings', null);
    if (!saved || !saved.storeName || saved.storeName.includes('আল-মদিনা') || !saved.bannerUrl || saved.phone?.includes('XXXXX')) {
      return INITIAL_SHOP_SETTINGS;
    }
    return saved;
  });

  // Global Search & Category Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('সব (All)');
  
  // Navigation tab: 'storefront' | 'pos' | 'inventory' | 'orders' | 'reports' | 'settings'
  const [activeTab, setActiveTab] = useState('storefront');
  
  // Customer Storefront Cart
  const [cart, setCart] = useState(() => loadLocal('dokan_customer_cart', []));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // POS State
  const [posCart, setPosCart] = useState([]);
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('dokan_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('dokan_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('dokan_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('dokan_settings', JSON.stringify(shopSettings));
  }, [shopSettings]);

  useEffect(() => {
    localStorage.setItem('dokan_customer_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('dokan_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dokan_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('dokan_current_user');
    }
  }, [currentUser]);

  // Auth Methods
  const openAuthModal = (tab = 'signin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (identifier, password) => {
    const cleanId = identifier.trim().toLowerCase();
    const user = users.find(u => 
      (u.phone?.trim() === cleanId || u.email?.trim().toLowerCase() === cleanId) &&
      u.password === password
    );

    if (user) {
      setCurrentUser(user);
      setIsAuthModalOpen(false);
      return { success: true, user };
    }
    return { success: false, message: "ভুল মোবাইল/ইমেইল অথবা পাসওয়ার্ড!" };
  };

  const signup = ({ name, phone, email, password, address, role = 'customer' }) => {
    const cleanPhone = phone?.trim();
    const cleanEmail = email?.trim().toLowerCase();

    // Check if phone or email already exists
    const exists = users.find(u => 
      (cleanPhone && u.phone === cleanPhone) || 
      (cleanEmail && u.email?.toLowerCase() === cleanEmail)
    );

    if (exists) {
      return { success: false, message: "এই মোবাইল বা ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে!" };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail || '',
      password,
      address: address?.trim() || '',
      role
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Customer Cart Methods
  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + qty, product.stock) }
            : item
        );
      }
      return [...prev, { ...product, quantity: Math.min(qty, product.stock) }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const prod = products.find(p => p.id === productId);
          const maxStock = prod ? prod.stock : 999;
          return { ...item, quantity: Math.min(newQty, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  // POS Cart Methods
  const addToPosCart = (product) => {
    if (product.stock <= 0) {
      alert(`দুঃখিত, "${product.banglaName || product.name}" পণ্যটির স্টক শেষ!`);
      return;
    }
    setPosCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`স্টকে শুধুমাত্র ${product.stock} টি পণ্য রয়েছে!`);
          return prev;
        }
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updatePosQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromPosCart(productId);
      return;
    }
    const prod = products.find(p => p.id === productId);
    if (prod && newQty > prod.stock) {
      alert(`স্টকে সর্বোচ্চ ${prod.stock} টি রয়েছে!`);
      return;
    }
    setPosCart(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromPosCart = (productId) => {
    setPosCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearPosCart = () => setPosCart([]);

  // Complete POS Sale
  const completePosSale = (saleData) => {
    const saleId = `POS-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Decrement inventory stock
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const soldItem = saleData.items.find(i => i.id === p.id);
        if (soldItem) {
          const newStock = Math.max(0, p.stock - soldItem.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );

    // Calculate total cost & net profit
    let totalCost = 0;
    saleData.items.forEach(item => {
      const matchedProd = products.find(p => p.id === item.id);
      const unitCost = matchedProd?.costPrice || (item.price * 0.7);
      totalCost += unitCost * item.quantity;
    });
    const profit = Math.max(0, saleData.total - totalCost);

    const record = {
      ...saleData,
      id: saleId,
      date: new Date().toISOString(),
      totalCost,
      profit
    };

    setSales(prev => [record, ...prev]);
    setPosCart([]);
    setActiveReceipt(record);
    return record;
  };

  // Place Customer Order
  const placeCustomerOrder = (orderData) => {
    const orderId = `ORD-${Math.floor(100 + Math.random() * 900)}`;

    // Decrement product stock on successful order placement
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const orderItem = orderData.items.find(i => i.id === p.id);
        if (orderItem) {
          return { ...p, stock: Math.max(0, p.stock - orderItem.quantity) };
        }
        return p;
      })
    );

    const newOrder = {
      ...orderData,
      id: orderId,
      date: new Date().toISOString(),
      status: "Pending"
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    return newOrder;
  };

  // Order status management
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  // Product Inventory Management
  const addProduct = (newProd) => {
    const id = `prod-${Date.now()}`;
    const product = { ...newProd, id };
    setProducts(prev => [product, ...prev]);
    return product;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id) => {
    if (confirm("আপনি কি নিশ্চিত এই পণ্যটি ডিলিট করতে চান?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const adjustStock = (id, changeAmount, reason = "ম্যানুয়াল আপডেট") => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + changeAmount);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  // Reset & Backup
  const resetToDemoData = () => {
    if (confirm("আপনি কি সব ডেটা রিসেট করে প্রাথমিক ডেমো ডেটা ফিরিয়ে আনতে চান?")) {
      setProducts(INITIAL_PRODUCTS);
      setSales(INITIAL_SALES);
      setOrders(INITIAL_ORDERS);
      setShopSettings(INITIAL_SHOP_SETTINGS);
      setCart([]);
      setPosCart([]);
      localStorage.clear();
      alert("সফলভাবে ডেমো ডেটা রিস্টোর করা হয়েছে!");
    }
  };

  const exportBackup = () => {
    const data = {
      products,
      sales,
      orders,
      shopSettings,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dokan-pos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.products && Array.isArray(parsed.products)) {
        setProducts(parsed.products);
        if (parsed.sales) setSales(parsed.sales);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.shopSettings) setShopSettings(parsed.shopSettings);
        alert("ব্যাকআপ সফলভাবে ইম্পোর্ট করা হয়েছে!");
      } else {
        alert("ভুল ফরম্যাট! ব্যাকআপ ফাইলে প্রোডাক্ট লিস্ট পাওয়া যায়নি।");
      }
    } catch (e) {
      alert("ব্যাকআপ ফাইল রিড করতে সমস্যা হয়েছে: " + e.message);
    }
  };

  // Computed summary metrics
  const lowStockCount = products.filter(p => p.stock <= (p.minStockAlert || 5)).length;
  const pendingOrdersCount = orders.filter(o => o.status === "Pending").length;
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        sales,
        orders,
        shopSettings,
        setShopSettings,
        activeTab,
        setActiveTab,
        // Customer Cart
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        placeCustomerOrder,
        // POS
        posCart,
        addToPosCart,
        updatePosQty,
        removeFromPosCart,
        clearPosCart,
        completePosSale,
        activeReceipt,
        setActiveReceipt,
        // Inventory
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        updateOrderStatus,
        // Auth
        users,
        currentUser,
        isAdmin: currentUser?.role === 'admin',
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        // Search & Category
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        // Tools
        lowStockCount,
        pendingOrdersCount,
        cartTotalCount,
        resetToDemoData,
        exportBackup,
        importBackup
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
