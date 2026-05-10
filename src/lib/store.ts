import { useEffect, useState, useCallback, useMemo } from "react";

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

export type Product = {
  id: string;
  name: string;
  price: number;
  mrp: number;
  brand: string;
  image: string;
  category: "men" | "women" | "kids";
  subcategory: string;
  fastDelivery?: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  createdAt: string;
};

export type OrderItem = { id: string; qty: number; size?: string };
export type OrderStatus = "placed" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  payment: string;
  status: OrderStatus;
  shippingAddress: {
    name: string;
    address: string;
    phone: string;
    email: string;
    altPhone?: string;
  };
  createdAt: string;
};

export type CartItem = { id: string; qty: number; size?: string };

const keyOf = (i: { id: string; size?: string }) => `${i.id}__${i.size ?? ""}`;

export function useCart() {
  const [cart, setCart] = useLocalState<CartItem[]>("myntra:cart", []);
  const add = (id: string, size?: string) =>
    setCart((prev) => {
      const k = keyOf({ id, size });
      const found = prev.find((i) => keyOf(i) === k);
      if (found) return prev.map((i) => (keyOf(i) === k ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { id, qty: 1, size }];
    });
  const remove = (id: string, size?: string) =>
    setCart((prev) => prev.filter((i) => keyOf(i) !== keyOf({ id, size })));
  const setQty = (id: string, qty: number, size?: string) =>
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => keyOf(i) !== keyOf({ id, size }))
        : prev.map((i) => (keyOf(i) === keyOf({ id, size }) ? { ...i, qty } : i))
    );
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const clear = () => setCart([]);
  return { cart, add, remove, setQty, count, clear };
}

const CLOTHING_SUBS = new Set([
  "Shirts", "T-Shirts", "Jeans", "Jackets",
  "Dresses", "Tops", "Sarees", "Kurtas",
  "Clothing", "Sportswear",
]);
export const hasSizes = (subcategory: string) => CLOTHING_SUBS.has(subcategory);
export const SIZES = ["S", "M", "L", "XL"] as const;

export function useTheme() {
  const [theme, setTheme] = useLocalState<"light" | "dark">("myntra:theme", "light");
  useEffect(() => {
    if (!isBrowser) return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);
  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");
  return { theme, toggle, setTheme };
}

export function useAdmin() {
  const [admin, setAdmin] = useLocalState<boolean>("myntra:admin", false);
  return {
    admin,
    loginAdmin: (u: string, p: string) => {
      if (u === "admin" && p === "admin123") { setAdmin(true); return true; }
      return false;
    },
    logoutAdmin: () => setAdmin(false),
  };
}

export function useWishlist() {
  const [list, setList] = useLocalState<string[]>("myntra:wishlist", []);
  const toggle = (id: string) =>
    setList((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  const has = (id: string) => list.includes(id);
  return { list, toggle, has };
}

export function useUsers() {
  const [rawUsers, setRawUsers] = useLocalState<User[]>("myntra:users", []);
  const users = useMemo(() => {
    const seen = new Set<string>();
    return rawUsers.filter(user => {
      const email = user.email.toLowerCase();
      if (seen.has(email)) return false;
      seen.add(email);
      return true;
    });
  }, [rawUsers]);

  const findUserByEmail = (email: string) => rawUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
  const authenticateUser = (email: string, password: string) => {
    const user = findUserByEmail(email);
    return user && user.password === password ? user : null;
  };

  const addUser = (userData: Omit<User, "id" | "createdAt">) => {
    const existing = findUserByEmail(userData.email);
    if (existing) {
      const updated = { ...existing, ...userData };
      setRawUsers((prev) => prev.map((user) => (user.id === existing.id ? updated : user)));
      return updated;
    }
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRawUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (updated: User) => {
    setRawUsers((prev) => prev.map((user) => (user.id === updated.id ? updated : user)));
  };

  const deleteUser = (id: string) => {
    setRawUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return { users, findUserByEmail, authenticateUser, addUser, updateUser, deleteUser };
}

export function useAuth() {
  const { addUser, updateUser, findUserByEmail, authenticateUser } = useUsers();
  const [user, setUser] = useLocalState<User | null>("myntra:user", null);

  const login = (email: string, password: string) => {
    const existing = authenticateUser(email, password);
    if (!existing) return null;
    setUser(existing);
    return existing;
  };

  const signup = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const existing = findUserByEmail(userData.email);
    if (existing) return null;
    const nextUser = addUser(userData);
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => setUser(null);
  const updateProfile = (updates: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    if (user) {
      const nextUser = { ...user, ...updates };
      setUser(nextUser);
      updateUser(nextUser);
    }
  };
  return { user, login, signup, logout, updateProfile };
}

export function useOrders() {
  const [rawOrders, setRawOrders] = useLocalState<Order[]>("myntra:orders", []);
  const orders = useMemo(() => {
    const seen = new Set<string>();
    return rawOrders.filter(order => {
      if (seen.has(order.id)) return false;
      seen.add(order.id);
      return true;
    });
  }, [rawOrders]);

  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: "ORD" + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
    };
    setRawOrders(prev => [...prev, newOrder]);
    return newOrder.id;
  };
  const getUserOrders = (userId: string) => orders.filter(order => order.userId === userId);
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setRawOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
  };
  return { orders, addOrder, getUserOrders, updateOrderStatus };
}

export function useProducts() {
  const [rawProducts, setRawProducts] = useLocalState<Product[]>("myntra:customProducts", []);
  const customProducts = useMemo(() => {
    const seen = new Set<string>();
    return rawProducts.filter(product => {
      if (seen.has(product.id)) return false;
      seen.add(product.id);
      return true;
    });
  }, [rawProducts]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `custom_${Date.now()}`,
    };
    setRawProducts(prev => [...prev, newProduct]);
    return newProduct.id;
  };
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setRawProducts(prev => prev.map(product =>
      product.id === id ? { ...product, ...updates } : product
    ));
  };
  const deleteProduct = (id: string) => {
    setRawProducts(prev => prev.filter(product => product.id !== id));
  };
  return { customProducts, addProduct, updateProduct, deleteProduct };
}
