"use client";
import { useVendorAuth } from "@/providers/VendorAuthProiveder/VendorAuthProviderClient";
import useClientEffect from "@/shared/hooks/useClientEffect";
import useNavigate from "@/shared/hooks/useNavigate";
import { usePathname, useSearchParams } from "next/navigation";

export default function ({ children }: { children: React.ReactNode }) {
  const { userData } = useVendorAuth();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const navigate = useNavigate();
  useClientEffect(() => {
    if (pathname === "/login") {
      if (
        userData?.id &&
        (userData.role === "vendor" || userData.role === "developer")
      ) {
        const redirect_url = searchParams.get("redirect_url");
        navigate(redirect_url ? String(redirect_url) : "/");
      }
    } else {
      if (
        !userData?.id ||
        (userData.role !== "vendor" && userData.role !== "developer")
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
