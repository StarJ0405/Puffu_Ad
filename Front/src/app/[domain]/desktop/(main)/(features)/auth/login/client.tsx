"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Span from "@/components/span/Span";
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
import { useSearchParams } from "next/navigation";
import Image from "@/components/Image/Image";

export function LoginFrame() {
  const [loginKeep, setLoginkeep] = useState<boolean>(false);

  return (
    <>
      <SignFeatures loginKeep={loginKeep} setLoginkeep={setLoginkeep} />

      <VerticalFlex gap={15} marginTop={10}>
        {/* 로그인, 회원가입 버튼 */}
        <SubmitGroup loginKeep={loginKeep} />
      </VerticalFlex>
    </>
  );
}

export function SignFeatures({
  loginKeep,
  setLoginkeep,
}: {
  loginKeep: boolean;
  setLoginkeep: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();

  return (
    <HorizontalFlex className={styles.sign_features}>
      <FlexChild
        className={clsx(styles.login_and, loginKeep && styles.active)}
        width={"auto"}
      >
        <label>
          <input type="checkbox" checked={loginKeep} onChange={() => setLoginkeep((prev) => !prev)} />
          <div className={styles.check_custom}>
            <Image
              src={"/resources/icons//checkBox_icon.png"}
              width={10}
            />
          </div>
          <Span cursor="pointer">로그인 상태 유지</Span>
        </label>
      </FlexChild>

      <FlexChild className={styles.find_box}>
        <FlexChild onClick={() => navigate("/auth/find_id")}>
          <Span>아이디 찾기</Span>
        </FlexChild>

        <Span>|</Span>

        <FlexChild onClick={() => navigate("/auth/find_pw")}>
          <Span>비밀번호 찾기</Span>
        </FlexChild>
      </FlexChild>
    </HorizontalFlex>
  );
}

export function SubmitGroup({ loginKeep }: { loginKeep: boolean }) {
  const { userData } = useAuth();
  const [, setCookies] = useCookies([Cookies.JWT]);
  const navigate = useNavigate();
  const searchParams = useSearchParams();
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
          keep: loginKeep,
        });
        if (access_token) {
          setCookies(Cookies.JWT, access_token, getCookieOption());
          return navigate("/");
        } else {
          return NiceModal.show(ToastModal, {
            message: "아이디 또는 비밀번호가 잘못 되었습니다.",
            className: "custom-toast-body",
            withCloseButton: true,
            messageBoxClassName: "custom-toast",
            autoClose: 5000,
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
    if (userData?.id) navigate(searchParams.get("redirect_url") || "/");
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
