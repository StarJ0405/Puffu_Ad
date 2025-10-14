import { getDeviceType } from "@/shared/utils/Functions";
import { headers } from "next/headers";
import styles from './not-found.module.css'
import VerticalFlex from "@/components/flex/VerticalFlex";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import {NaviBtn} from "./not-client" 

export default async function () {
  const headerList = await headers();
  const userAgent = headerList.get("user-agent");
  const deviceType = getDeviceType(userAgent);

  return (
    <VerticalFlex width={'100%'} height={'100dvh'} display="flex" justifyContent="center" gap={30}>
      <FlexChild justifyContent="center">
        <P className={styles.not_txt}>페이지를 찾을 수 없습니다.</P>
      </FlexChild>

      <NaviBtn />
    </VerticalFlex>
  );
}
