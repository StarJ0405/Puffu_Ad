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
import { requester } from "@/shared/Requester";
import { Cookies } from "@/shared/utils/Data";
import { getCookieOption, toast } from "@/shared/utils/Functions";
import clsx from "clsx";
import { useState } from "react";
import { useCookies } from "react-cookie";
import styles from "./page.module.css";
export default function ({
  appid,
  name,
  redirect_uri,
  state,
}: {
  appid: string;
  name: string;
  redirect_uri: string;
  state?: string;
}) {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const handleCancel = () => {
    navigate(`${redirect_uri}${state ? `?state=${state}` : ""}`);
  };
  const handelAccept = () => {
    requester.userConnect(
      {
        appid,
      },
      ({ code }: { code?: string }) => {
        if (code) {
          navigate(
            `${redirect_uri}?code=${code}${state ? `&state=${state}` : ""}`
          );
        } else toast({ message: "알 수 없는 오류가 발생했습니다." });
      }
    );
  };
  useClientEffect(() => {
    if (!userData) navigate(0);
  }, [userData]);
  return (
    <VerticalFlex>
      <FlexChild padding={15} height={52}>
        <Image
          src="/resources/images/left_arrow.png"
          height={16}
          width={"auto"}
          onClick={handleCancel}
        />
      </FlexChild>
      <VerticalFlex className={styles.oauthWrapper}>
        <P className={styles.oauthTitle} paddingBottom={"0.5em"}>
          푸푸 통합 계정으로 로그인합니다.
        </P>
        <P className={styles.oauthTitle} paddingBottom={70}>
          동의하시겠습니까?
        </P>

        <FlexChild className={styles.oauthDescriptionWrapper} marginBottom={30}>
          <VerticalFlex gap={10}>
            <FlexChild>
              <P className={styles.oauthDescriptionTitle}>추가 안내 사항</P>
            </FlexChild>
            <FlexChild>
              <P className={styles.oauthDescriptionContent}>
                사용자의 기본 프로필(이메일, 이름 등)이 푸푸 통합 계정 로그인에
                사용됩니다.
              </P>
            </FlexChild>
            <FlexChild>
              <P className={styles.oauthDescriptionContent}>
                '취소'를 선택하면 푸푸통합계정 로그인은 사용할 수 없습니다.
              </P>
            </FlexChild>
            <FlexChild>
              <P className={styles.oauthDescriptionContent}>
                동의하시면 제공된 정보는 푸푸 서비스 운영 목적에 한해 활용되며,
                관련 법령 및 개인정보 처리방침에 따라 안전하게 관리됩니다.
              </P>
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex justifyContent="center" gap={9}>
            <Button
              className={clsx(styles.oauthButton, styles.oauthCancel)}
              onClick={handleCancel}
            >
              취소
            </Button>
            <Button
              className={clsx(styles.oauthButton, styles.oauthAccept)}
              onClick={handelAccept}
            >
              동의하고 계속
            </Button>
          </HorizontalFlex>
        </FlexChild>
      </VerticalFlex>
    </VerticalFlex>
  );
}

export function Login({ pre_id }: { pre_id?: string }) {
  const [, setCookies, removeCookie] = useCookies();
  const [id, setId] = useState(pre_id || "");
  const [password, setPassword] = useState("");
  const [checkList, setCheckList] = useState<any[]>(pre_id ? ["id"] : []);
  const navigate = useNavigate();
  const { userData } = useAuth();
  useClientEffect(() => {
    if (userData) navigate(0);
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
              <P className={styles.label}>아이디(이메일)</P>
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
              />
            </FlexChild>
          </VerticalFlex>
          <VerticalFlex gap={9}>
            <FlexChild>
              <P className={styles.label}>비밀번호</P>
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
              <FlexChild width={"max-content"}>
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
                      setCookies(Cookies.JWT, access_token, getCookieOption());
                      navigate(0);
                    } else if (error) {
                      document.getElementById("username")?.focus();
                      return toast({ message: error });
                    }
                  }
                );
              }}
            >
              <P size={"inherit"}>로그인</P>
            </Button>
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
