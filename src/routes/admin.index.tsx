import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAdmin, useProducts, useOrders, useUsers, useTheme } from "@/lib/store";
import { useAllProducts, CATEGORIES, type Product } from "@/lib/products";
import { Shield, LogOut, Package, Users, ShoppingBag, TrendingUp, Plus, Edit, Trash2, Sun, Moon } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { admin, logoutAdmin } = useAdmin();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const allProducts = useAllProducts();
  const { addProduct, updateProduct, deleteProduct } = useProducts();
  const { users, deleteUser } = useUsers();
  const { orders, updateOrderStatus } = useOrders();

  useEffect(() => {
    const t = setTimeout(() => setHydrated(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (hydrated && !admin) navigate({ to: "/admin/login" });
  }, [hydrated, admin, navigate]);

  const filtered = useMemo(
    () => (filter === "all" ? allProducts : allProducts.filter((p) => p.category === filter)),
    [allProducts, filter]
  );

  const ordersByUser = useMemo(
    () => orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.userId] = (acc[order.userId] ?? 0) + 1;
      return acc;
    }, {}),
    [orders]
  );

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8),
    [orders]
  );

  const totalValue = useMemo(() => allProducts.reduce((sum, p) => sum + p.price, 0), [allProducts]);

  const stats = [
    { label: "Total Products", value: allProducts.length, icon: Package, color: "text-blue-600" },
    { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "text-teal-600" },
    { label: "Total Customers", value: users.length, icon: Users, color: "text-purple-600" },
    { label: "Avg. Price", value: allProducts.length ? `₹${Math.round(totalValue / allProducts.length)}` : "₹0", icon: TrendingUp, color: "text-green-600" },
  ];

  if (!hydrated || !admin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-primary">View Store</Link>
            <button
              onClick={() => {
                logoutAdmin();
                navigate({ to: "/admin/login" });
              }}
              className="flex items-center gap-2 text-sm font-semibold text-destructive hover:opacity-80"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold">Welcome, Admin</h1>
        <p className="text-muted-foreground mt-1">Manage your store inventory and view stats</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground">{s.label}</span>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-2xl font-extrabold mt-2">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <section className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Customer Accounts</h2>
                <p className="text-sm text-muted-foreground">Review registered users and their order counts.</p>
              </div>
              <span className="text-sm text-muted-foreground">{users.length} customers</span>
            </div>
            {users.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No customers have signed up yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Name</th>
                      <th className="text-left px-4 py-3 font-semibold">Email</th>
                      <th className="text-left px-4 py-3 font-semibold">Phone</th>
                      <th className="text-left px-4 py-3 font-semibold">Orders</th>
                      <th className="text-left px-4 py-3 font-semibold">Joined</th>
                      <th className="text-left px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-t border-border hover:bg-muted/30">
                        <td className="px-4 py-3 font-semibold">{user.name}</td>
                        <td className="px-4 py-3 truncate">{user.email}</td>
                        <td className="px-4 py-3">{user.phone}</td>
                        <td className="px-4 py-3">{ordersByUser[user.id] ?? 0}</td>
                        <td className="px-4 py-3 text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              if (confirm(`Delete user ${user.name}?`)) {
                                deleteUser(user.id);
                              }
                            }}
                            className="px-2 py-1 rounded-md text-sm text-red-600 border border-red-200 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Recent Orders</h2>
                <p className="text-sm text-muted-foreground">Track the latest purchases and status updates.</p>
              </div>
              <span className="text-sm text-muted-foreground">{orders.length} total</span>
            </div>
            {orders.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No orders have been placed yet.</div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const customer = users.find((user) => user.id === order.userId);
                  const nextStatus = order.status === "placed" ? "confirmed" : order.status === "confirmed" ? "shipped" : order.status === "shipped" ? "delivered" : order.status;
                  return (
                    <div key={order.id} className="border border-border rounded-xl p-4 bg-background">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                          <h3 className="font-semibold">{customer?.name ?? "Unknown customer"}</h3>
                          <p className="text-sm text-muted-foreground truncate">{customer?.email ?? order.shippingAddress.email}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide ${
                            order.status === "placed" ? "text-blue-600 bg-blue-50" :
                            order.status === "confirmed" ? "text-purple-600 bg-purple-50" :
                            order.status === "shipped" ? "text-orange-600 bg-orange-50" :
                            order.status === "delivered" ? "text-green-600 bg-green-50" :
                            "text-red-600 bg-red-50"
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-sm font-semibold">₹{order.total}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()} · {new Date(order.createdAt).toLocaleTimeString()}</p>
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.id, nextStatus as any)}
                          disabled={order.status === "delivered" || order.status === "cancelled"}
                          className="rounded-full border border-border px-3 py-1 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {order.status === "delivered" || order.status === "cancelled" ? "Complete" : `Move to ${nextStatus}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold">Product Inventory</h2>
            <div className="flex gap-2 flex-wrap">
              {["all", "men", "women", "kids"].map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition ${
                    filter === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"
                  }`}
                >
                  {c}
                </button>
              ))}
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowAddForm(true);
                }}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-600 text-white border border-green-600 hover:bg-green-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Product
              </button>
            </div>
          </div>

          <div className="mt-4 bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Image</th>
                    <th className="text-left px-4 py-3 font-semibold">Product</th>
                    <th className="text-left px-4 py-3 font-semibold">Brand</th>
                    <th className="text-left px-4 py-3 font-semibold">Category</th>
                    <th className="text-left px-4 py-3 font-semibold">Price</th>
                    <th className="text-left px-4 py-3 font-semibold">MRP</th>
                    <th className="text-left px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 50).map((p) => (
                    <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-4 py-2">
                        <img src={p.image} alt={p.name} className="w-12 h-14 object-cover rounded" />
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate">{p.name}</td>
                      <td className="px-4 py-3 font-semibold">{p.brand}</td>
                      <td className="px-4 py-3 capitalize">
                        <span className="px-2 py-0.5 rounded-full bg-muted text-xs">{p.category} · {p.subcategory}</span>
                      </td>
                      <td className="px-4 py-3 font-bold">₹{p.price}</td>
                      <td className="px-4 py-3 text-muted-foreground line-through">₹{p.mrp}</td>
                      <td className="px-4 py-3">
                        {p.id.startsWith("custom_") && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p.id);
                                setShowAddForm(true);
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this product?")) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length > 50 && (
              <div className="px-4 py-3 text-xs text-muted-foreground border-t border-border">Showing first 50 of {filtered.length} products</div>
            )}
          </div>
        </div>
      </div>

      {showAddForm && (
        <ProductForm
          productId={editingProduct}
          onClose={() => {
            setShowAddForm(false);
            setEditingProduct(null);
          }}
          onSave={(productData) => {
            if (editingProduct) {
              updateProduct(editingProduct, productData);
            } else {
              addProduct(productData);
            }
            setShowAddForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

interface ProductFormProps {
  productId: string | null;
  onClose: () => void;
  onSave: (product: Omit<Product, "id">) => void;
}

function ProductForm({ productId, onClose, onSave }: ProductFormProps) {
  const allProducts = useAllProducts();
  const existingProduct = useMemo(
    () => (productId ? allProducts.find((p) => p.id === productId) : null),
    [allProducts, productId]
  );

  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: 0,
    mrp: 0,
    image: "",
    category: "men" as Product["category"],
    subcategory: "",
    fastDelivery: false,
  });

  useEffect(() => {
    if (existingProduct) {
      setForm({
        name: existingProduct.name,
        brand: existingProduct.brand,
        price: existingProduct.price,
        mrp: existingProduct.mrp,
        image: existingProduct.image,
        category: existingProduct.category,
        subcategory: existingProduct.subcategory,
        fastDelivery: existingProduct.fastDelivery ?? false,
      });
    } else {
      setForm((prev) => ({ ...prev, name: "", brand: "", price: 0, mrp: 0, image: "", category: "men", subcategory: "", fastDelivery: false }));
    }
  }, [existingProduct]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.brand.trim()) e.brand = "Brand is required";
    if (form.price <= 0) e.price = "Price must be greater than 0";
    if (form.mrp <= 0) e.mrp = "MRP must be greater than 0";
    if (form.price > form.mrp) e.price = "Price cannot be greater than MRP";
    if (!form.image.trim()) e.image = "Image URL is required";
    if (!form.subcategory.trim()) e.subcategory = "Subcategory is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  const getSubcategories = (category: Product["category"]) => CATEGORIES[category].subcategories;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold">{productId ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">×</button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Product Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold">Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Enter brand"
              />
              {errors.brand && <p className="text-xs text-red-600 mt-1">{errors.brand}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                min={0}
              />
              {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold">MRP (₹)</label>
              <input
                type="number"
                value={form.mrp}
                onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                min={0}
              />
              {errors.mrp && <p className="text-xs text-red-600 mt-1">{errors.mrp}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Image URL</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && <p className="text-xs text-red-600 mt-1">{errors.image}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Product["category"], subcategory: "" })}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold">Subcategory</label>
              <select
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="">Select subcategory</option>
                {getSubcategories(form.category).map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
              {errors.subcategory && <p className="text-xs text-red-600 mt-1">{errors.subcategory}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="fastDelivery"
              type="checkbox"
              checked={form.fastDelivery}
              onChange={(e) => setForm({ ...form, fastDelivery: e.target.checked })}
              className="h-4 w-4"
            />
            <label htmlFor="fastDelivery" className="text-sm">Fast Delivery Available</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-border rounded-md hover:bg-muted">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90">
              {productId ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
