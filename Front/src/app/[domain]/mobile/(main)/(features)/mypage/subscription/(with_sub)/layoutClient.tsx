"use client";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import { useEffect, useMemo } from "react";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const { userData } = useAuth();
  const navigate = useNavigate();

  // 로딩 중
  if (userData === undefined) return null;

  const isActive = useMemo(() => {
    const s = userData?.subscribe;
    if (!s) return false;
    const now = Date.now();
    const ends = s.ends_at ? new Date(s.ends_at).getTime() : 0;
    return !s.canceled_at && ends > now;
  }, [userData]);

  useEffect(() => {
    if (!isActive) navigate("/mypage/subscription/subscribe", { type: "replace" });
  }, [isActive, navigate]);

  if (!isActive) return null;
  return <>{children}</>;
}
