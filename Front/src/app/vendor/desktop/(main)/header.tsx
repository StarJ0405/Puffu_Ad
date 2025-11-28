import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import { dateToString } from "@/shared/utils/Functions";
import Link from "next/link";
import styles from "./header.module.css";
import HeaderSide from "./headerSide";
import HeaderUser from "./headerUser";

export default async function () {
  return (
    <VerticalFlex
      id="admin_header"
      zIndex={100}
      className={styles.header}
      height={128}
      borderBottom={"1px solid #dadada"}
    >
      <FlexChild alignItems="center" height={"100%"}>
        <HorizontalFlex alignItems="center" padding={"8px 20px"}>
          <FlexChild width={"max-content"}>
            <HeaderSide headerHeight={128} />
          </FlexChild>
          <FlexChild width={"max-content"}>
            <Link href={`/`}>
              <Image
                src="/resources/images/kpuffu_logo.png"
                width={250}
                cursor="pointer"
              />
            </Link>
          </FlexChild>
          <FlexChild>
            <VerticalFlex gap={10}>
              <FlexChild>
                <P size={20} weight={"bold"} padding={"0 8px"}>
                  {dateToString(new Date())}
                </P>
              </FlexChild>
            </VerticalFlex>
          </FlexChild>
          <FlexChild width={"max-content"}>
            <HeaderUser />
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
