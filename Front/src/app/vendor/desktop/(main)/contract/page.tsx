import VerticalFlex from "@/components/flex/VerticalFlex";
import { Client } from "./client";

export default async function () {
  return (
    <>
      <VerticalFlex padding={40}>
        <Client />
      </VerticalFlex>
    </>
  );
}
