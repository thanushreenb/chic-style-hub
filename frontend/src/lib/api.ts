const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type OrderStatus = "placed" | "confirmed" | "shipped" | "delivered" | "cancelled";

type OrderItem = { id: string; qty: number; size?: string };

type ShippingAddress = { name: string; address: string; phone: string; email: string; altPhone?: string };

type OrderResponse = {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  payment: string;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  createdAt: string;
};

function getHeaders(token?: string | null) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message || response.statusText || "Request failed";
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  signup: (payload: { name: string; email: string; password: string; phone: string; address: string }) =>
    request<{
      user: { id: string; name: string; email: string; phone: string; address: string; isAdmin: boolean; createdAt: string };
      token: string;
    }>("/api/auth/signup", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{
      user: { id: string; name: string; email: string; phone: string; address: string; isAdmin: boolean; createdAt: string };
      token: string;
    }>("/api/auth/login", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }),

  adminLogin: (payload: { email: string; password: string }) =>
    request<{
      user: { id: string; name: string; email: string; isAdmin: boolean };
      token: string;
    }>("/api/admin/login", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }),

  getProfile: (token: string) =>
    request<{ id: string; name: string; email: string; phone: string; address: string; isAdmin: boolean; createdAt: string }>("/api/users/me", {
      headers: getHeaders(token),
    }),

  updateProfile: (payload: Partial<{ name: string; email: string; password: string; phone: string; address: string }>, token: string) =>
    request<{ id: string; name: string; email: string; phone: string; address: string; isAdmin: boolean; createdAt: string }>("/api/users/me", {
      method: "PUT",
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    }),

  getOrders: (token: string) =>
    request<OrderResponse[]>("/api/orders", {
      headers: getHeaders(token),
    }),

  createOrder: (
    payload: {
      items: OrderItem[];
      total: number;
      payment: string;
      shippingAddress: ShippingAddress;
    },
    token: string
  ) =>
    request<OrderResponse>("/api/orders", {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    }),

  updateOrderStatus: (orderId: string, status: OrderStatus, token: string) =>
    request<OrderResponse>(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: getHeaders(token),
      body: JSON.stringify({ status }),
    }),

  getUsers: (token: string) =>
    request<Array<{ id: string; name: string; email: string; phone: string; address: string; createdAt: string }>>("/api/users", {
      headers: getHeaders(token),
    }),

  deleteUser: (userId: string, token: string) =>
    request<{ message: string }>(`/api/users/${userId}`, {
      method: "DELETE",
      headers: getHeaders(token),
    }),
};
