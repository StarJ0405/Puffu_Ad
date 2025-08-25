"use client";

import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import useNavigate from "@/shared/hooks/useNavigate";
import { emailFormat, passwordFormat } from "@/shared/regExp";
import { requester } from "@/shared/Requester";
import { toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

interface UpdateValue {
  key: string;
  value: any;
}
interface StepProps {
  setStep: Dispatch<SetStateAction<string>>;
  handleUpdate?: (value: UpdateValue[] | UpdateValue) => any;
  data?: any;
}

export default function () {
  const [step, setStep] = useState<string>("email");
  const data = useRef<any>({});
  const handleUpdate = (value: UpdateValue[] | UpdateValue) => {
    if (value) {
      (Array.isArray(value) ? value : [value]).forEach((v) => {
        data.current[v.key] = v.value;
      });
    }
    return data.current;
  };
  switch (step) {
    case "email":
      return (
        <Email setStep={setStep} handleUpdate={handleUpdate} data={data} />
      );
    case "email_ready":
      return (
        <EmailReday setStep={setStep} handleUpdate={handleUpdate} data={data} />
      );
    case "change_password":
      return <ChangePassword setStep={setStep} data={data} />;
    case "complete":
      return <Complete setStep={setStep} />;
    default:
      return (
        <FlexChild padding={15}>
          <P className={styles.title}>알 수 없는 오류가 발생했습니다.</P>
        </FlexChild>
      );
  }
}
function Email({ setStep, handleUpdate, data }: StepProps) {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState<string>(data.current.username || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setUsername(id);
    }
  }, [searchParams]);
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild paddingBottom={9}>
        <P className={styles.inputLabel}>비밀번호를 찾으려는 아이디(이메일)</P>
      </FlexChild>
      <FlexChild paddingBottom={9}>
        <Input
          placeHolder="예) puffu1234@puffu.com"
          regExp={[emailFormat]}
          className={styles.input}
          width={"100%"}
          value={username}
          feedback="올바른 아이디 형식이 아닙니다"
          feedbackHide
          onChange={(value) => setUsername(value as string)}
          onFeedBackChange={(feedback) => setError(feedback)}
        />
      </FlexChild>
      <FlexChild position="sticky" marginTop={"auto"}>
        <Button
          className={styles.button}
          disabled={!username || !!error}
          isLoading={isLoading}
          onClick={() => {
            setIsLoading(true);
            requester.isExistUser(
              {
                username,
              },
              ({ exist }: { exist: boolean }) => {
                if (exist) {
                  handleUpdate?.({ key: "username", value: username });
                  requester.sendEmail(
                    {
                      email: username,
                      update: true,
                    },
                    ({
                      message,
                      error,
                      code,
                    }: {
                      message: string;
                      error: any;
                      code: string;
                    }) => {
                      if (message) {
                        handleUpdate?.({
                          key: "email_code",
                          value: code,
                        });
                        setStep("email_ready");
                      } else if (error) {
                        toast({ message: error });
                        setIsLoading(false);
                      }
                    }
                  );
                } else {
                  NiceModal.show("confirm", {
                    message: "해당 이메일로 가입된 계정이 없습니다.",
                    confirmText: "확인",
                    onConfirm: () => {
                      setIsLoading(false);
                    },
                  });
                }
              }
            );
          }}
        >
          <P>다음</P>
        </Button>
      </FlexChild>
    </VerticalFlex>
  );
}

