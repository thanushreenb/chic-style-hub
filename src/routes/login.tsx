import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/store";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 4) {
      setErr("Enter a valid email and a password of 4+ characters");
      return;
    }
    login(mode === "signup" ? name || email.split("@")[0] : email.split("@")[0]);
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="m-auto text-primary-foreground p-12 max-w-lg">
          <h1 className="text-5xl font-extrabold leading-tight">Style starts here.</h1>
          <p className="mt-4 text-lg opacity-90">Discover the latest fashion trends from 1000+ brands. Shop Men, Women & Kids — all in one place.</p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            <div><div className="text-3xl font-bold">5K+</div><div className="text-sm opacity-80">Brands</div></div>
            <div><div className="text-3xl font-bold">1M+</div><div className="text-sm opacity-80">Products</div></div>
            <div><div className="text-3xl font-bold">24/7</div><div className="text-sm opacity-80">Support</div></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="text-3xl font-extrabold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent mb-1">My Store</div>
          <h2 className="text-2xl font-bold mb-1">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="text-sm text-muted-foreground mb-8">{mode === "login" ? "Login to continue shopping" : "Sign up — it only takes a minute"}</p>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-semibold uppercase">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 px-4 py-3 border border-border rounded-md outline-none focus:border-primary transition" placeholder="Your name" />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold uppercase">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full mt-1 px-4 py-3 border border-border rounded-md outline-none focus:border-primary transition" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full mt-1 px-4 py-3 border border-border rounded-md outline-none focus:border-primary transition" placeholder="••••••••" />
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button type="submit" className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:opacity-90 transition">
              {mode === "login" ? "Login" : "Create account"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-muted-foreground">
            {mode === "login" ? "New here? " : "Already have an account? "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary font-semibold hover:underline">
              {mode === "login" ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
