import { useEffect, useState, useCallback } from "react";

const isBrowser = typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("myntra:storage", { detail: key }));
}

export function useLocalState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);

  useEffect(() => {
    setState(read(key, initial));
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail === key) setState(read(key, initial));
    };
    window.addEventListener("myntra:storage", handler);
    return () => window.removeEventListener("myntra:storage", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (v: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        write(key, next);
        return next;
      });
    },
    [key]
  );

  return [state, update];
}

export type CartItem = { id: string; qty: number };

export function useCart() {
  const [cart, setCart] = useLocalState<CartItem[]>("myntra:cart", []);
  const add = (id: string) =>
    setCart((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { id, qty: 1 }];
    });
  const remove = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const setQty = (id: string, qty: number) =>
    setCart((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i))));
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const clear = () => setCart([]);
  return { cart, add, remove, setQty, count, clear };
}

export function useWishlist() {
  const [list, setList] = useLocalState<string[]>("myntra:wishlist", []);
  const toggle = (id: string) =>
    setList((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  const has = (id: string) => list.includes(id);
  return { list, toggle, has };
}

export function useAuth() {
  const [user, setUser] = useLocalState<string | null>("myntra:user", null);
  const login = (name: string) => setUser(name);
  const logout = () => setUser(null);
  return { user, login, logout };
}
