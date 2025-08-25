"use client";

import { useAdminAuth } from "@/providers/AdminAuthPorivder/AdminAuthPorivderClient";
import useClientEffect from "@/shared/hooks/useClientEffect";
import useNavigate from "@/shared/hooks/useNavigate";
import { usePathname, useSearchParams } from "next/navigation";

export default function ({ children }: { children: React.ReactNode }) {
  const { userData } = useAdminAuth();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const navigate = useNavigate();
  useClientEffect(() => {
    if (pathname === "/login") {
      if (
        userData &&
        (userData.role === "admin" || userData.role === "developer")
      ) {
        const redirect_url = searchParams.get("redirect_url");
        navigate(redirect_url ? String(redirect_url) : "/");
      }
    } else {
      if (
        !userData ||
        (userData.role !== "admin" && userData.role !== "developer")
      ) {
        navigate(
          `/login${
            pathname?.startsWith("/login") ? "" : `?redirect_url=${pathname}`
          }`
        );
      }
    }
  }, [userData, pathname]);
  return <>{children}</>;
}
