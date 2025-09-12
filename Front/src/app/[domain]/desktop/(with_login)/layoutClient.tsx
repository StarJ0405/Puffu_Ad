"use client";

import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import { useEffect } from "react";

export default function ({ children }: { children: React.ReactNode }) {
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData?.id) {
      navigate("/auth/login", { type: "replace" });
    }
  }, [userData]);

  return <>{children}</>;
}
