"use client";
import P from "@/components/P/P";
import { requester } from "@/shared/Requester";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import useClientEffect from "@/shared/hooks/useClientEffect";

export function ClientTxt() {
  const [plan, setPlan] = useState<any>(null);
  const [pay, setPay] = useState<any>(null);
  const { userData } = useAuth();
  const navigate = useNavigate();
  // BFCache 복귀 시: 성공 토큰 없으면 강제 리로드
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (location.pathname !== "/mypage/subscription/success") return;

    const onPageShow = (e: PageTransitionEvent) => {
      if ((e as any).persisted) {
        const hasToken = !!sessionStorage.getItem("SUB_SUCCESS_TOKEN");
        if (!hasToken) {
          console.warn("[SUB/SUCCESS] pageshow → reload (no token)");
          location.reload();
        }
      }
    };

    window.addEventListener("pageshow", onPageShow as any);
    return () => window.removeEventListener("pageshow", onPageShow as any);
  }, []);
  // 진입 시 토큰 유효성 검사
  useClientEffect(
    () => {
      try {
        if (
          typeof window !== "undefined" &&
          location.pathname !== "/mypage/subscription/success"
        ) {
          // 성공 페이지가 아니면 검사하지 않음
          return;
        }

        const txt = sessionStorage.getItem("SUB_SUCCESS_TOKEN");
        if (!txt) {
          console.warn("[SUB/SUCCESS] No token → redirect /");
          navigate("/", { type: "replace" });
          return;
        }

        const { at } = JSON.parse(txt);
        const TTL = 5 * 60 * 1000;
        const nowDiff = Date.now() - at;
        const valid = typeof at === "number" && nowDiff <= TTL;

        if (!valid) {
          console.warn("[SUB/SUCCESS] Expired token → redirect /");
          sessionStorage.removeItem("SUB_SUCCESS_TOKEN");
          navigate("/", { type: "replace" });
        } else {
          // 1분 후 토큰 자동 삭제
          const timeoutId = setTimeout(() => {
            try {
              sessionStorage.removeItem("SUB_SUCCESS_TOKEN");
            } finally {
              navigate("/", { type: "replace" });
            }
          }, 60000);
          // 언마운트 시 타이머 정리
          return () => clearTimeout(timeoutId);
        }
      } catch (err) {
        console.error("[SUB/SUCCESS] Token parse error:", err);
        navigate("/", { type: "replace" });
      }
    },
    [navigate],
    true
  );

  // 결제 결과 회수
  useEffect(() => {
    try {
      const txt = sessionStorage.getItem("SUB_PAY_RESULT");
      if (txt) {
        setPay(JSON.parse(txt));
        sessionStorage.removeItem("SUB_PAY_INTENT");
        sessionStorage.removeItem("SUB_PAY_RESULT");
        // console.log("[SUB/SUCCESS] Payment result loaded:", JSON.parse(txt));
      }
    } catch (err) {
      console.error("[SUB/SUCCESS] Pay result parse error:", err);
    }
  }, []);

  // 구독/플랜 조회
  useEffect(() => {
    (async () => {
      try {
        const my = await requester.getMySubscribes({ latest: true });
        const s = my?.content?.[0];
        if (!s) {
          console.warn("[SUB/SUCCESS] No active subscription found");
          return;
        }
        const pl = await requester.getSubscribe({
          store_id: s.store_id,
          take: 1,
        });
        setPlan(pl?.content?.[0] || null);
        // console.log("[SUB/SUCCESS] Plan loaded:", pl?.content?.[0]);
      } catch (err) {
        console.error("[SUB/SUCCESS] Plan load error:", err);
      }
    })();
  }, []);

  if (!userData) return null;

  const percent = Number(plan?.percent ?? 0);
  const monthly = Number(plan?.value ?? pay?.amount ?? 0);

  return (
    <P className={styles.text1}>
      이제부터 전제품 <strong>{percent.toLocaleString()}% 할인</strong> + <br />
      매월 프리머니 <strong>{monthly.toLocaleString()}원 쿠폰</strong> 지급{" "}
      <br />
      혜택을 누리실 수 있습니다.
    </P>
  );
}
