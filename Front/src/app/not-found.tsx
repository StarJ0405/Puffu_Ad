import { getDeviceType } from "@/shared/utils/Functions";
import { headers } from "next/headers";
import styles from './not-found.module.css'
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import {NaviBtn} from "./not-client" 
import clsx from "clsx";

export default async function () {
  const headerList = await headers();
  const userAgent = headerList.get("user-agent");
  const deviceType = getDeviceType(userAgent);

  return (
    <div className={clsx(styles.container, 'page_container')}>
      <div className={styles.text_box}>
        <P className={styles.not_title}>404</P>
        <P className={styles.not_txt}>
          찾을 수 없는 페이지입니다. <br />
          요청하신 페이지가 사라졌거나, 잘못된 경로입니다.
        </P>
      </div>

      <NaviBtn />
    </div>
  );
}
