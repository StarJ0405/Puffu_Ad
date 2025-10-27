"use client";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import { useEffect, useMemo, useState } from "react";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [allow, setAllow] = useState<boolean | null>(null);

  const isActive = useMemo(() => {
    const s = userData?.subscribe;
    if (!s) return false;
    const now = Date.now();
    const ends = s.ends_at ? new Date(s.ends_at).getTime() : 0;
    return !s.canceled_at && ends > now;
  }, [userData]);

  useEffect(() => {
    if (userData === undefined) return;
    if (isActive) {
      setAllow(false);
      navigate("/mypage/subscription/manage", { type: "replace" });
    } else {
      setAllow(true);
    }
  }, [userData, isActive, navigate]);

  if (allow !== true) return null;
  return <>{children}</>;
}
