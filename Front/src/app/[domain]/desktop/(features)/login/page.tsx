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
import style from './page.module.css'

export default async function () {
   return (
      <>
         <Container className={clsx('desktop_container', style.container)}>
            <VerticalFlex className={style.loginBox}>
               <FlexChild className={style.logo}>
                  <Link href={'/'}>
                     <Image src={'/resources/images/header/logo.png'} width={180} />
                  </Link>
               </FlexChild>

               <FlexChild className={style.signup}>
                  <VerticalFlex gap={30}>
                     <VerticalFlex gap={30} width={'100%'}>
                        <FlexChild className={style.input_box}>
                           <Span>아이디</Span>
                           <Input placeHolder="아이디" width={'100%'} />
                        </FlexChild>
   
                        <FlexChild className={style.input_box}>
                           <Span>비밀번호</Span>
                           <Input type="password" placeHolder="비밀번호" width={'100%'} />
                        </FlexChild>
                     </VerticalFlex>

                     <HorizontalFlex className={style.sign_features}>
                        <FlexChild>
                           {/* <CheckboxChild id={'11'} /> */}
                           <Span cursor="poointer">로그인 상태 유지</Span>
                        </FlexChild>

                        <FlexChild className={style.find_box}>
                           <FlexChild>
                              <Span>이메일 찾기</Span>
                           </FlexChild>

                           <Span>|</Span>

                           <FlexChild>
                              <Span>비밀번호 찾기</Span>
                           </FlexChild>
                        </FlexChild>
                     </HorizontalFlex>

                     <VerticalFlex gap={15}>
                        <Button className={clsx(style.login_btn, style.btn)}>로그인</Button>
                        <Button className={clsx(style.join_btn, style.btn)}>회원가입</Button>
                     </VerticalFlex>
                  </VerticalFlex>
               </FlexChild>
            </VerticalFlex>
         </Container>
      </>
   )


}