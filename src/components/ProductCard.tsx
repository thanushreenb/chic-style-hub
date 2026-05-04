import { Heart, ShoppingBag, Zap } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart, useWishlist } from "@/lib/store";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="group bg-card rounded-lg overflow-hidden border border-border/50 transition-all duration-300 hover:shadow-[var(--shadow-hover)] hover:-translate-y-1">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={() => {
            toggle(product.id);
            toast(wished ? "Removed from wishlist" : "Added to wishlist ❤️");
          }}
          aria-label="wishlist"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/95 backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          <Heart className={`w-4 h-4 ${wished ? "fill-primary text-primary" : "text-foreground"}`} />
        </button>
        <button
          onClick={() => {
            add(product.id);
            toast.success("Added to bag");
          }}
          className="absolute bottom-0 inset-x-0 bg-primary text-primary-foreground text-sm font-semibold py-2.5 translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" /> Add to Bag
        </button>
      </div>
        {product.fastDelivery && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow">
            <Zap className="w-3 h-3 fill-black" /> 10 MIN
          </span>
        )}
      </div>
      <div className="p-3 space-y-1">
        <h3 className="font-bold text-sm truncate">{product.brand}</h3>
        <p className="text-xs text-muted-foreground truncate">{product.name}</p>
        {product.fastDelivery && (
          <p className="text-[11px] font-semibold text-yellow-600 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Delivery in 10 minutes
          </p>
        )}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-bold text-sm">₹{product.price}</span>
          <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
          <span className="text-xs font-semibold" style={{ color: "var(--discount)" }}>({off}% OFF)</span>
        </div>
      </div>
    </div>
  );
}
