"use client";
import P from "@/components/P/P";
import { requester } from "@/shared/Requester";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";


export function ClientTxt() {
   const [plan, setPlan] = useState<any>(null);
      const { userData } = useAuth(); // 유저정보 받아오기
   
      const isSubscribe = userData?.subscribe != null;
      const navigate = useNavigate();
   
      useEffect(() => {
       if (userData && !isSubscribe) {
         navigate("/");
       }
     }, [userData, isSubscribe, navigate]);
   
     if (!userData) return null;
   
      useEffect(() => {
   
         if (!isSubscribe) return; // 비구독자는 실행 안 함
   
         (async () => {
         // 최신 구독 1건
         const my = await requester.getMySubscribes({ latest: true });
         const s = my?.content?.[0];
         if (!s) return;
   
         // 기본 플랜 1건
         const pl = await requester.getSubscribe({
           store_id: s.store_id,
           take: 1,
         });
         setPlan(pl?.content?.[0] || null);
   
       })();
      }, [isSubscribe])

   return (
      <P className={styles.text1}>
         이제부터 전제품 <strong>{(plan?.percent || 0).toLocaleString()}% 할인</strong> + <br/>
         매월 프리머니 <strong>{(plan?.value || 0).toLocaleString()}원 쿠폰</strong> 지급 <br/>
         혜택을 누리실 수 있습니다.
      </P>
   )
}



