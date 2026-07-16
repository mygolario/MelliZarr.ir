"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type CartLine = {
  productId: string;
  slug: string;
  title: string;
  weightGrams: number;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  addItem: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalCount: number;
};

const STORAGE_KEY = "mellizarr-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartLine[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartLine[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("mellizarr-cart"));
  } catch {
    // Safari private mode / blocked storage — keep in-memory via event only
    window.dispatchEvent(new Event("mellizarr-cart"));
  }
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("mellizarr-cart", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("mellizarr-cart", onStoreChange);
  };
}

function getServerSnapshot(): CartLine[] {
  return [];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, readCart, getServerSnapshot);

  const addItem = useCallback(
    (item: Omit<CartLine, "quantity">, quantity = 1) => {
      const prev = readCart();
      const existing = prev.find((line) => line.productId === item.productId);
      const next = existing
        ? prev.map((line) =>
            line.productId === item.productId
              ? { ...line, quantity: line.quantity + quantity }
              : line,
          )
        : [...prev, { ...item, quantity }];
      writeCart(next);
    },
    [],
  );

  const removeItem = useCallback((productId: string) => {
    writeCart(readCart().filter((line) => line.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    writeCart(
      readCart()
        .map((line) =>
          line.productId === productId
            ? { ...line, quantity: Math.max(1, quantity) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => writeCart([]), []);

  const totalCount = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, setQuantity, clear, totalCount }),
    [items, addItem, removeItem, setQuantity, clear, totalCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
