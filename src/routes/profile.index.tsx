import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth, useOrders } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";
import { User, Package, MapPin, Phone, Mail, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile/")({
  component: () => (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  ),
});

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { getUserOrders, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  if (!user) return null;

  const userOrders = getUserOrders(user.id);

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setEditing(false);
    toast.success("Profile updated successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed": return "text-blue-600 bg-blue-50";
      case "confirmed": return "text-purple-600 bg-purple-50";
      case "shipped": return "text-orange-600 bg-orange-50";
      case "delivered": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex gap-1 mb-6 border-b border-border">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "orders", label: "Order History", icon: Package },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-semibold transition ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Personal Information</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-primary hover:opacity-80"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded text-sm"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setEditForm({
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        address: user.address,
                      });
                    }}
                    className="flex items-center gap-2 border border-border px-3 py-1 rounded text-sm hover:bg-muted"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                  />
                ) : (
                  <p className="mt-1 text-foreground">{user.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground">Email</label>
                {editing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                  />
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{user.email}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground">Phone</label>
                {editing ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                  />
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{user.phone}</p>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-muted-foreground">Address</label>
                {editing ? (
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    rows={3}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                  />
                ) : (
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <p className="text-foreground">{user.address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Order History ({userOrders.length})</h2>

            {userOrders.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">Start shopping to see your order history here.</p>
                <Link to="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:opacity-90">
                  Start Shopping
                </Link>
              </div>
            ) : (
              userOrders.map((order) => (
                <div key={order.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Order #{order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <p className="text-sm font-bold mt-1">₹{order.total}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {order.items.slice(0, 3).map((item, index) => {
                      const product = PRODUCTS.find(p => p.id === item.id);
                      return product ? (
                        <div key={index} className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                          </div>
                        </div>
                      ) : null;
                    })}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center text-sm text-muted-foreground">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Payment: <span className="font-semibold">{order.payment}</span></span>
                      <span>Total: <span className="font-bold">₹{order.total}</span></span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}