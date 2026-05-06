import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { AuthGuard } from "@/components/AuthGuard";
import { useWishlist } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  component: () => (
    <AuthGuard>
      <WishlistPage />
    </AuthGuard>
  ),
});

function WishlistPage() {
  const { list } = useWishlist();
  const items = PRODUCTS.filter((p) => list.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">My Wishlist ({items.length})</h1>
        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No items in your wishlist yet</p>
            <Link to="/" className="inline-block mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold">Discover products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
