import Button from "@/components/buttons/Button";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import styles from "./page.module.css";

import ChoiceChild from "@/components/choice/ChoiceChild";
import ChoiceGroup from "@/components/choice/ChoiceGroup";
import NoContent from "@/components/noContent/noContent";
import { CompleteForm, ChoiseProductSlider } from "./client";
import Link from "next/link";

export default async function () {
  return (
    <section className="root page_container">
      <VerticalFlex>
        <FlexChild>
          <CompleteForm />
        </FlexChild>

        <FlexChild justifyContent="center" marginTop={50}>
          <Link href={"/"} className={styles.post_btn}>
            쇼핑 계속하기
          </Link>
        </FlexChild>

        <VerticalFlex marginTop={80} gap={20}>
          <FlexChild>
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
