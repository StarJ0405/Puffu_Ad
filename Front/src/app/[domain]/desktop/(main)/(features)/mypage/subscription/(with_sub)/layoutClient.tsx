"use client";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import { useEffect } from "react";

export default function ({ children }: { children: React.ReactNode }) {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const isSubscribe = userData?.subscribe != null;
  useEffect(() => {
    if (!isSubscribe) navigate("/mypage/subscription/subscribe");
  }, [userData]);
  return <>{children}</>;
}