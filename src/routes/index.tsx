import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { AuthGuard } from "@/components/AuthGuard";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/")({
  component: () => (
    <AuthGuard>
      <Home />
    </AuthGuard>
  ),
});

const HERO_IMG = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=600&fit=crop&auto=format";

function Home() {
  const trending = PRODUCTS.slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative h-[280px] md:h-[420px] overflow-hidden">
        <img src={HERO_IMG} alt="Fashion sale" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, oklch(0 0 0 / 0.6) 0%, oklch(0 0 0 / 0.2) 100%)" }} />
        <div className="relative max-w-7xl mx-auto h-full flex items-center px-6">
          <div className="text-white max-w-xl">
            <p className="text-sm font-semibold tracking-widest uppercase opacity-90">End of season sale</p>
            <h1 className="text-4xl md:text-6xl font-extrabold mt-2 leading-tight">Up to 70% off on top brands</h1>
            <Link to="/category/$cat" params={{ cat: "women" }} className="inline-block mt-6 bg-primary text-primary-foreground px-7 py-3 rounded-md font-semibold hover:opacity-90 transition">Shop Now</Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map((c) => {
            const sample = PRODUCTS.find((p) => p.category === c)!;
            return (
              <Link key={c} to="/category/$cat" params={{ cat: c }} className="group relative aspect-[4/5] md:aspect-[3/4] rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition">
                <img src={sample.image} alt={CATEGORIES[c].label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 text-white">
                  <h3 className="text-xl md:text-3xl font-extrabold uppercase">{CATEGORIES[c].label}</h3>
                  <p className="text-xs md:text-sm opacity-90 mt-1">{CATEGORIES[c].subcategories.join(" • ")}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {trending.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <footer className="bg-card border-t border-border mt-10 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Myntrah. Built with ❤️ for fashion lovers.
      </footer>
    </div>
  );
}
