import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth, useAdmin } from "@/lib/store";
import { Shield, User } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const { user, login, signup } = useAuth();
  const { admin, loginAdmin } = useAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"user" | "admin">("user");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (user) navigate({ to: "/" });
    else if (admin) navigate({ to: "/admin" });
  }, [user, admin, navigate]);

  const submitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || password.length < 4) {
      setErr("Email and password are required");
      return;
    }

    if (mode === "login") {
      const auth = await login(normalizedEmail, password);
      if (!auth) {
        setErr("Wrong email or password. Please try again.");
        return;
      }
      navigate({ to: "/" });
      return;
    }

    if (!name.trim() || !normalizedEmail.includes("@") || password.length < 4 || !phone.trim() || !address.trim()) {
      setErr("Please fill in all required fields");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setErr("Please enter a valid 10-digit phone number");
      return;
    }

    const registered = await signup({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone.trim(),
      address: address.trim(),
    });

    if (!registered) {
      setErr("Unable to sign up. Email may already be registered.");
      return;
    }

    navigate({ to: "/" });
  };

  const submitAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAdmin(adminUser, adminPass);
    if (success) {
      navigate({ to: "/admin" });
    } else {
      setErr("Invalid admin credentials");
    }
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
          <div className="text-3xl font-extrabold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent mb-6">My Store</div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg mb-6">
            <button
              onClick={() => { setTab("user"); setErr(""); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition ${
                tab === "user" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              <User className="w-4 h-4" /> Customer
            </button>
            <button
              onClick={() => { setTab("admin"); setErr(""); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition ${
                tab === "admin" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              <Shield className="w-4 h-4" /> Admin
            </button>
          </div>

          {tab === "user" ? (
            <>
              <h2 className="text-2xl font-bold mb-1">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
              <p className="text-sm text-muted-foreground mb-6">{mode === "login" ? "Login to continue shopping" : "Sign up — it only takes a minute"}</p>

              <form onSubmit={submitUser} className="space-y-4">
                {mode === "signup" && (
                  <>
                    <div>
                      <label className="text-xs font-semibold uppercase">Name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 px-4 py-3 border border-border rounded-md outline-none focus:border-primary transition" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase">Phone</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="w-full mt-1 px-4 py-3 border border-border rounded-md outline-none focus:border-primary transition" placeholder="10-digit phone number" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase">Address</label>
                      <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="w-full mt-1 px-4 py-3 border border-border rounded-md outline-none focus:border-primary transition resize-none" placeholder="Your full address" />
                    </div>
                  </>
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
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-1">Admin Access</h2>
              <p className="text-sm text-muted-foreground mb-6">Restricted area — authorized staff only</p>

              <form onSubmit={submitAdmin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase">Username</label>
                  <input value={adminUser} onChange={(e) => setAdminUser(e.target.value)} className="w-full mt-1 px-4 py-3 border border-border rounded-md outline-none focus:border-primary transition" placeholder="admin" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase">Password</label>
                  <input value={adminPass} onChange={(e) => setAdminPass(e.target.value)} type="password" className="w-full mt-1 px-4 py-3 border border-border rounded-md outline-none focus:border-primary transition" placeholder="••••••••" />
                </div>
                {err && <p className="text-sm text-destructive">{err}</p>}
                <button type="submit" className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:opacity-90 transition">
                  Login as Admin
                </button>
                <p className="text-xs text-center text-muted-foreground pt-2">
                  Demo: <span className="font-mono font-semibold">admin / admin123</span>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
