import { useEffect, useState, useCallback, useMemo } from "react";
import { api } from "./api";

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
  password?: string;
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

export function useAdmin() {
  const [admin, setAdmin] = useLocalState<boolean>("myntra:admin", false);
  const [adminToken, setAdminToken] = useLocalState<string | null>("myntra:adminToken", null);

  const loginAdmin = async (email: string, password: string) => {
    try {
      const response = await api.adminLogin({ email, password });
      setAdmin(true);
      setAdminToken(response.token);
      return true;
    } catch {
      return false;
    }
  };

  const logoutAdmin = () => {
    setAdmin(false);
    setAdminToken(null);
  };

  return { admin, adminToken, loginAdmin, logoutAdmin };
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
  const [adminToken] = useLocalState<string | null>("myntra:adminToken", null);

  useEffect(() => {
    if (!adminToken) return;
    api.getUsers(adminToken)
      .then((users) => setRawUsers(users))
      .catch(() => {
        /* ignore failed admin fetch */
      });
  }, [adminToken]);

  const users = useMemo(() => {
    const seen = new Set<string>();
    return rawUsers.filter((user) => {
      const email = user.email.toLowerCase();
      if (seen.has(email)) return false;
      seen.add(email);
      return true;
    });
  }, [rawUsers]);

  const findUserByEmail = (email: string) => rawUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());

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

  const deleteUser = async (id: string) => {
    if (adminToken) {
      try {
        await api.deleteUser(id, adminToken);
      } catch {
        // ignore backend delete failure and still remove locally
      }
    }
    setRawUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return { users, findUserByEmail, addUser, updateUser, deleteUser };
}

export function useAuth() {
  const [user, setUser] = useLocalState<User | null>("myntra:user", null);
  const [token, setToken] = useLocalState<string | null>("myntra:token", null);

  useEffect(() => {
    if (!token || user) return;
    let cancelled = false;
    api.getProfile(token)
      .then((profile) => {
        if (!cancelled) setUser(profile);
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setToken(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token, user, setToken]);

  const login = async (email: string, password: string) => {
    try {
      const result = await api.login({ email, password });
      setToken(result.token);
      setUser(result.user);
      return result.user;
    } catch {
      return null;
    }
  };

  const signup = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const result = await api.signup(userData as any);
      setToken(result.token);
      setUser(result.user);
      return result.user;
    } catch {
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (updates: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    if (!token || !user) return;
    try {
      const nextUser = await api.updateProfile(updates, token);
      setUser(nextUser);
      return nextUser;
    } catch {
      return null;
    }
  };

  return { user, token, login, signup, logout, updateProfile };
}

export function useOrders() {
  const [rawOrders, setRawOrders] = useLocalState<Order[]>("myntra:orders", []);
  const [token] = useLocalState<string | null>("myntra:token", null);
  const [adminToken] = useLocalState<string | null>("myntra:adminToken", null);
  const authToken = adminToken || token;

  useEffect(() => {
    if (!authToken) return;
    api.getOrders(authToken)
      .then((orders) => setRawOrders(orders as Order[]))
      .catch(() => {
        /* ignore failed order refresh */
      });
  }, [authToken]);

  const orders = useMemo(() => {
    const seen = new Set<string>();
    return rawOrders.filter(order => {
      if (seen.has(order.id)) return false;
      seen.add(order.id);
      return true;
    });
  }, [rawOrders]);

  const addOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
    if (!token) {
      throw new Error("Not authenticated");
    }
    const newOrder = await api.createOrder(order as any, token) as Order;
    setRawOrders(prev => [newOrder, ...prev]);
    return newOrder.id;
  };

  const getUserOrders = (userId: string) => orders.filter(order => order.userId === userId);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!authToken) return;
    try {
      const updated = await api.updateOrderStatus(orderId, status, authToken) as Order;
      setRawOrders(prev => prev.map(order => order.id === updated.id ? updated : order));
    } catch {
      // ignore status update failure
    }
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
