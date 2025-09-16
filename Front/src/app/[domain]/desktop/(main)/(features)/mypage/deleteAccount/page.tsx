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
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import ChoiceGroup from "@/components/choice/ChoiceGroup";
import ChoiceChild from "@/components/choice/ChoiceChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";

export default async function () {
  return (
    <>
      <VerticalFlex className={clsx(mypage.box_frame, styles.delete_box)} gap={35}>
        <FlexChild justifyContent="center" marginTop={30}>
          <P size={35} color="#fff" weight={600}>회원탈퇴</P>
        </FlexChild>

        <VerticalFlex className={styles.delete_content}>
            <FlexChild className={styles.title}>
               <P>푸푸토이 탈퇴 안내</P>
            </FlexChild>

            <VerticalFlex className={styles.term_txt}>
               <P className={styles.title}>제7조(회원 탈퇴 및 자격 상실 등)</P>
               <VerticalFlex gap={20} alignItems="start">
                  <P className={styles.txt1}>
                     ① 회원은 “몰”에 언제든지 탈퇴를 요청할 수 있으며 “몰”은 즉시
                     회원탈퇴를 처리합니다.
                  </P>
                  <P className={styles.txt1}>
                     ② 회원이 다음 각 호의 사유에 해당하는 경우, “몰”은 회원자격을 제한
                     및 정지시킬 수 있습니다.
                  </P>
                  <P className={styles.txt1}>
                     1. 가입 신청 시에 허위 내용을 등록한 경우
                  </P>
                  <P className={styles.txt1}>
                     2. “몰”을 이용하여 구입한 재화 등의 대금, 기타 “몰”이용에 관련하여
                     회원이 부담하는 채무를 기일에 지급하지 않는 경우
                  </P>
                  <P className={styles.txt1}>
                     3. 다른 사람의 “몰” 이용을 방해하거나 그 정보를 도용하는 등
                     전자상거래 질서를 위협하는 경우
                  </P>
                  <P className={styles.txt1}>
                     4. “몰”을 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는
                     행위를 하는 경우
                  </P>
                  <P className={styles.txt1}>
                     ③ “몰”이 회원 자격을 제한.정지 시킨 후, 동일한 행위가 2회 이상
                     반복되거나 30일 이내에 그 사유가 시정되지 아니하는 경우 “몰”은
                     회원자격을 상실시킬 수 있습니다.
                  </P>
                  <P className={styles.txt1}>
                     ④ “몰”이 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이
                     경우 회원에게 이를 통지하고, 회원등록 말소 전에 최소한 30일 이상의
                     기간을 정하여 소명할 기회를 부여합니다.
                  </P>
               </VerticalFlex>
            </VerticalFlex>

            <VerticalFlex>
               <HorizontalFlex className={styles.input_box} >
                  <P className={styles.input_label}>
                     비밀번호
                  </P>
                  <Input
                     className="web_input"
                     type="password"
                     width={"100%"}
                     placeHolder="비밀번호를 입력하세요."
                  />
               </HorizontalFlex>

               <CheckboxGroup name={'delete_member'}>
                  <FlexChild  justifyContent="center">
                     <label>
                        <FlexChild gap={10} margin={'30px 0'}>
                           <CheckboxChild id={'delete_member'} />
                           <P>위 내용을 모두 확인하였고, 동의합니다.</P>
                        </FlexChild>
                     </label>
                  </FlexChild>
               </CheckboxGroup>
            </VerticalFlex>
        </VerticalFlex>

        <FlexChild className={styles.button_group}>
            <Button className={styles.submit_btn}>확인</Button>
         </FlexChild>
      </VerticalFlex>
    </>
  );
}
