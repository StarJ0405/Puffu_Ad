"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import styles from "./page.module.css";

// 게시판 리스트 -----------------------------------------------
export function ContinueGroup() {
  const completed = false;

  return (
    <FlexChild className={styles.continue_box}>
      <Button className={styles.prev_btn}>이전</Button>
      <Button className={styles.next_btn}>다음</Button>
      {completed && (
        <>
          <Button className={styles.home_btn}>홈으로</Button>
          <Button className={styles.login_btn}>로그인</Button>
        </>
      )}
    </FlexChild>
  );
}

{
  /* 
<FlexChild className={styles.continue_box}>
<Button className={styles.prev_btn}>이전</Button>
<Button className={styles.next_btn}>다음</Button>
</FlexChild> 

<FlexChild className={styles.continue_box}>
<Button className={styles.home_btn}>홈으로</Button>
<Button className={styles.login_btn}>로그인</Button>
</FlexChild> 

*/
}