function EmailReday({ setStep, data, handleUpdate }: StepProps) {
  const dataRef = useRef<any>(data.current);
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  return (
    <VerticalFlex className={styles.wrapper}>
      <Image
        src="/resources/icons/mail.png"
        width={64}
        height={"auto"}
        marginBottom={32}
      />
      <P className={styles.title2} paddingBottom={13}>
        인증 메일을 전송했어요!
      </P>
      <P className={styles.mailDescription} paddingBottom={"0.25em"}>
        가입 완료를 위해 메일을 확인 후
      </P>
      <P className={styles.mailDescription} paddingBottom={20}>
        인증코드를 입력해주세요.
      </P>
      <FlexChild
        className={styles.mailWrapper}
        marginBottom={40}
        justifyContent="center"
      >
        <P className={styles.mailLabel}>{data.current.username}</P>
      </FlexChild>
      <FlexChild paddingBottom={16}>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>인증코드</P>
          </FlexChild>
          <FlexChild>
            <Input
              id="code"
              className={styles.input}
              width={"100%"}
              placeHolder="인증코드 6자리"
              value={code}
              maxLength={6}
              onChange={(value) => {
                setCode(value as string);
                if (String(value).length === 6)
                  document.getElementById("code")?.blur();
              }}
            />
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
      <P
        className={styles.mailResend}
        onClick={() => {
          NiceModal.show("confirm", {
            confirmText: "재전송",
            cancelText: "취소",
            message: "인증메일을 다시 보내시겠습니까?",
            onConfirm: () => {
              if (isLoading) return;
              setIsLoading(true);
              requester.sendEmail(
                {
                  email: dataRef.current.username,
                  update: true,
                },
                ({
                  message,
                  error,
                  code,
                }: {
                  message: string;
                  error: any;
                  code: string;
                }) => {
                  if (message) {
                    dataRef.current = handleUpdate?.({
                      key: "email_code",
                      value: code,
                    });
                    const element = document.getElementById("code");
                    element?.focus();
                    if (element instanceof HTMLInputElement) element.value = "";
                    setIsLoading(false);
                  } else if (error) {
                    toast({ message: error });
                    setIsLoading(false);
                  }
                }
              );
            },
          });
        }}
      >
        인증 메일 다시 전송하기
      </P>
      <FlexChild position="sticky" bottom={0} marginTop={"auto"}>
        <HorizontalFlex gap={9}>
          <FlexChild>
            <Button
              className={clsx(styles.button, styles.white)}
              onClick={() => {
                setStep("email");
              }}
            >
              이전
            </Button>
          </FlexChild>
          <FlexChild>
            <Button
              className={styles.button}
              disabled={!code || String(code).length < 6}
              onClick={() => {
                if (dataRef?.current?.email_code === code) {
                  setStep("change_password");
                } else {
                  NiceModal.show("confirm", {
                    message: "인증 실패. 이메일을 확인해주세요",
                    confirmText: "확인",
                    onConfirm: () => {
                      const element = document.getElementById("code");
                      element?.focus();
                      if (element instanceof HTMLInputElement)
                        element.value = "";
                    },
                  });
                }
              }}
            >
              인증완료
            </Button>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}

function ChangePassword({ data, setStep }: StepProps) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [password2, setPassword2] = useState("");
  const [passwordError2, setPasswordError2] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild>
        <P className={styles.title2} paddingBottom={"0.5em"}>
          본인인증이 완료되었습니다
        </P>
      </FlexChild>
      <FlexChild paddingBottom={30}>
        <P className={styles.title2}>비밀번호를 재설정해주세요</P>
      </FlexChild>
      <FlexChild paddingBottom={9}>
        <P className={styles.inputLabel}>
          재설정 비밀번호<Span className={styles.inputRequire}>*</Span>
          <Span className={styles.inputError} paddingLeft={6}>
            {passwordError}
          </Span>
        </P>
      </FlexChild>
      <FlexChild paddingBottom={25}>
        <Input
          type="password"
          className={styles.input}
          width={"100%"}
          regExp={[passwordFormat]}
          placeHolder="영문 대소문자, 숫자, 특수문자 조합 최소8자"
          feedback="영문 대소문자, 숫자, 특수문자 조합 최소8자"
          value={password}
          onChange={(value) => setPassword(value as string)}
          onFeedBackChange={(feedback) => setPasswordError(feedback)}
          feedbackHide
        />
      </FlexChild>
      <FlexChild paddingBottom={9}>
        <P className={styles.inputLabel}>
          재설정 비밀번호 확인<Span className={styles.inputRequire}>*</Span>
          <Span className={styles.inputError} paddingLeft={6}>
            {passwordError2}
          </Span>
        </P>
      </FlexChild>
      <FlexChild>
        <Input
          type="password"
          className={styles.input}
          width={"100%"}
          regExp={[
            {
              exp: {
                test: (value) => value === password,
              },
            },
          ]}
          feedback="비밀번호가 일치하지 않습니다"
          value={password2}
          onChange={(value) => setPassword2(value as string)}
          onFeedBackChange={(feedback) => setPasswordError2(feedback)}
          feedbackHide
        />
      </FlexChild>
      <FlexChild position="sticky" marginTop={"auto"}>
        <Button
          className={styles.button}
          disabled={
            !password || !password2 || !!passwordError || !!passwordError2
          }
          isLoading={isLoading}
          onClick={() => {
            setIsLoading(true);
            const { username, email_code } = data.current;
            requester.changePassword(
              username,
              {
                password,
                code: email_code,
              },
              ({ message, error }: { message: string; error: string }) => {
                if (message) {
                  setStep("complete");
                } else if (error) {
                  setIsLoading(false);
                  NiceModal.show("confirm", {
                    message: error,
                    confirmText: "확인",
                  });
                }
              }
            );
          }}
        >
          <P>비밀번호 변경하기</P>
        </Button>
      </FlexChild>
    </VerticalFlex>
  );
}

function Complete({}: StepProps) {
  const navigate = useNavigate();
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild margin={"auto"}>
        <VerticalFlex>
          <Image
            src="/resources/icons/check.png"
            width={61}
            height={61}
            marginBottom={31}
          />
          <P className={styles.title} paddingBottom={10}>
            비밀번호 변경 완료!
          </P>
          <P className={styles.completeDescription} paddingBottom={"0.25em"}>
            비밀번호 변경이 완료되었습니다.
          </P>
          <P className={styles.completeDescription}>
            새로운 비밀번호로 로그인해주세요.
          </P>
        </VerticalFlex>
      </FlexChild>
      <FlexChild position="sticky" bottom={0} marginTop={"auto"}>
        <Button
          className={styles.button}
          onClick={() => {
            navigate("/login");
          }}
        >
          로그인하러 가기
        </Button>
      </FlexChild>
    </VerticalFlex>
  );
}
