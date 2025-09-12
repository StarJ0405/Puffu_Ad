import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import mypage from "../mypage.module.css";

import clsx from "clsx";
import styles from "./page.module.css";
// import boardStyle from "../../boardGrobal.module.css"

// import {WishListTable } from "./client";

export default async function () {
  return (
    <>
      <VerticalFlex className={clsx(mypage.box_frame)} gap={35}>
        <FlexChild className={mypage.box_header}>
          <P>개인정보 수정</P>
        </FlexChild>

        <VerticalFlex className={styles.edit_container}>
            <VerticalFlex className={styles.thumb_box}>
               <FlexChild className={styles.thumbnail}>
                     <Image
                        src={"/resources/images/dummy_img/product_01.png"}
                        width={80}
                     />
               </FlexChild>

               <Button className={styles.photo_edit_btn}>
                  <Image
                     src={"/resources/icons/mypage/img_edit_icon.png"}
                     width={20}
                  />
                     사진등록
               </Button>
            </VerticalFlex>

            <VerticalFlex className={styles.info_box}>
               <VerticalFlex className={styles.input_box} >
                  <P className={styles.input_label}>
                     아이디
                  </P>
                  <P size={16} color="#797979">
                     mynameistony
                  </P>
               </VerticalFlex>

               <VerticalFlex className={styles.input_box} >
                  <P className={styles.input_label}>
                     비밀번호
                  </P>
                  <Input
                     className="web_input"
                     type="password"
                     width={"100%"}
                     placeHolder="비밀번호를 입력하세요."
                  />
               </VerticalFlex>

               <VerticalFlex className={styles.input_box} >
                  <P className={styles.input_label}>
                     비밀번호 확인
                  </P>
                  <Input
                     className="web_input"
                     type="password"
                     width={"100%"}
                     placeHolder="비밀번호를 한번 더 입력하세요."
                  />
               </VerticalFlex>

               <VerticalFlex className={styles.input_box} >
                  <P className={styles.input_label}>
                     이름
                  </P>
                  <Input
                     className="web_input"
                     type="text"
                     width={"100%"}
                     placeHolder="변경할 이름을 입력하세요"
                     value={'마이네임이즈토니'}
                  />
               </VerticalFlex>
            </VerticalFlex>

            <FlexChild className={styles.button_group}>
              <Button className={styles.cancel_btn}>취소</Button>
              <Button className={styles.submit_btn}>저장</Button>
            </FlexChild>
        </VerticalFlex>
      </VerticalFlex>
    </>
  );
}
