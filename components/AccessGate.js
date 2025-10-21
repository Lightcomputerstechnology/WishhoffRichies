// components/AccessGate.js
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * AccessGate - Controls access for pages and sections.
 * @param {boolean} requireAuth - If true, redirects guests to login.
 * @param {string} redirectTo - Path to redirect unauthenticated users.
 * @param {JSX.Element} fallback - Optional UI shown while redirecting.
 */
export default function AccessGate({
  requireAuth = false,
  redirectTo = "/login",
  fallback = null,
  children,
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && requireAuth && !user) {
      router.replace(`${redirectTo}?next=${router.asPath}`);
    }
  }, [isLoading, user]);

  if (requireAuth && !user) return fallback || null;

  return children;
}
