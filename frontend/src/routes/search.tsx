import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { AuthGuard } from "@/components/AuthGuard";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/search")({
  validateSearch: z.object({ q: z.string().optional().default("") }),
  component: () => (
    <AuthGuard>
      <SearchPage />
    </AuthGuard>
  ),
});

function SearchPage() {
  const { q } = Route.useSearch();
  const query = q.toLowerCase().trim();
  const items = query
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.subcategory.toLowerCase().includes(query) ||
          p.category.includes(query)
      )
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Search results for "{q}"</h1>
        <p className="text-sm text-muted-foreground mt-1">{items.length} products found</p>
        {items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="text-center py-20 text-muted-foreground">No products match your search. Try different keywords.</p>
        )}
      </div>
    </div>
  );
}
