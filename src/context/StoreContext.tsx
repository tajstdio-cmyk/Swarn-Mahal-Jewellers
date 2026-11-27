"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Product, StoreDatabase } from "@/lib/types";
import { DEFAULT_STORE_DATA } from "@/lib/defaultStore";

export interface CartItem {
  productId: string;
  quantity: number;
  selectedSize?: string;
}

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

interface StoreContextValue {
  store: StoreDatabase;
  loading: boolean;
  refreshStore: () => Promise<void>;
  saveStore: (updated: StoreDatabase) => Promise<boolean>;
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  addToCart: (productId: string, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  cartCount: number;
  cartTotal: number;
  showToast: (message: string, type?: "success" | "info" | "error") => void;
  toasts: ToastMessage[];
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<StoreDatabase>(DEFAULT_STORE_DATA);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: "success" | "info" | "error" = "success") => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    },
    []
  );

  const refreshStore = useCallback(async () => {
    try {
      const res = await fetch("/api/store", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as StoreDatabase;
        setStore(data);
      }
    } catch (e) {
      console.error("Failed to fetch store:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveStore = useCallback(
    async (updated: StoreDatabase): Promise<boolean> => {
      try {
        const res = await fetch("/api/store", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        if (res.ok) {
          const saved = (await res.json()) as StoreDatabase;
          setStore(saved);
          return true;
        }
        return false;
      } catch (e) {
        console.error("Failed to save store:", e);
        return false;
      }
    },
    []
  );

  useEffect(() => {
    refreshStore();
    try {
      const savedCart = localStorage.getItem("smj_cart");
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedWish = localStorage.getItem("smj_wishlist");
      if (savedWish) setWishlist(JSON.parse(savedWish));
    } catch {
      // ignore storage errors
    }
  }, [refreshStore]);

  useEffect(() => {
    try {
      localStorage.setItem("smj_cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("smj_wishlist", JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const addToCart = useCallback(
    (productId: string, selectedSize?: string) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.productId === productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === productId
              ? { ...i, quantity: i.quantity + 1, selectedSize: selectedSize || i.selectedSize }
              : i
          );
        }
        return [...prev, { productId, quantity: 1, selectedSize }];
      });
      showToast("Added to your jewellery bag");
    },
    [showToast]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateCartQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          showToast("Removed from wishlist", "info");
          return prev.filter((id) => id !== productId);
        }
        showToast("Saved to your wishlist");
        return [...prev, productId];
      });
    },
    [showToast]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const p = store.products.find((prod) => prod.id === item.productId);
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);
  }, [cart, store.products]);

  return (
    <StoreContext.Provider
      value={{
        store,
        loading,
        refreshStore,
        saveStore,
        cart,
        wishlist,
        cartOpen,
        setCartOpen,
        searchOpen,
        setSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        toggleWishlist,
        isWishlisted,
        cartCount,
        cartTotal,
        showToast,
        toasts,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
