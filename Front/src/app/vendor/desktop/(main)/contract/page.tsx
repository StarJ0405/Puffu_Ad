import { Client } from "./client";
import VerticalFlex from "@/components/flex/VerticalFlex";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";

export default async function () {
  return (
    <>
      <VerticalFlex>
        <Client />
      </VerticalFlex>
    </>
  );
}
