import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivder";
import clsx from "clsx";
import { SearchParams } from "next/dist/server/request/search-params";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginFrame } from "./client";
import styles from "./page.module.css";
import P from "@/components/P/P";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { userData } = await useAuth();
  const { id, redirect_url } = await searchParams;
  if (userData?.id) {
    redirect(String(redirect_url || "/"));
  }
  return (
    <>
      <section
        className={clsx("mob_root mob_page_container", styles.container)}
      >
        <VerticalFlex className={styles.loginBox}>
          <P className={clsx(styles.login_txt, 'Wanted')}>LOGIN</P>

          <FlexChild className={styles.signup}>
            <VerticalFlex gap={30}>
              <VerticalFlex gap={20} width={"100%"}>
                <FlexChild className={styles.input_box}>
                  <Input
                    id="username"
                    placeHolder="아이디"
                    width={"100%"}
                    value={id as string}
                  />
                </FlexChild>

                <FlexChild className={styles.input_box}>
                  <Input
                    id="password"
                    type="password"
                    placeHolder="비밀번호"
                    width={"100%"}
                  />
                </FlexChild>
              </VerticalFlex>

              {/* 로그인 기능 */}
              <LoginFrame />
            </VerticalFlex>
          </FlexChild>
        </VerticalFlex>
      </section>
    </>
  );
}
