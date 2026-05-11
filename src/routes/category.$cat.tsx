import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { AuthGuard } from "@/components/AuthGuard";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

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

type SortKey = "popular" | "new" | "priceLow" | "priceHigh" | "discount";

const SORT_LABELS: Record<SortKey, string> = {
  popular: "Recommended",
  new: "What's New",
  priceLow: "Price: Low to High",
  priceHigh: "Price: High to Low",
  discount: "Better Discount",
};

const PRICE_BUCKETS = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
  { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
  { label: "Above ₹5000", min: 5000, max: Infinity },
];

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const meta = CATEGORIES[cat as keyof typeof CATEGORIES];

  const all = useMemo(() => PRODUCTS.filter((p) => p.category === cat), [cat]);
  const allBrands = useMemo(() => Array.from(new Set(all.map((p) => p.brand))).sort(), [all]);
  const allColors = useMemo(
    () => Array.from(new Set(all.map((p) => p.color).filter(Boolean) as string[])).sort(),
    [all]
  );
  const allSizes = useMemo(
    () => Array.from(new Set(all.flatMap((p) => p.sizes ?? []))).sort(),
    [all]
  );

  const [sub, setSub] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("popular");
  const [sortOpen, setSortOpen] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [priceIdx, setPriceIdx] = useState<number[]>([]);
  const [minDisc, setMinDisc] = useState(0);
  const [fastOnly, setFastOnly] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [mobileFilters, setMobileFilters] = useState(false);

  const toggle = <T,>(arr: T[], v: T) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const filtered = useMemo(() => {
    let list = all;
    if (sub !== "All") list = list.filter((p) => p.subcategory === sub);
    if (brands.length) list = list.filter((p) => brands.includes(p.brand));
    if (priceIdx.length)
      list = list.filter((p) =>
        priceIdx.some((i) => p.price >= PRICE_BUCKETS[i].min && p.price < PRICE_BUCKETS[i].max)
      );
    if (minDisc > 0)
      list = list.filter((p) => Math.round(((p.mrp - p.price) / p.mrp) * 100) >= minDisc);
    if (fastOnly) list = list.filter((p) => p.fastDelivery);
    if (colors.length) list = list.filter((p) => p.color && colors.includes(p.color));
    if (sizes.length) list = list.filter((p) => (p.sizes ?? []).some((s) => sizes.includes(s)));
    if (minRating > 0) list = list.filter((p) => (p.rating ?? 0) >= minRating);

    const sorted = [...list];
    if (sort === "priceLow") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "priceHigh") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "discount")
      sorted.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp);
    else if (sort === "new") sorted.reverse();
    return sorted;
  }, [all, sub, brands, priceIdx, minDisc, fastOnly, colors, sizes, minRating, sort]);

  const clearAll = () => {
    setBrands([]); setPriceIdx([]); setMinDisc(0); setFastOnly(false);
    setColors([]); setSizes([]); setMinRating(0);
  };
  const activeCount =
    brands.length + priceIdx.length + (minDisc > 0 ? 1 : 0) + (fastOnly ? 1 : 0) +
    colors.length + sizes.length + (minRating > 0 ? 1 : 0);

  const FiltersPanel = (
    <aside className="space-y-6 text-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold uppercase text-xs tracking-wider">Filters</h3>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-primary text-xs font-semibold hover:underline">
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Categories">
        {["All", ...meta.subcategories].map((s) => (
          <label key={s} className="flex items-center gap-2 cursor-pointer hover:text-primary">
            <input type="radio" name="sub" checked={sub === s} onChange={() => setSub(s)} className="accent-primary" />
            <span>{s}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title={`Brand (${allBrands.length})`}>
        <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
          {allBrands.map((b) => (
            <label key={b} className="flex items-center gap-2 cursor-pointer hover:text-primary">
              <input type="checkbox" checked={brands.includes(b)} onChange={() => setBrands(toggle(brands, b))} className="accent-primary" />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price">
        {PRICE_BUCKETS.map((p, i) => (
          <label key={p.label} className="flex items-center gap-2 cursor-pointer hover:text-primary">
            <input type="checkbox" checked={priceIdx.includes(i)} onChange={() => setPriceIdx(toggle(priceIdx, i))} className="accent-primary" />
            <span>{p.label}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title={`Color (${allColors.length})`}>
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
          {allColors.map((c) => {
            const on = colors.includes(c);
            return (
              <button
                key={c}
                onClick={() => setColors(toggle(colors, c))}
                className={`px-2.5 py-1 rounded-full border text-xs ${on ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {allSizes.length > 0 && (
        <FilterSection title="Size">
          <div className="flex flex-wrap gap-1.5">
            {allSizes.map((s) => {
              const on = sizes.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => setSizes(toggle(sizes, s))}
                  className={`min-w-[36px] px-2 py-1 rounded border text-xs font-semibold ${on ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Customer Rating">
        {[4.5, 4, 3.5, 3].map((r) => (
          <label key={r} className="flex items-center gap-2 cursor-pointer hover:text-primary">
            <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} className="accent-primary" />
            <span>{r}★ & above</span>
          </label>
        ))}
        {minRating > 0 && (
          <button onClick={() => setMinRating(0)} className="text-xs text-primary hover:underline mt-1">Clear rating</button>
        )}
      </FilterSection>

      <FilterSection title="Discount Range">
        {[10, 20, 30, 40, 50, 70].map((d) => (
          <label key={d} className="flex items-center gap-2 cursor-pointer hover:text-primary">
            <input type="radio" name="disc" checked={minDisc === d} onChange={() => setMinDisc(d)} className="accent-primary" />
            <span>{d}% and above</span>
          </label>
        ))}
        {minDisc > 0 && (
          <button onClick={() => setMinDisc(0)} className="text-xs text-primary hover:underline mt-1">Clear discount</button>
        )}
      </FilterSection>

      <FilterSection title="Delivery">
        <label className="flex items-center gap-2 cursor-pointer hover:text-primary">
          <input type="checkbox" checked={fastOnly} onChange={(e) => setFastOnly(e.target.checked)} className="accent-primary" />
          <span>Fast delivery only</span>
        </label>
      </FilterSection>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-extrabold capitalize">{meta.label}'s Fashion</h1>
        <p className="text-xs text-muted-foreground mt-1">{filtered.length} products</p>

        <div className="grid md:grid-cols-[240px_1fr] gap-6 mt-6">
          <div className="hidden md:block bg-card border border-border rounded-xl p-4 h-fit sticky top-20">
            {FiltersPanel}
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 bg-card border border-border rounded-lg px-3 py-2 mb-4">
              <button onClick={() => setMobileFilters(true)} className="md:hidden flex items-center gap-2 text-sm font-semibold">
                <SlidersHorizontal className="w-4 h-4" /> Filters
                {activeCount > 0 && <span className="bg-primary text-primary-foreground text-[10px] rounded-full px-1.5">{activeCount}</span>}
              </button>
              <div className="hidden md:block text-xs text-muted-foreground">
                {activeCount > 0 ? `${activeCount} filter(s) applied` : "Showing all results"}
              </div>
              <div className="relative ml-auto">
                <button onClick={() => setSortOpen((v) => !v)} className="flex items-center gap-2 text-sm font-semibold hover:text-primary">
                  Sort by: <span className="text-primary">{SORT_LABELS[sort]}</span> <ChevronDown className="w-4 h-4" />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-md shadow-lg w-56 z-20 py-1">
                    {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                      <button key={k} onClick={() => { setSort(k); setSortOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-muted ${sort === k ? "text-primary font-semibold" : ""}`}>
                        {SORT_LABELS[k]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No products match your filters.
                <button onClick={clearAll} className="block mx-auto mt-3 text-primary font-semibold hover:underline">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFilters && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileFilters(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-background overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Filters</h2>
              <button onClick={() => setMobileFilters(false)}><X className="w-5 h-5" /></button>
            </div>
            {FiltersPanel}
            <button onClick={() => setMobileFilters(false)} className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-semibold mt-6">
              Show {filtered.length} products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-4 first:border-t-0 first:pt-0">
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}
