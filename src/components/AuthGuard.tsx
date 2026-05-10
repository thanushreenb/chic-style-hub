import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth, useAdmin } from "@/lib/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { admin } = useAdmin();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHydrated(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (hydrated && !user && !admin) navigate({ to: "/login" });
  }, [hydrated, user, admin, navigate]);

  if (!hydrated) return null;
  if (!user && !admin) return null;
  return <>{children}</>;
}

