import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/store";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const { admin, loginAdmin } = useAdmin();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (admin) navigate({ to: "/admin" });
  }, [admin, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = loginAdmin(username.trim(), password);
    if (ok) navigate({ to: "/admin" });
    else setError("Invalid credentials. Try admin / admin123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage your store</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="admin"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="admin123"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-md hover:opacity-90 transition"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">← Back to store</Link>
        </div>
      </div>
    </div>
  );
}
