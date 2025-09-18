"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Link from "next/link";
import { ChoiseProductSlider, CompleteForm } from "./client";
import styles from "./page.module.css";
import { Sessions } from "@/shared/utils/Data";
import useClientEffect from "@/shared/hooks/useClientEffect";
import useNavigate from "@/shared/hooks/useNavigate";
import { useState } from "react";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";

export default function () {
  const { reload } = useAuth();
  const [order, setOrder] = useState<OrderData>();
  const navigate = useNavigate();
  useClientEffect(
    () => {
      const _data = sessionStorage.getItem(Sessions.ORDER);
      if (_data && _data !== "undefined") {
        const order = JSON.parse(_data);
        if (!order) navigate("/", { type: "replace" });
        else {
          setOrder(order);
          setTimeout(() => {
            reload().then(() => {
              sessionStorage.removeItem(Sessions.ORDER);
            });
          }, 100);
        }
      } else {
        navigate("/", { type: "replace" });
      }
    },
    [],
    true
  );
  return (
    <section className="root page_container">
      <VerticalFlex>
        <FlexChild>
          <CompleteForm order={order} />
        </FlexChild>

        <FlexChild justifyContent="center" marginTop={50}>
          <Link href={"/"} className={styles.post_btn}>
            쇼핑 계속하기
          </Link>
        </FlexChild>

        <VerticalFlex marginTop={80} gap={20}>
          <FlexChild justifyContent="center">
            <P size={20} className="SacheonFont">
              함께 관심 가지면 좋은 상품
            </P>
          </FlexChild>
          <ChoiseProductSlider id={"choise"} />
        </VerticalFlex>
      </VerticalFlex>
    </section>
  );
}
