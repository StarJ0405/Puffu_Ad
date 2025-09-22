"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import ConfirmModal from "@/modals/confirm/ConfirmModal";
import ToastModal from "@/modals/toast/ToastModal";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import { Cookies } from "@/shared/utils/Data";
import { getCookieOption } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import styles from "./page.module.css";
import Image from "@/components/Image/Image";

export function PwStepBox() {

  const navigate = useNavigate();

  const testOnclick = ()=> console.log('111');

  return (
    <>
    { // 1단계 아이디, 이메일 입력
      1 > 0 && (
        <>
          <VerticalFlex className={styles.input_wrap}>
      
          <VerticalFlex gap={30} width={"100%"} className={styles.input_box}>
            <VerticalFlex className={styles.input_box} alignItems="start">
              <Span>비밀번호를 찾으려는 아이디</Span>
              <Input className="web_input" placeHolder="예)puffutoy12@puffu.com" width={"100%"} />
            </VerticalFlex>
    
            <VerticalFlex className={styles.input_box} alignItems="start">
              <Span>이름</Span>
              <Input className="web_input" value={'이름'} width={"100%"} />
            </VerticalFlex>
          </VerticalFlex>
    
          <VerticalFlex className={styles.find_id_link}>
            <P>아이디를 잊어버리셨나요?</P>
            <P 
              className={styles.link_btn}
              onClick={()=> navigate('/auth/find_id')}
            >
              아이디 찾기
            </P>
          </VerticalFlex>
        </VerticalFlex>

        <ButtonGroup confirmTxt={'다음'} NextOnClick={testOnclick} PrevOnClick={testOnclick} />
        </>
      )
    }

    { // 2단계 이메일 인증
      1 < 0 && (
        <>
          <VerticalFlex className={styles.input_wrap}>

          <VerticalFlex className={styles.sub_title}>
            <FlexChild className={styles.title}>
              <P>이메일 인증</P>
            </FlexChild>

            <FlexChild className={styles.txt}>
              <P>회원가입때 기입한 이메일로 인증을 보냅니다.</P>
            </FlexChild>
          </VerticalFlex>
      
          <FlexChild className={styles.mail_data}>
            <P>puff****@puffu.com</P>
          </FlexChild>
        </VerticalFlex>
        
        <ButtonGroup confirmTxt={'인증메일 보내기'} NextOnClick={testOnclick} PrevOnClick={testOnclick} prevhide={true} />
        </>
      )
    }


    { // 3단계 인증번호 입력
      1 < 0 && (
        <>
          <VerticalFlex className={styles.input_wrap}>

          <VerticalFlex className={styles.sub_title}>
            <FlexChild className={styles.title}>
              <P>인증번호 입력</P>
            </FlexChild>

            <FlexChild className={styles.txt}>
              <P>수신된 이메일의 인증번호를 입력해 주세요.</P>
            </FlexChild>
          </VerticalFlex>
      
          <VerticalFlex className={styles.input_box} alignItems="start">
            <Input className="web_input" placeHolder="인증번호 입력" width={"100%"} />
            <Span color="var(--main-color1)">남은 인증시간: 09:57</Span>
          </VerticalFlex>
        </VerticalFlex>
        
        <ButtonGroup confirmTxt={'다음'} NextOnClick={testOnclick} PrevOnClick={testOnclick} prevhide={true} />
        </>
      )
    }

    { // 4단계 비밀번호 변경
      1 < 0 && (
        <>
          <VerticalFlex className={styles.input_wrap}>

          <VerticalFlex className={styles.sub_title}>
            <FlexChild className={styles.title}>
              <P>비밀번호 변경</P>
            </FlexChild>

            <FlexChild className={styles.txt}>
              <P>새로운 비밀번호를 등록해 주세요.</P>
            </FlexChild>
          </VerticalFlex>
      
          <VerticalFlex className={styles.input_box} alignItems="start">
            <Input className="web_input" placeHolder="새 비밀번호를 입력해 주세요." width={"100%"} />
          </VerticalFlex>

          <VerticalFlex className={styles.input_box} alignItems="start">
            <Input className="web_input" placeHolder="새 비밀번호 확인" width={"100%"} />
          </VerticalFlex>
        </VerticalFlex>
        
        <ButtonGroup confirmTxt={'확인'} NextOnClick={testOnclick} PrevOnClick={testOnclick} />
        </>
      )
    }


    { // 5단계 비밀번호 변경
      1 < 0 && (
        <>
          <VerticalFlex className={styles.input_wrap}>
            <VerticalFlex className={styles.sub_title} gap={30} marginBottom={0}>
              <Image src={"/resources/images/pw_complete.png"} width={80} />
              <FlexChild className={styles.title}>
                <P size={25}>변경 완료</P>
              </FlexChild>

              <FlexChild className={styles.txt}>
                <P>비밀번호 재설정이 완료되었습니다.</P>
              </FlexChild>
            </VerticalFlex>
          </VerticalFlex>
        
        <ButtonGroup confirmTxt={'로그인하기'} NextOnClick={testOnclick} PrevOnClick={testOnclick} />
        </>
      )
    }
    </>
  )
}



// 하단 진행 버튼
export function ButtonGroup({
  confirmTxt,
  NextOnClick,
  PrevOnClick,
  prevhide = false,
} : {
  confirmTxt: string;
  NextOnClick: ()=> void;
  PrevOnClick: ()=> void;
  prevhide?: boolean;
}) {
  return (
    
    <FlexChild className={styles.button_group} justifyContent="center" gap={10}>
      {
        prevhide && (
          <Button className={clsx(styles.prev_btn, styles.btn, styles.disabled)} onClick={()=> PrevOnClick} disabled>
            <P>이전</P>
          </Button>
        )
      }

      <Button className={clsx(styles.next_btn, styles.btn)} onClick={()=> NextOnClick}>
        <P>{confirmTxt}</P>
      </Button>
    </FlexChild>
  )
}
