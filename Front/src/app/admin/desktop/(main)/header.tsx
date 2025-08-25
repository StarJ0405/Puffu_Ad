import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import { dateToString } from "@/shared/utils/Functions";
import { headers } from "next/headers";
import Link from "next/link";
import HeaderSide from "./headerSide";
import HeaderUser from "./headerUser";
import styles from "./header.module.css";

export default async function () {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname");
  return (
    <VerticalFlex
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
                <Select
                  width="160px"
                  placeholder="바로가기"
                  options={[
                    {
                      display: "월드베이프",
                      value: "월드베이프",
                      to: { url: "https://www.worldvape.co.kr/", new: true },
                    },
                    {
                      display: "중국 쇼핑몰",
                      value: "중국 쇼핑몰",
                      to: { url: "https://www.puffukorea.com/", new: true },
                    },
                    {
                      display: "푸푸 통합몰",
                      value: "푸푸 통합몰",
                      to: { url: "https://puffu.co.kr", new: true },
                    },
                  ]}
                />
              </FlexChild>
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
