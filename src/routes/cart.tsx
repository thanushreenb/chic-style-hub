import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { AuthGuard } from "@/components/AuthGuard";
import { useCart } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({
  component: () => (
    <AuthGuard>
      <CartPage />
    </AuthGuard>
  ),
});

function CartPage() {
  const { cart, setQty, remove } = useCart();
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
            <div key={i.id} className="flex gap-4 bg-card border border-border rounded-lg p-3">
              <img src={i.product.image} alt={i.product.name} className="w-24 h-32 object-cover rounded-md" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold">{i.product.brand}</h3>
                <p className="text-sm text-muted-foreground truncate">{i.product.name}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-bold">₹{i.product.price}</span>
                  <span className="text-xs text-muted-foreground line-through">₹{i.product.mrp}</span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-border rounded-md">
                    <button onClick={() => setQty(i.id, i.qty - 1)} className="px-2 py-1 hover:bg-muted"><Minus className="w-3 h-3" /></button>
                    <span className="px-3 text-sm font-semibold">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} className="px-2 py-1 hover:bg-muted"><Plus className="w-3 h-3" /></button>
                  </div>
                  <button onClick={() => remove(i.id)} className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1">
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
          <button className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:opacity-90 transition">Place Order</button>
        </div>
      </div>
    </div>
  );
}
