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
const EMPTY: CartLine[] = [];
const CartContext = createContext<CartContextValue | null>(null);

let cachedRaw: string | null = null;
let cachedItems: CartLine[] = EMPTY;

function readCartSnapshot(): CartLine[] {
  try {
    if (typeof window === "undefined") return EMPTY;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedItems;
    cachedRaw = raw;
    if (!raw) {
      cachedItems = EMPTY;
      return cachedItems;
    }
    const parsed: unknown = JSON.parse(raw);
    cachedItems = Array.isArray(parsed) ? (parsed as CartLine[]) : EMPTY;
    return cachedItems;
  } catch {
    cachedRaw = null;
    cachedItems = EMPTY;
    return EMPTY;
  }
}

function writeCart(items: CartLine[]) {
  const raw = JSON.stringify(items);
  cachedRaw = raw;
  cachedItems = items.length === 0 ? EMPTY : items;
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // Safari private mode may block storage; in-memory cache still works.
  }
  window.dispatchEvent(new Event("mellizarr-cart"));
}

function subscribe(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener("mellizarr-cart", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("mellizarr-cart", handler);
  };
}

function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    subscribe,
    readCartSnapshot,
    getServerSnapshot,
  );

  const addItem = useCallback(
    (item: Omit<CartLine, "quantity">, quantity = 1) => {
      const prev = readCartSnapshot();
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
    writeCart(readCartSnapshot().filter((line) => line.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    writeCart(
      readCartSnapshot()
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
