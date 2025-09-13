import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivder";
import clsx from "clsx";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignFeatures, SubmitGroup } from "./client";
import styles from "./page.module.css";

export default async function () {
  const { userData } = await useAuth();
  if (userData?.id) {
    redirect("/");
  }
  return (
    <>
      <section className={clsx("root ","page_container", styles.container)}>
        <VerticalFlex className={styles.loginBox}>
          <FlexChild className={styles.logo}>
            <Link href={"/"}>
              <Image src={"/resources/images/header/logo.png"} width={180} />
            </Link>
          </FlexChild>

          <FlexChild className={styles.signup}>
            <VerticalFlex gap={30}>
              <VerticalFlex gap={30} width={"100%"}>
                <FlexChild className={styles.input_box}>
                  <Span>아이디</Span>
                  <Input id="username" placeHolder="아이디" width={"100%"} />
                </FlexChild>

                <FlexChild className={styles.input_box}>
                  <Span>비밀번호</Span>
                  <Input
                    id="password"
                    type="password"
                    placeHolder="비밀번호"
                    width={"100%"}
                  />
                </FlexChild>
              </VerticalFlex>

              {/* 이메일 비밀번호 찾기, 로그인 상태 유지 */}
              <SignFeatures />

              <VerticalFlex gap={15}>
                {/* 로그인, 회원가입 버튼 */}
                <SubmitGroup />
              </VerticalFlex>
            </VerticalFlex>
          </FlexChild>
        </VerticalFlex>
      </section>
    </>
  );
}
