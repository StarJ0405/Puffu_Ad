import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import Container from "@/components/container/Container";
import Center from "@/components/center/Center";
import Input from "@/components/inputs/Input";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import TermContent from "@/components/agreeContent/TermContent";
import PrivacyContent from "@/components/agreeContent/privacyContent";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Link from "next/link";

import clsx from "clsx";
import styles from './page.module.css'
// import boardStyle from '../../boardGrobal.module.css'

import { ContinueGroup } from "./client";
import ChoiceChild from "@/components/choice/ChoiceChild";
import ChoiceGroup from "@/components/choice/ChoiceGroup";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import RadioChild from "@/components/choice/radio/RadioChild";
import Select from "@/components/select/Select";

export default async function () {

   return (
      <section className='root desktop_container'>

         {/* 1단계 */}
         <VerticalFlex>
            <FlexChild className={styles.page_title}>
               <h3>회원가입</h3>
            </FlexChild>

            <HorizontalFlex className={styles.step_root}>
               <FlexChild className={styles.step_number}>
                  <Span>1</Span>
               </FlexChild>

               <FlexChild className={styles.step_number}>
                  <Span>2</Span>
               </FlexChild>

               <FlexChild className={styles.step_number}>
                  <Span>3</Span>
               </FlexChild>

               <FlexChild className={styles.step_line}>
                  <div id="line"></div>
               </FlexChild>
            </HorizontalFlex>

            <VerticalFlex className={styles.agree_box}>
               <CheckboxGroup name="member_agree">
                  <FlexChild className={styles.checkbox}>
                     <label>
                        <CheckboxAll />
                        <Span>전체동의</Span>
                     </label>
                  </FlexChild>

                  <FlexChild className={styles.agree_item}>
                     <FlexChild className={styles.checkbox}>
                        <label>
                           <CheckboxChild id="term_agree" />
                           <Span>이용약관 동의</Span>
                        </label>
                     </FlexChild>

                     <FlexChild className={styles.agree_content}>
                        <P>
                           {/* <TermContent /> */}
                        </P>
                     </FlexChild>
                  </FlexChild>

                  <FlexChild className={styles.agree_item}>
                     <FlexChild className={styles.checkbox}>
                        <label>
                           <CheckboxChild id="privacy_agree" />
                           <Span>개인정보 수집 및 이용 동의</Span>
                        </label>
                     </FlexChild>

                     <FlexChild className={styles.agree_content}>
                        <P>
                           {/* <privacyContent /> */}
                        </P>
                     </FlexChild>
                  </FlexChild>
               </CheckboxGroup>

               <VerticalFlex>
                  <FlexChild>
                     <h5>본인인증 방식 선택</h5>
                  </FlexChild>

                  <FlexChild className={styles.verification}>
                     <RadioGroup name="verification">
                        {/* <RadioChild id="verification_phone" /> */}
                        <label>
                           <input type="radio" />
                           휴대폰 본인인증
                        </label>
                     </RadioGroup>
                  </FlexChild>
               </VerticalFlex>
            </VerticalFlex>

            <FlexChild>
               <ContinueGroup />
            </FlexChild>
         </VerticalFlex>




         {/* 2단계 */}
         <VerticalFlex> 
            <VerticalFlex className={styles.input_box}>
               <HorizontalFlex className={styles.label}>
                  <P>이름</P>
                  <Span>(필수)</Span>
               </HorizontalFlex>
               <FlexChild className={styles.item_input}>
                  <Input type="text" placeHolder="이름을 입력하세요" />
               </FlexChild>
            </VerticalFlex>

            <VerticalFlex className={styles.input_box}>
               <HorizontalFlex className={styles.label}>
                  <P>이메일</P>
                  <Span>(필수)</Span>
               </HorizontalFlex>
               <FlexChild className={styles.item_input}>
                  <Input type="text" placeHolder="이메일을 입력하세요" />
               </FlexChild>
            </VerticalFlex>

            <VerticalFlex className={styles.input_box}>
               <HorizontalFlex className={styles.label}>
                  <P>휴대폰번호</P>
                  <Span>(필수)</Span>
               </HorizontalFlex>
               <FlexChild className={styles.item_input}>
                  <Input type="number" placeHolder="(+86)" />
               </FlexChild>
            </VerticalFlex>

            <VerticalFlex className={styles.input_box}>
               <HorizontalFlex className={styles.label}>
                  <P>아이디</P>
                  <Span>(필수)</Span>
               </HorizontalFlex>
               <FlexChild className={styles.item_input}>
                  <Input type="text" placeHolder="아이디를 입력하세요" />
               </FlexChild>
            </VerticalFlex>

            <VerticalFlex className={styles.input_box}>
               <HorizontalFlex className={styles.label}>
                  <P>비밀번호</P>
                  <Span>(필수)</Span>
               </HorizontalFlex>
               <FlexChild className={styles.item_input}>
                  <Input type="password" placeHolder="비밀번호를 입력하세요" />
               </FlexChild>
               <FlexChild className={styles.item_input}>
                  <Input type="password" placeHolder="비밀번호를 한번 더 입력하세요" />
               </FlexChild>
            </VerticalFlex>

            <VerticalFlex className={styles.input_box}>
               <HorizontalFlex className={styles.label}>
                  <P>비밀번호 질문</P>
               </HorizontalFlex>
               <FlexChild className={styles.item_input}>
                  <Select
                     classNames={{
                        // header: boardStyle.search_select_body,
                     }}
                     options={[
                        { value: "가장 좋아하는 동물은?", display: "가장 좋아하는 동물은?" },
                        { value: "어릴적 별명은?", display: "어릴적 별명은?" },
                        { value: "어머니 성함은?", display: "어머니 성함은?" },
                        { value: "출생 도시는?", display: "출생 도시는?" },
                        { value: "졸업한 초등학교는?", display: "졸업한 초등학교는?" },
                     ]}
                     placeholder={'질문을 선택하세요'}
                     // value={selectedMessageOption}
                   />
               </FlexChild>
               <FlexChild className={styles.item_input}>
                  <Input type="text" placeHolder="질문에 대한 답변을 입력하세요." />
               </FlexChild>
            </VerticalFlex>

            <FlexChild>
               <ContinueGroup />
            </FlexChild>
         </VerticalFlex>


         {/* 3단계 */}
         <VerticalFlex> 
            <FlexChild>
               <P>회원가입 완료!</P>
            </FlexChild>

            <FlexChild>
               <Button className={styles.home_btn}>메인으로</Button>
            </FlexChild>
         </VerticalFlex>


      </section>
   )


}