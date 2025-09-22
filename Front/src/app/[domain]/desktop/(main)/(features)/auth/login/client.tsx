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

export function SignFeatures() {
  const navigate = useNavigate();
  const [idStep, setidStep] = useState(0);

  const IdLostModal = () => {
    NiceModal.show(ConfirmModal, {
      // title: '아이디 찾기',
      message: <LostId idStep={idStep} />,
      confirmText: `
         ${idStep === 0 && "아이디 찾기"}
         ${idStep === 1 && "확인"}
      `,
      // onclick: setPaswwordStep(1),
      withCloseButton: true,
      onConfirm: async () => {},
    });
  };

  const [passwordStep, setPaswwordStep] = useState(0);

  const passwordLostModal = () => {
    NiceModal.show(ConfirmModal, {
      // title: '비밀번호 찾기',
      message: <Lostpassword passwordStep={passwordStep} />,
      confirmText: `
         ${passwordStep === 0 && "다음"}
         ${passwordStep === 1 && "확인"}
      `,
      // onclick: setPaswwordStep(1),
      withCloseButton: true,
      onConfirm: async () => {},
    });
  };

  return (
    <HorizontalFlex className={styles.sign_features}>
      <FlexChild className={styles.login_and} width={"auto"}>
        {/* <CheckboxChild id={'11'} /> */}
        <Span cursor="poointer">로그인 상태 유지</Span>
      </FlexChild>

      <FlexChild className={styles.find_box}>
        <FlexChild onClick={()=> navigate('/auth/find_id')}>
          <Span>아이디 찾기</Span>
        </FlexChild>

        <Span>|</Span>

        <FlexChild onClick={()=> navigate('/auth/find_pw')}>
          <Span>비밀번호 찾기</Span>
        </FlexChild>
      </FlexChild>
    </HorizontalFlex>
  );
}

export function LostId({ idStep }: { idStep: number }) {
  return (
    <VerticalFlex className="modal_edit_info" gap={50}>
      <FlexChild className="title" justifyContent="center">
        <P size={25} weight={600}>
          회원 아이디 찾기
        </P>
      </FlexChild>

      {
        // 1단계 아이디 찾기
        idStep === 0 && (
          <FlexChild>
            <VerticalFlex alignItems="start" gap={30}>
              <VerticalFlex className={"input_box"} alignItems="start" gap={10}>
                <P size={16} color="#333" weight={600}>
                  이름
                </P>
                <Input
                  type="text"
                  width={"100%"}
                  placeHolder="가입했던 이름을 입력해 주세요"
                />
              </VerticalFlex>

              <VerticalFlex className={"input_box"} alignItems="start" gap={10}>
                <P size={16} color="#333" weight={600}>
                  휴대폰번호
                </P>
                <Input
                  type="text"
                  width={"100%"}
                  placeHolder="(+86)00000000000"
                />
              </VerticalFlex>
            </VerticalFlex>
          </FlexChild>
        )
      }

      {
        // 2단계 아이디 보여주기
        idStep === 1 && (
          <FlexChild>
            <VerticalFlex alignItems="center" gap={30}>
              <VerticalFlex
                className={"input_box"}
                alignItems="center"
                gap={10}
                marginBottom={30}
              >
                <P size={18} color="#333" weight={600}>
                  회원님의 아이디는
                </P>
                <P size={25} color="#333" weight={600}>
                  <Span color="var(--main-color1)">nah****</Span> 입니다.
                </P>
              </VerticalFlex>
            </VerticalFlex>
          </FlexChild>
        )
      }
    </VerticalFlex>
  );
}

