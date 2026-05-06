import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Wait a tick so useLocalState can hydrate from localStorage
    const t = setTimeout(() => setHydrated(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (hydrated && !user) navigate({ to: "/login" });
  }, [hydrated, user, navigate]);

  if (!hydrated) return null;
  if (!user) return null;
  return <>{children}</>;
}
