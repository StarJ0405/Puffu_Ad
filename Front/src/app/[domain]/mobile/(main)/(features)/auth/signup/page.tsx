import PrivacyContent from "@/components/agreeContent/privacyContent";
import TermContent from "@/components/agreeContent/TermContent";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Span from "@/components/span/Span";

import styles from './page.module.css';
// import boardStyle from '../../boardGrobal.module.css'

import RadioGroup from "@/components/choice/radio/RadioGroup";
import Select from "@/components/select/Select";
import { ContinueGroup } from "./client";

export default async function () {

   return (
      <section className='root desktop_container'>

         <VerticalFlex className={styles.signup_frame}>
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
                  <div id={styles.line} style={{width: '25%'}}></div>
                  {/* 스탭 진행될때마다 width 값 올리면 됨. */}
               </FlexChild>
            </HorizontalFlex>

            {/* 1단계 */}
            <VerticalFlex>
               <FlexChild className={styles.step_title}>
                  <P>약관 동의</P>
               </FlexChild>
              
               <VerticalFlex gap={50}>
                  <CheckboxGroup name="member_agree" className={styles.agree_box}>
                     <FlexChild className={styles.agree_item}>
                        <FlexChild className={styles.checkbox}>
                           <label>
                              <CheckboxAll />
                              <Span>전체동의</Span>
                           </label>
                        </FlexChild>
                     </FlexChild>
   
                     <VerticalFlex className={styles.agree_item}>
                        <FlexChild className={styles.checkbox}>
                           <label>
                              <CheckboxChild id="term_agree" />
                              <Span>이용약관 동의</Span>
                           </label>
                        </FlexChild>
   
                        <FlexChild className={'agree_content'}>
                           <TermContent size={8} />
                        </FlexChild>
                     </VerticalFlex>
   
                     <VerticalFlex className={styles.agree_item}>
                        <FlexChild className={styles.checkbox}>
                           <label>
                              <CheckboxChild id="privacy_agree" />
                              <Span>개인정보 수집 및 이용 동의</Span>
                           </label>
                        </FlexChild>
   
                        <FlexChild className={'agree_content'}>
                           <PrivacyContent size={8} />
                        </FlexChild>
                     </VerticalFlex>
                  </CheckboxGroup>
   
                  <VerticalFlex className={styles.phone_verification}>
                     <FlexChild className={styles.title}>
                        <h5>본인인증 방식 선택</h5>
                     </FlexChild>
   
                     <FlexChild className={styles.verification_box}>
                        <RadioGroup name="verification" className={styles.verfi_item}>
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
            <VerticalFlex width={'100%'} maxWidth={600}>
               <FlexChild className={styles.step_title}>
                  <P>기본 정보</P>
               </FlexChild>

               <VerticalFlex className={styles.input_box}>
                  <VerticalFlex className={styles.input_item}>
                     <HorizontalFlex className={styles.label}>
                        <P>이름</P>
                        <Span>(필수)</Span>
                     </HorizontalFlex>
                     <FlexChild>
                        <Input type="text" width={'100%'}  placeHolder="이름을 입력하세요" />
                     </FlexChild>
                  </VerticalFlex>
      
                  <VerticalFlex className={styles.input_item}>
                     <HorizontalFlex className={styles.label}>
                        <P>이메일</P>
                        <Span>(필수)</Span>
                     </HorizontalFlex>
                     <FlexChild>
                        <Input type="text" width={'100%'}  placeHolder="이메일을 입력하세요" />
                     </FlexChild>
                  </VerticalFlex>
      
                  <VerticalFlex className={styles.input_item}>
                     <HorizontalFlex className={styles.label}>
                        <P>휴대폰번호</P>
                        <Span>(필수)</Span>
                     </HorizontalFlex>
                     <FlexChild>
                        <Input type="number" width={'100%'}  placeHolder="(+86)" />
                     </FlexChild>
                  </VerticalFlex>
      
                  <VerticalFlex className={styles.input_item}>
                     <HorizontalFlex className={styles.label}>
                        <P>아이디</P>
                        <Span>(필수)</Span>
                     </HorizontalFlex>
                     <FlexChild>
                        <Input type="text" width={'100%'}  placeHolder="아이디를 입력하세요" />
                     </FlexChild>
                  </VerticalFlex>
      
                  <VerticalFlex className={styles.input_item}>
                     <HorizontalFlex className={styles.label}>
                        <P>비밀번호</P>
                        <Span>(필수)</Span>
                     </HorizontalFlex>
                     <FlexChild>
                        <Input type="password" width={'100%'}  placeHolder="비밀번호를 입력하세요" />
                     </FlexChild>
                     <FlexChild>
                        <Input type="password" width={'100%'}  placeHolder="비밀번호를 한번 더 입력하세요" />
                     </FlexChild>
                  </VerticalFlex>
      
                  <VerticalFlex className={styles.input_item}>
                     <HorizontalFlex className={styles.label}>
                        <P>비밀번호 질문</P>
                     </HorizontalFlex>
                     <FlexChild>
                        <Select
                           classNames={{
                              header: 'web_select',
                              placeholder: 'web_select_placholder',
                              line: 'web_select_line',
                              arrow: 'web_select_arrow',
                              search: 'web_select_search',
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
                     <FlexChild>
                        <Input type="text" width={'100%'}  placeHolder="질문에 대한 답변을 입력하세요." />
                     </FlexChild>
                  </VerticalFlex>
               </VerticalFlex>
   
               <FlexChild>
                  <ContinueGroup />
               </FlexChild>
            </VerticalFlex>
   
   
            {/* 3단계 */}
            <VerticalFlex className={styles.signup_completed}>
               <FlexChild className={styles.completed_ttitle}>
                  <P>회원가입 완료</P>
               </FlexChild>

               <FlexChild className={styles.completed_txt}>
                  <P>
                     회원가입을 축하드립니다. <br />
                     푸푸토이와 함께 더 특별한 경험을 시작해 보세요!
                  </P>
               </FlexChild>

               <FlexChild>
                  <ContinueGroup />
               </FlexChild>
            </VerticalFlex>
         </VerticalFlex>


      </section>
   )


}