export function Lostpassword({ passwordStep }: { passwordStep: number }) {
  return (
    <VerticalFlex className="modal_edit_info" gap={50}>
      <FlexChild className="title" justifyContent="center">
        <P size={25} weight={600}>
          {passwordStep === 0 && "비밀번호 찾기"}
          {passwordStep === 1 && "비밀번호 변경"}
        </P>
      </FlexChild>

      {
        // 1단계 비밀번호 찾기
        passwordStep === 0 && (
          <FlexChild>
            <VerticalFlex alignItems="start" gap={30}>
              <VerticalFlex className={"input_box"} alignItems="start" gap={10}>
                <P size={16} color="#333" weight={600}>
                  이름
                </P>
                <Input
                  type="text"
                  width={"100%"}
                  placeHolder="가입했던 이름을 입력해 주세요"
                />
              </VerticalFlex>

              <VerticalFlex className={"input_box"} alignItems="start" gap={10}>
                <P size={16} color="#333" weight={600}>
                  휴대폰번호
                </P>
                <Input
                  type="text"
                  width={"100%"}
                  placeHolder="(+86)00000000000"
                />
              </VerticalFlex>

              <VerticalFlex className={"input_box"} alignItems="start" gap={10}>
                <P size={16} color="#333" weight={600}>
                  이메일
                </P>
                <Input
                  type="text"
                  width={"100%"}
                  placeHolder="이메일을 입력하세요."
                />
              </VerticalFlex>
            </VerticalFlex>
          </FlexChild>
        )
      }

      {
        // 2단계 비밀번호 변경
        passwordStep === 1 && (
          <FlexChild>
            <VerticalFlex alignItems="start" gap={30}>
              <VerticalFlex className={"input_box"} alignItems="start" gap={10}>
                <P size={16} color="#333" weight={600}>
                  새 비밀번호 입력
                </P>
                <Input
                  type="text"
                  width={"100%"}
                  placeHolder="새 비밀번호 입력"
                />
              </VerticalFlex>

              <VerticalFlex className={"input_box"} alignItems="start" gap={10}>
                <P size={16} color="#333" weight={600}>
                  새 비밀번호 확인
                </P>
                <Input
                  type="text"
                  width={"100%"}
                  placeHolder="새 비밀번호 확인"
                />
              </VerticalFlex>
            </VerticalFlex>
          </FlexChild>
        )
      }
    </VerticalFlex>
  );
}

export function SubmitGroup() {
  const { userData } = useAuth();
  const [, setCookies] = useCookies([Cookies.JWT]);
  const navigate = useNavigate();
  useEffect(() => {
    const _username = document.getElementById("username");
    const _password = document.getElementById("password");
    const onKeydownId: HTMLElement["onkeydown"] = (e) => {
      if (e.key === "Enter") {
        const _password = document.getElementById("password");
        _password?.focus();
      }
    };
    const onKeydownPassword: HTMLElement["onkeydown"] = (e) => {
      if (e.key === "Enter") {
        const _login = document.getElementById("login");
        _login?.click();
      }
    };

    _username?.addEventListener("keydown", onKeydownId);
    _password?.addEventListener("keydown", onKeydownPassword);
    return () => {
      _username?.removeEventListener("keydown", onKeydownId);
      _password?.removeEventListener("keydown", onKeydownPassword);
    };
  }, []);
  const onClick = async () => {
    const _username = document.getElementById("username");
    const _password = document.getElementById("password");
    if (
      _username instanceof HTMLInputElement &&
      _password instanceof HTMLInputElement
    ) {
      const username = _username.value;
      const password = _password.value;
      if (username && password) {
        const { access_token } = await requester.login({
          username,
          password,
        });
        if (access_token) {
          setCookies(Cookies.JWT, access_token, getCookieOption());
          return navigate("/");
        } else {
          return NiceModal.show(ToastModal, {
            message: "아이디, 비밀번호를 확인해주세요.",
            className: "custom-toast-body",
            withCloseButton: true,
            messageBoxClassName: "custom-toast",
            autoClose: 5000000,
          });
        }
      }
    }

    NiceModal.show(ToastModal, {
      message: "아이디, 비밀번호를 입력해주세요.",
      className: "custom-toast-body",
      withCloseButton: true,
      messageBoxClassName: "custom-toast",
    });
  };
  useEffect(() => {
    if (userData?.id) navigate("/");
  }, [userData]);
  return (
    <>
      <Button
        id="login"
        onClick={onClick}
        className={clsx(styles.login_btn, styles.btn)}
      >
        로그인
      </Button>
      <Button
        className={clsx(styles.join_btn, styles.btn)}
        onClick={() => navigate("/auth/signup")}
      >
        회원가입
      </Button>
    </>
  );
}
