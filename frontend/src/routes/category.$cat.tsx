import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { AuthGuard } from "@/components/AuthGuard";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/category/$cat")({
  component: () => (
    <AuthGuard>
      <CategoryPage />
    </AuthGuard>
  ),
  loader: ({ params }) => {
    if (!(params.cat in CATEGORIES)) throw notFound();
    return { cat: params.cat as keyof typeof CATEGORIES };
  },
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const meta = CATEGORIES[cat as keyof typeof CATEGORIES];
  const [active, setActive] = useState<string>("All");

  const items = PRODUCTS.filter((p) => p.category === cat && (active === "All" || p.subcategory === active));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold capitalize">{meta.label}'s Fashion</h1>
        <p className="text-sm text-muted-foreground mt-1">{items.length} products</p>

        <div className="flex flex-wrap gap-2 mt-6">
          {["All", ...meta.subcategories].map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                active === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
