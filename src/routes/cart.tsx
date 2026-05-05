import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { AuthGuard } from "@/components/AuthGuard";
import { useCart } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";
import { Minus, Plus, Trash2, ShoppingBag, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  component: () => (
    <AuthGuard>
      <CartPage />
    </AuthGuard>
  ),
});

function CartPage() {
  const { cart, setQty, remove, clear } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [placed, setPlaced] = useState<null | { id: string; payment: string }>(null);
  const items = cart
    .map((c) => ({ ...c, product: PRODUCTS.find((p) => p.id === c.id) }))
    .filter((i) => i.product);

  const subtotal = items.reduce((s, i) => s + (i.product?.price ?? 0) * i.qty, 0);
  const mrp = items.reduce((s, i) => s + (i.product?.mrp ?? 0) * i.qty, 0);
  const discount = mrp - subtotal;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto text-center py-20 px-4">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold mt-4">Your bag is empty</h2>
          <p className="text-muted-foreground mt-2">Add items to it now.</p>
          <Link to="/" className="inline-block mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold">Shop now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-bold">My Bag ({items.length})</h1>
          {items.map((i) => i.product && (
            <div key={`${i.id}-${i.size ?? ""}`} className="flex gap-4 bg-card border border-border rounded-lg p-3">
              <img src={i.product.image} alt={i.product.name} className="w-24 h-32 object-cover rounded-md" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold">{i.product.brand}</h3>
                <p className="text-sm text-muted-foreground truncate">{i.product.name}</p>
                {i.size && <p className="text-xs mt-1">Size: <span className="font-semibold">{i.size}</span></p>}
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-bold">₹{i.product.price}</span>
                  <span className="text-xs text-muted-foreground line-through">₹{i.product.mrp}</span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-border rounded-md">
                    <button onClick={() => setQty(i.id, i.qty - 1, i.size)} className="px-2 py-1 hover:bg-muted"><Minus className="w-3 h-3" /></button>
                    <span className="px-3 text-sm font-semibold">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1, i.size)} className="px-2 py-1 hover:bg-muted"><Plus className="w-3 h-3" /></button>
                  </div>
                  <button onClick={() => remove(i.id, i.size)} className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-lg p-5 h-fit lg:sticky lg:top-24 space-y-4">
          <h3 className="font-bold uppercase text-sm text-muted-foreground">Price Details</h3>
          <div className="flex justify-between text-sm"><span>Total MRP</span><span>₹{mrp}</span></div>
          <div className="flex justify-between text-sm"><span>Discount</span><span style={{ color: "var(--discount)" }}>−₹{discount}</span></div>
          <div className="flex justify-between text-sm"><span>Shipping</span><span style={{ color: "var(--discount)" }}>FREE</span></div>
          <div className="border-t border-border pt-3 flex justify-between font-bold"><span>Total</span><span>₹{subtotal}</span></div>
          <button onClick={() => setShowCheckout(true)} className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:opacity-90 transition">Place Order</button>
        </div>
      </div>

      {showCheckout && !placed && (
        <CheckoutModal
          total={subtotal}
          onClose={() => setShowCheckout(false)}
          onPlace={(payment) => {
            const id = "ORD" + Math.floor(100000 + Math.random() * 900000);
            setPlaced({ id, payment });
            clear();
            setShowCheckout(false);
            toast.success("Order placed successfully!");
          }}
        />
      )}

      {placed && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl max-w-md w-full p-8 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
            <h2 className="text-2xl font-bold">Order Confirmed!</h2>
            <p className="text-muted-foreground">Order ID: <span className="font-semibold text-foreground">{placed.id}</span></p>
            <p className="text-sm text-muted-foreground">Payment: <span className="font-semibold text-foreground">{placed.payment}</span></p>
            <p className="text-sm">Your order will be delivered soon. ⚡ 10-min items will arrive shortly!</p>
            <Link to="/" className="inline-block mt-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckoutModal({ total, onClose, onPlace }: { total: number; onClose: () => void; onPlace: (payment: string) => void }) {
  const [form, setForm] = useState({ name: "", address: "", phone: "", email: "", altPhone: "" });
  const [payment, setPayment] = useState<"COD" | "UPI">("COD");
  const [upiId, setUpiId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.length > 100) e.name = "Enter your name";
    if (!form.address.trim() || form.address.length > 300) e.address = "Enter a valid address";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a 10-digit phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.altPhone && !/^\d{10}$/.test(form.altPhone)) e.altPhone = "Alternate must be 10 digits";
    if (payment === "UPI" && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId)) e.upiId = "Enter a valid UPI ID";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onPlace(payment === "UPI" ? `UPI (${upiId})` : "Cash on Delivery");
  };

  const field = (key: keyof typeof form, label: string, type = "text", maxLength = 100) => (
    <div>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <input
        type={type}
        value={form[key]}
        maxLength={maxLength}
        onChange={(ev) => setForm({ ...form, [key]: ev.target.value })}
        className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {errors[key] && <p className="text-xs text-destructive mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <form onSubmit={submit} className="bg-card rounded-xl max-w-lg w-full p-6 space-y-4 my-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Delivery & Payment</h2>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">×</button>
        </div>

        {field("name", "Full Name *")}
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Address *</label>
          <textarea
            value={form.address}
            maxLength={300}
            onChange={(ev) => setForm({ ...form, address: ev.target.value })}
            rows={2}
            className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {field("phone", "Phone *", "tel", 10)}
          {field("altPhone", "Alternate Phone", "tel", 10)}
        </div>
        {field("email", "Email *", "email", 255)}

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-2">Payment Method *</label>
          <div className="grid grid-cols-2 gap-2">
            {(["COD", "UPI"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPayment(p)}
                className={`py-2.5 rounded-md text-sm font-semibold border transition ${
                  payment === p ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary"
                }`}
              >
                {p === "COD" ? "Cash on Delivery" : "UPI"}
              </button>
            ))}
          </div>
          {payment === "UPI" && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                maxLength={50}
                onChange={(ev) => setUpiId(ev.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.upiId && <p className="text-xs text-destructive mt-1">{errors.upiId}</p>}
            </div>
          )}
        </div>

        <div className="border-t border-border pt-3 flex justify-between font-bold">
          <span>Total Payable</span><span>₹{total}</span>
        </div>

        <button type="submit" className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:opacity-90 transition">
          Confirm Order
        </button>
      </form>
    </div>
  );
}
