import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — My Store" },
      { name: "description", content: "Learn about My Store — our mission, values and the team behind your favourite fashion destination." },
      { property: "og:title", content: "About Us — My Store" },
      { property: "og:description", content: "Learn about My Store — our mission, values and the team behind your favourite fashion destination." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold mb-4">About My Store</h1>
        <p className="text-muted-foreground text-lg mb-8">
          We're on a mission to make fashion accessible, affordable and fun for everyone.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { t: "10M+", s: "Happy customers" },
            { t: "500+", s: "Top brands" },
            { t: "50K+", s: "Styles to choose from" },
          ].map((s) => (
            <div key={s.t} className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-3xl font-extrabold text-primary">{s.t}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.s}</div>
            </div>
          ))}
        </div>

        <section className="space-y-4 text-foreground/90">
          <h2 className="text-2xl font-bold">Our Story</h2>
          <p>Founded in 2024, My Store started as a small idea — to bring the best of fashion straight to your doorstep. Today, we serve millions of customers across the country with curated collections from the world's top brands.</p>
          <h2 className="text-2xl font-bold pt-4">Our Mission</h2>
          <p>We believe great style shouldn't cost the earth. That's why we partner with sustainable brands and offer transparent pricing on every product.</p>
          <h2 className="text-2xl font-bold pt-4">Why Shop With Us?</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Free shipping on orders above ₹999</li>
            <li>Easy 30-day returns</li>
            <li>100% authentic products</li>
            <li>24/7 customer support</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
