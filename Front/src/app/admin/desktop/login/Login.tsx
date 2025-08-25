"use client";

import Button from "@/components/buttons/Button";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import { adminRequester } from "@/shared/AdminRequester";
import useNavigate from "@/shared/hooks/useNavigate";
import { Cookies } from "@/shared/utils/Data";
import { getCookieOption, toast } from "@/shared/utils/Functions";
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
  const [password, setPassword] = useState("");
  const [checkList, setCheckList] = useState<any[]>(pre_id ? ["id"] : []);
  const navigate = useNavigate();

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

                adminRequester.login(
                  {
                    username: id,
                    password,
                    keep: checkList.includes("auto"),
                    role: "admin",
                  },
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
                        Cookies.ADMIN_JWT,
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
      </VerticalFlex>
    </CheckboxGroup>
  );
}
