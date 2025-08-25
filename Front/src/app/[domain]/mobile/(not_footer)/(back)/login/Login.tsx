"use client";

import Button from "@/components/buttons/Button";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useClientEffect from "@/shared/hooks/useClientEffect";
import useNavigate from "@/shared/hooks/useNavigate";
import { emailFormat } from "@/shared/regExp";
import { requester } from "@/shared/Requester";
import { Cookies } from "@/shared/utils/Data";
import { getCookieOption, toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import styles from "./page.module.css";

export default function ({
  pre_id,
  redirect_url,
}: {
  pre_id?: string;
  redirect_url?: string;
}) {
  const [, setCookies, removeCookie] = useCookies();
  const [id, setId] = useState(pre_id || "");
  const [idFeedback, setIdFeedback] = useState("");
  const [password, setPassword] = useState("");
  const [checkList, setCheckList] = useState<any[]>(pre_id ? ["id"] : []);
  const navigate = useNavigate();
  const { userData } = useAuth();
  const handleSingup = () => {
    navigate("/signup");
  };
  const handleFindId = () => {
    navigate("/findId");
  };
  const handleFindPW = () => {
    navigate("/findPw");
  };
  const handleError = (error: string) => {
    let message;
    switch (error) {
      case "locked":
        message = (
          <VerticalFlex>
            <P className={styles.loginErrorTitle} paddingBottom={6}>
              비밀번호 연속 오류횟수 초과
            </P>
            <P className={styles.loginErrorDescription}>
              <Span>비밀번호를 </Span>
              <Span className={styles.loginErrorHighlight}>5회 이상 </Span>
              <Span>틀리셨습니다.</Span>
            </P>
            <P className={styles.loginErrorDescription}>
              잠시 후 다시 시도해주세요.
            </P>
          </VerticalFlex>
        );
        break;
      case "not_correct":
        message = (
          <VerticalFlex className={styles.loginErrorTitle}>
            <P>입력하신 정보가</P>
            <P>올바르지 않습니다.</P>
          </VerticalFlex>
        );
        break;
      case "deleted":
        message = (
          <VerticalFlex>
            <P className={styles.loginErrorTitle}>탈퇴한 계정입니다</P>
          </VerticalFlex>
        );
        break;
      case "not_allowed":
        message = (
          <VerticalFlex>
            <P className={styles.loginErrorTitle}>권한이 없습니다</P>
          </VerticalFlex>
        );
    }
    if (message)
      NiceModal.show("confirm", {
        message,
        confirmText: "확인",
        withCloseButton: true,
      });
  };
  useClientEffect(() => {
    if (userData) {
      if (redirect_url) navigate(redirect_url, { type: "replace" });
    }
  }, [userData]);

  return (
    <CheckboxGroup
      name="login"
      initialValues={checkList}
      onChange={(values) => setCheckList(values)}
    >
      <VerticalFlex padding={15} width={"100%"} gap={12}>
        <VerticalFlex gap={20}>
          <VerticalFlex gap={9}>
            <FlexChild width={"100%"}>
              <P>
                <Span className={styles.label}>아이디(이메일)</Span>
                <Span
                  className={styles.error}
                  hidden={!idFeedback}
                  paddingLeft={"1em"}
                >
                  {idFeedback}
                </Span>
              </P>
            </FlexChild>
            <FlexChild>
              <Input
                id="username"
                width={"100%"}
                value={id}
                onChange={(value) => setId(String(value))}
                placeHolder="아이디를 입력해주세요"
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    document.getElementById("password")?.focus();
                }}
                regExp={[emailFormat]}
                feedback="올바른 아이디 형식이 아닙니다."
                feedbackHide
                onFeedBackChange={(feedback) => setIdFeedback(feedback)}
              />
            </FlexChild>
          </VerticalFlex>
          <VerticalFlex gap={9}>
            <FlexChild>
              <P>비밀번호</P>
            </FlexChild>
            <FlexChild>
              <Input
                id="password"
                width={"100%"}
                type="password"
                onChange={(value) => setPassword(String(value))}
                placeHolder="비밀번호를 입력해주세요"
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    document.getElementById("login")?.click();
                }}
              />
            </FlexChild>
          </VerticalFlex>
        </VerticalFlex>
        <VerticalFlex gap={22}>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild gap={8}>
                <CheckboxChild id="auto" style={{ width: 22, height: 22 }} />
                <P weight={500} size={14} color="#474747">
                  자동 로그인
                </P>
              </FlexChild>
              <FlexChild width={"max-content"} hidden>
                <P>
                  <Span
                    weight={500}
                    size={14}
                    color="#474747"
                    textDecoration={"underline"}
                  >
                    일회용 로그인
                  </Span>{" "}
                  <Span
                    width={15}
                    height={15}
                    border={"1px solid #EAEAEA"}
                    fontSize={8}
                    borderRadius={"100%"}
                  >
                    ?
                  </Span>
                </P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <Button
              id="login"
              disabled={!id || !password}
              className={styles.button}
              onClick={() => {
                if (!id) {
                  document.getElementById("username")?.focus();
                  return toast({ message: "아이디를 입력해주세요" });
                }
                if (!password) {
                  document.getElementById("password")?.focus();
                  return toast({ message: "비밀번호를 입력해주세요" });
                }

                requester.login(
                  { username: id, password, keep: checkList.includes("auto") },
                  ({
                    access_token,
                    error,
                  }: {
                    access_token: string;
                    error?: string;
                  }) => {
                    if (access_token) {
                      if (checkList.includes("id"))
                        setCookies(
                          Cookies.ID,
                          id,
                          getCookieOption({ maxAge: 60 * 60 * 24 * 365 })
                        );
                      else removeCookie(Cookies.ID, getCookieOption());
                      setCookies(
                        Cookies.JWT,
                        access_token,
                        getCookieOption(
                          checkList.includes("auto")
                            ? {
                                maxAge: 60 * 60 * 24 * 31,
                              }
                            : {}
                        )
                      );
                      if (redirect_url)
                        navigate(redirect_url, { type: "replace" });
                    } else if (error) {
                      document.getElementById("username")?.focus();
                      handleError(error);
                    }
                  }
                );
              }}
            >
              <P size={"inherit"}>로그인</P>
            </Button>
          </FlexChild>
          <FlexChild justifyContent="center" gap={6}>
            <P
              fontWeight={500}
              size={14}
              color="#474747"
              onClick={handleFindId}
            >
              아이디 찾기
            </P>
            <Div width={0} height={10} borderRight={"1px solid #474747"} />
            <P
              fontWeight={500}
              size={14}
              color="#474747"
              onClick={handleFindPW}
            >
              비밀번호 찾기
            </P>
            <Div width={0} height={10} borderRight={"1px solid #474747"} />
            <P
              fontWeight={500}
              size={14}
              color="#474747"
              onClick={handleSingup}
            >
              회원가입
            </P>
          </FlexChild>
        </VerticalFlex>
        <FlexChild paddingTop={20} className={styles.divider}>
          <P margin={"0 8px"} color="#8b8b8b" weight={500} fontSize={14}>
            또는
          </P>
        </FlexChild>
        <FlexChild marginTop={8} justifyContent="center">
          <P weight={500} fontSize={14} color="#8b8b8b">
            SNS 계정으로 간편하게 로그인
          </P>
        </FlexChild>
        <FlexChild paddingTop={8} gap={20} justifyContent="center">
          <Image
            src="/resources/images/social_naver.png"
            size={54}
            borderRadius={"100%"}
          />
          <Image
            src="/resources/images/social_google.png"
            size={54}
            borderRadius={"100%"}
          />
        </FlexChild>
      </VerticalFlex>
    </CheckboxGroup>
  );
}
