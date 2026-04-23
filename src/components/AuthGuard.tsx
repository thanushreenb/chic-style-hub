import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  if (!ready || !user) return null;
  return <>{children}</>;
}
