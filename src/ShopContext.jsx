import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_PRODUCTS,
  DEFAULT_CATEGORIES,
  SAMPLE_ORDERS,
  STORAGE_CATALOG,
  STORAGE_CATEGORIES,
  STORAGE_ORDERS,
} from './data/initialCatalog.js';

const ShopContext = createContext();
export const useShop = () => useContext(ShopContext);

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export const ShopProvider = ({ children }) => {
  
  // 🔥 AUTH STATE - GLOBAL
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userAuth");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [catalogProducts, setCatalogProducts] = useState(() =>
    readJson(STORAGE_CATALOG, INITIAL_PRODUCTS)
  );

  const [categories, setCategories] = useState(() =>
    readJson(STORAGE_CATEGORIES, DEFAULT_CATEGORIES)
  );

  const [orders, setOrdersState] = useState(() => {
    const loaded = readJson(STORAGE_ORDERS, null);
    return Array.isArray(loaded) && loaded.length ? loaded : SAMPLE_ORDERS;
  });

  // 1. PAGE LOAD HOTE HI PURANA DATA BROWSER SE NIKALNA
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("llmShop_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("llmShop_wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // 2. JAB BHI CART MEIN KUCH ADD/REMOVE HO, USE BROWSER MEIN PERMANENT SAVE KARNA
  useEffect(() => {
    localStorage.setItem("llmShop_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("llmShop_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CATALOG, JSON.stringify(catalogProducts));
  }, [catalogProducts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
  }, [orders]);

  const addProduct = useCallback((product) => {
    const id = product.id ?? Date.now();
    setCatalogProducts((prev) => [...prev, { ...product, id }]);
  }, []);

  const updateProduct = useCallback((id, patch) => {
    setCatalogProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch, id: p.id } : p))
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setCatalogProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addCategory = useCallback((cat) => {
    const id = cat.id ?? `cat-${Date.now()}`;
    const slug =
      cat.slug ||
      String(cat.name || "")
        .toLowerCase()
        .replace(/\s+/g, "-");
    setCategories((prev) => [...prev, { ...cat, id, name: cat.name, slug }]);
  }, []);

  const updateCategory = useCallback((id, patch) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch, id: c.id } : c))
    );
  }, []);

  const deleteCategory = useCallback((id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrdersState((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  }, []);

  const recordOrder = useCallback((payload) => {
    setOrdersState((prev) => [payload, ...prev]);
  }, []);

  // 🔥 AUTH FUNCTIONS
  const login = (userData) => {
    localStorage.setItem("userAuth", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("userAuth");
    localStorage.removeItem("rememberedEmail");
    setUser(null);
  };

  const updateUser = (userData) => {
    localStorage.setItem("userAuth", JSON.stringify(userData));
    setUser(userData);
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  // --- ADD TO CART ---
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1, size: "Free Size" }];
    });
  };

  // --- REMOVE FROM CART ---
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // --- UPDATE QUANTITY ---
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, qty: newQty } : item));
  };

  // --- UPDATE SIZE ---
  const updateSize = (id, newSize) => {
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, size: newSize } : item));
  };

  // --- TOGGLE WISHLIST (Add/Remove) ---
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev.filter((item) => item.id !== product.id);
      return [...prev, product];
    });
  };

  // ✅ REMOVE FROM WISHLIST - DIRECT FUNCTION
  const removeFromWishlist = (id) => {
    console.log("removeFromWishlist called with id:", id);
    setWishlist((prev) => {
      const newWishlist = prev.filter((item) => item.id !== id);
      console.log("Old wishlist length:", prev.length, "New wishlist length:", newWishlist.length);
      return newWishlist;
    });
  };

  // ✅ ADD TO WISHLIST - DIRECT FUNCTION
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (!exists) {
        return [...prev, product];
      }
      return prev;
    });
  };

  // ✅ CHECK IF PRODUCT IS IN WISHLIST
  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  // ✅ CLEAR WISHLIST
  const clearWishlist = () => {
    setWishlist([]);
  };

  // ✅ CLEAR CART
  const clearCart = () => {
    setCart([]);
  };

  // ✅ GET CART TOTAL
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * (item.qty || 1)), 0);
  };

  // ✅ GET CART COUNT
  const getCartCount = () => {
    return cart.reduce((count, item) => count + (item.qty || 1), 0);
  };

  return (
    <ShopContext.Provider value={{ 
      // AUTH
      user,
      login,
      logout,
      updateUser,
      isLoggedIn,
      
      // CATALOG (storefront + admin)
      catalogProducts,
      setCatalogProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      orders,
      updateOrderStatus,
      recordOrder,
      
      // CART
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      updateSize,
      clearCart,
      getCartTotal,
      getCartCount,
      
      // WISHLIST
      wishlist, 
      toggleWishlist,
      removeFromWishlist,
      addToWishlist,
      isInWishlist,
      clearWishlist
    }}>
      {children}
    </ShopContext.Provider>
  );
};