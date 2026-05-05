import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/store";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { Shield, LogOut, Package, Users, ShoppingBag, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { admin, logoutAdmin } = useAdmin();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const t = setTimeout(() => setHydrated(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (hydrated && !admin) navigate({ to: "/admin/login" });
  }, [hydrated, admin, navigate]);

  if (!hydrated || !admin) return null;

  const filtered = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
  const totalValue = PRODUCTS.reduce((s, p) => s + p.price, 0);

  const stats = [
    { label: "Total Products", value: PRODUCTS.length, icon: Package, color: "text-blue-600" },
    { label: "Categories", value: Object.keys(CATEGORIES).length, icon: ShoppingBag, color: "text-purple-600" },
    { label: "Avg. Price", value: `₹${Math.round(totalValue / PRODUCTS.length)}`, icon: TrendingUp, color: "text-green-600" },
    { label: "Brands", value: new Set(PRODUCTS.map((p) => p.brand)).size, icon: Users, color: "text-orange-600" },
  ];

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
            <button onClick={() => { logoutAdmin(); navigate({ to: "/admin/login" }); }} className="flex items-center gap-2 text-sm font-semibold text-destructive hover:opacity-80">
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

        <div className="mt-10">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold">Product Inventory</h2>
            <div className="flex gap-2">
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
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 50).map((p) => (
                    <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-4 py-2"><img src={p.image} alt={p.name} className="w-12 h-14 object-cover rounded" /></td>
                      <td className="px-4 py-3 max-w-xs truncate">{p.name}</td>
                      <td className="px-4 py-3 font-semibold">{p.brand}</td>
                      <td className="px-4 py-3 capitalize"><span className="px-2 py-0.5 rounded-full bg-muted text-xs">{p.category} · {p.subcategory}</span></td>
                      <td className="px-4 py-3 font-bold">₹{p.price}</td>
                      <td className="px-4 py-3 text-muted-foreground line-through">₹{p.mrp}</td>
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
    </div>
  );
}
