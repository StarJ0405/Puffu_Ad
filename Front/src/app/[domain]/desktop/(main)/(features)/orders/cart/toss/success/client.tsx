"use client";

import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import P from "@/components/P/P";
import useNavigate from "@/shared/hooks/useNavigate";
import { Sessions } from "@/shared/utils/Data";
import clsx from "clsx";
import { useEffect } from "react";
import styles from "./page.module.css";

export default function ({ order }: { order: OrderData }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (order) {
      sessionStorage.setItem(Sessions.ORDER, JSON.stringify(order));
      navigate("/orders/complete", { type: "replace" });
    }
  }, [order]);
  return (
    <VerticalFlex justifyContent="center" gap={10}>
      <P>주문서 생성중..</P>
      <LoadingSpinner />
    </VerticalFlex>
  );
}

export function NotFoundClient({ deviceType }: { deviceType: string }) {
  const navigate = useNavigate();
  return (
    <FlexChild className={clsx(styles.buttonWrapper, styles[deviceType])}>
      <Button
        className={clsx(styles.before, styles[deviceType])}
        onClick={() => navigate("/orders/cart", { type: "replace" })}
      >
        장바구니로
      </Button>

      <Button
        className={clsx(styles.main, styles[deviceType])}
        onClick={() => navigate("/", { type: "replace" })}
      >
        홈으로
      </Button>
    </FlexChild>
  );
}
