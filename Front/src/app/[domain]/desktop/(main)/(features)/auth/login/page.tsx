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
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import Link from "next/link";
import clsx from "clsx";
import styles from './page.module.css'
import {SignFeatures, SubmitGroup} from './client' 


export default async function () {
   
   return (
      <>
         <Container className={clsx('page_container', styles.container)}>
            <VerticalFlex className={styles.loginBox}>
               <FlexChild className={styles.logo}>
                  <Link href={'/'}>
                     <Image src={'/resources/images/header/logo.png'} width={180} />
                  </Link>
               </FlexChild>

               <FlexChild className={styles.signup}>
                  <VerticalFlex gap={30}>
                     <VerticalFlex gap={30} width={'100%'}>
                        <FlexChild className={styles.input_box}>
                           <Span>아이디</Span>
                           <Input placeHolder="아이디" width={'100%'} />
                        </FlexChild>
   
                        <FlexChild className={styles.input_box}>
                           <Span>비밀번호</Span>
                           <Input type="password" placeHolder="비밀번호" width={'100%'} />
                        </FlexChild>
                     </VerticalFlex>

                     {/* 이메일 비밀번호 찾기, 로그인 상태 유지 */}
                     <SignFeatures />

                     <VerticalFlex gap={15}>
                        {/* 로그인, 회원가입 버튼 */}
                        <SubmitGroup/>
                     </VerticalFlex>
                  </VerticalFlex>
               </FlexChild>
            </VerticalFlex>
         </Container>
      </>
   )


}