import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  const [err, setErr] = useState("");

  useEffect(() => {
    if (admin) navigate({ to: "/admin" });
  }, [admin, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(username, password)) {
      navigate({ to: "/admin" });
    } else {
      setErr("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Restricted area — authorized staff only</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 px-4 py-3 border border-border rounded-md outline-none focus:border-primary transition" placeholder="admin" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full mt-1 px-4 py-3 border border-border rounded-md outline-none focus:border-primary transition" placeholder="••••••••" />
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button type="submit" className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:opacity-90 transition">
            Login as Admin
          </button>
          <p className="text-xs text-center text-muted-foreground pt-2">
            Demo credentials: <span className="font-mono font-semibold">admin / admin123</span>
          </p>
        </form>
      </div>
    </div>
  );
}
