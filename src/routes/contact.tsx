import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — My Store" },
      { name: "description", content: "Get in touch with My Store. Reach our customer care team via email, phone or our contact form." },
      { property: "og:title", content: "Contact Us — My Store" },
      { property: "og:description", content: "Get in touch with My Store. Reach our customer care team via email, phone or our contact form." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-10">We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            {[
              { Icon: Mail, label: "Email", value: "support@mystore.com" },
              { Icon: Phone, label: "Phone", value: "+91 1800-123-4567" },
              { Icon: MapPin, label: "Address", value: "123 Fashion Street, Bangalore, India" },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 bg-card border border-border rounded-xl p-5">
                <div className="bg-primary/10 text-primary p-3 rounded-lg"><Icon className="w-5 h-5" /></div>
                <div>
                  <div className="font-semibold">{label}</div>
                  <div className="text-sm text-muted-foreground">{value}</div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={submit} className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div>
              <label className="text-sm font-semibold">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-sm font-semibold">Message</label>
              <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-primary" />
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-md hover:opacity-90 transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
