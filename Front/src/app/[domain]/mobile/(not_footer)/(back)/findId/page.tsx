"use client";

import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import useClientEffect from "@/shared/hooks/useClientEffect";
import useNavigate from "@/shared/hooks/useNavigate";
import {
  birthday6Format,
  birthday8Format,
  mobileNoFormat,
  numberOnlyFormat,
} from "@/shared/regExp";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { Dispatch, SetStateAction, useRef, useState } from "react";
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
  const [step, setStep] = useState<string>("certification");
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
    case "certification":
      return <Certification setStep={setStep} />;
    case "pass":
      return <PASS setStep={setStep} handleUpdate={handleUpdate} />;
    case "pass_ready":
      return (
        <PassReady setStep={setStep} data={data} handleUpdate={handleUpdate} />
      );
    case "sms":
      return <SMS setStep={setStep} handleUpdate={handleUpdate} />;
    case "found":
      return <Found setStep={setStep} data={data} />;
    case "not_found":
      return <NotFound setStep={setStep} />;
    default:
      return (
        <FlexChild padding={15}>
          <P className={styles.title}>알 수 없는 오류가 발생했습니다.</P>
        </FlexChild>
      );
  }
}

function Certification({ setStep }: StepProps) {
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild paddingBottom={"0.5em"}>
        <P className={styles.title2}>아이디 찾기를 위해</P>
      </FlexChild>
      <FlexChild paddingBottom={30}>
        <P className={styles.title2}>본인인증이 필요해요</P>
      </FlexChild>
      <FlexChild
        className={styles.certificationBox}
        marginBottom={12}
        onClick={() => setStep("pass")}
      >
        <HorizontalFlex>
          <FlexChild width={75}>
            <Image
              src="/resources/images/PASS.png"
              height={36}
              width={"auto"}
            />
          </FlexChild>
          <FlexChild>
            <P>PASS 인증</P>
          </FlexChild>
          <FlexChild width={"max-content"}>
            <Image
              src="/resources/icons/arrow_right.png"
              height={11}
              width={"auto"}
            />
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild
        className={styles.certificationBox}
        onClick={() => setStep("sms")}
      >
        <HorizontalFlex>
          <FlexChild width={75}>
            <Image src="/resources/images/SMS.png" height={36} width={"auto"} />
          </FlexChild>
          <FlexChild>
            <P>SMS 인증</P>
          </FlexChild>
          <FlexChild width={"max-content"}>
            <Image
              src="/resources/icons/arrow_right.png"
              height={11}
              width={"auto"}
            />
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}

function PASS({ setStep, handleUpdate }: StepProps) {
  const phoneStations = [
    { label: "SKT", value: "SKT" },
    { label: "KT", value: "KT" },
    { label: "LG U+", value: "LGU" },
    { label: "SKT 알뜰폰", value: "SKTMVNO" },
    { label: "KT 알뜰폰", value: "KTMVNO" },
    { label: "LG U+ 알뜰폰", value: "LGUMVNO" },
  ];
  const [name, setName] = useState<string>("");
  const [birthday, setBirthDay] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneStation, setPhoneStation] = useState(phoneStations[0]);
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild>
        <P paddingBottom={"0.5em"} className={styles.title2}>
          인증을 위해 필요한
        </P>
      </FlexChild>
      <FlexChild paddingBottom={30}>
        <P className={styles.title2}>정보를 입력해주세요</P>
      </FlexChild>
      <FlexChild paddingBottom={20}>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>이름</P>
          </FlexChild>
          <FlexChild>
            <Input
              id="name"
              className={styles.input}
              placeHolder="이름을 입력하세요"
              width={"100%"}
              noWhiteSpace
              onChange={(value) => setName(value as string)}
            />
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
      <FlexChild paddingBottom={20}>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>생년월일</P>
          </FlexChild>
          <FlexChild>
            <Input
              id="birthday"
              className={styles.input}
              placeHolder="YYYYMMDD"
              width={"100%"}
              onFilter={(value: any) => value.replace(numberOnlyFormat.exp, "")}
              maxLength={8}
              noWhiteSpace
              onChange={(value) => {
                setBirthDay(value as string);
                if (String(value).length === 8) {
                  document.getElementById("birthday")?.blur();
                  document.getElementById("phoneStation")?.click();
                }
              }}
            />
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
      <FlexChild paddingBottom={20}>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>휴대폰 번호</P>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex gap={10}>
              <FlexChild
                id="phoneStation"
                height={50}
                width={114}
                className={styles.phoneStationBox}
                onClick={() =>
                  NiceModal.show("list", {
                    list: phoneStations,
                    selected: phoneStation,
                    onSelect: (value: any) => {
                      setPhoneStation(value);
                      document.getElementById("phone")?.focus();
                    },
                  })
                }
              >
                <P>{phoneStation.label}</P>
                <Image
                  src="/resources/icons/down_arrow.png"
                  width={11}
                  height={"auto"}
                  marginLeft={"auto"}
                />
              </FlexChild>
              <FlexChild>
                <Input
                  id="phone"
                  className={styles.input}
                  placeHolder="'-' 없이 숫자만 입력"
                  width={"100%"}
                  onFilter={(value: any) =>
                    value.replace(numberOnlyFormat.exp, "")
                  }
                  maxLength={11}
                  noWhiteSpace
                  onChange={(value) => {
                    setPhone(value as string);
                    if (String(value).length === 11)
                      document.getElementById("phone")?.blur();
                  }}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
      <FlexChild position="sticky" bottom={0} marginTop={"auto"}>
        <HorizontalFlex gap={9}>
          <FlexChild>
            <Button
              className={clsx(styles.button, styles.white)}
              onClick={() => {
                setStep("certification");
              }}
            >
              이전
            </Button>
          </FlexChild>
          <FlexChild>
            <Button
              className={styles.button}
              onClick={async () => {
                const { mokToken: token } = await requester.getToken();
                const data = handleUpdate?.([
                  {
                    key: "userPhoneNum",
                    value: phone,
                  },
                  {
                    key: "providerid",
                    value: phoneStation.value,
                  },
                  {
                    key: "reqAuthType",
                    value: "PASS",
                  },
                  {
                    key: "userName",
                    value: name,
                  },
                  {
                    key: "birthday",
                    value: birthday,
                  },
                  {
                    key: "MOKAuthRequestData",
                    value: JSON.stringify({
                      encryptMOKToken: token.encryptMOKToken,
                      publicKey: token.publicKey,
                    }),
                  },
                ]);
                requester.verification(data, (result: any) => {
                  const response = JSON.parse(result.MOKConfirmData);
                  if (response.resultCode === "2000") {
                    handleUpdate?.([
                      { key: "token", value: token },
                      { key: "verification", value: result },
                    ]);
                    setStep("pass_ready");
                  } else if (response.resultCode === "3001") {
                    NiceModal.show("confirm", {
                      message:
                        "입력하신 정보가 올바르지 않습니다. 확인 후 다시 시도해주세요.",
                      confirmText: "확인",
                    });
                  }
                });
              }}
              disabled={
                !mobileNoFormat.exp.test(phone) ||
                !birthday8Format.exp.test(birthday) ||
                !name
              }
            >
              다음
            </Button>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}

function SMS({ setStep, handleUpdate }: StepProps) {
  const phoneStations = [
    { label: "SKT", value: "SKT" },
    { label: "KT", value: "KT" },
    { label: "LG U+", value: "LGU" },
    { label: "SKT 알뜰폰", value: "SKTMVNO" },
    { label: "KT 알뜰폰", value: "KTMVNO" },
    { label: "LG U+ 알뜰폰", value: "LGUMVNO" },
  ];
  const [name, setName] = useState<string>("");
  const [identification, setIdentification] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneStation, setPhoneStation] = useState(phoneStations[0]);
  const [phoneApprove, setPhoneApprove] = useState<"ready" | "continue">(
    "ready"
  );
  const [time, setTime] = useState<number>(0);
  const [code, setCode] = useState<string>("");
  const timer = useRef<any>(null);
  const dataRef = useRef<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const sendSMS = () => {
    if (timer.current) clearTimeout(timer.current);
    const { data, token } = dataRef.current;
    requester.verification(data, (result: any) => {
      const response = JSON.parse(result.MOKConfirmData);
      if (response.resultCode === "2000") {
        const data = handleUpdate?.([
          { key: "token", value: token },
          { key: "verification", value: result },
        ]);
        dataRef.current = data;
        setPhoneApprove("continue");
        setTime(3 * 60);
        document.getElementById("code")?.focus();
        setIsLoading(false);
      } else if (response.resultCode === "3001") {
        setIsLoading(false);
        NiceModal.show("confirm", {
          message:
            "입력하신 정보가 올바르지 않습니다. 확인 후 다시 시도해주세요.",
          confirmText: "확인",
        });
      }
    });
  };
  useClientEffect(() => {
    if (phoneApprove === "continue") document.getElementById("code")?.focus();
  }, [phoneApprove]);
  useClientEffect(() => {
    if (time > 0) {
      timer.current = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }
  }, [time]);
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild>
        <P paddingBottom={"0.5em"} className={styles.title2}>
          인증을 위해 필요한
        </P>
      </FlexChild>
      <FlexChild paddingBottom={30}>
        <P className={styles.title2}>정보를 입력해주세요</P>
      </FlexChild>
      <FlexChild paddingBottom={20}>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>이름</P>
          </FlexChild>
          <FlexChild>
            <Input
              id="name"
              className={styles.input}
              placeHolder="이름을 입력하세요"
              width={"100%"}
              noWhiteSpace
              onChange={(value) => {
                setPhoneApprove("ready");
                setName(value as string);
              }}
            />
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
      <FlexChild paddingBottom={20}>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>주민등록번호 7자리</P>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex gap={23}>
              <FlexChild>
                <Input
                  id="identification"
                  className={styles.input}
                  placeHolder="YYMMDD"
                  width={"100%"}
                  onFilter={(value: any) =>
                    value.replace(numberOnlyFormat.exp, "")
                  }
                  maxLength={6}
                  noWhiteSpace
                  onChange={(value) => {
                    setPhoneApprove("ready");
                    setIdentification(value as string);
                    if (String(value).length === 6)
                      document.getElementById("gender")?.focus();
                  }}
                />
              </FlexChild>
              <FlexChild width={"max-content"}>
                <Image
                  src="/resources/icons/minus.png"
                  width={12}
                  height={"auto"}
                />
              </FlexChild>
              <FlexChild gap={8}>
                <Input
                  id="gender"
                  className={styles.input}
                  width={"3em"}
                  onFilter={(value: any) =>
                    value.replace(numberOnlyFormat.exp, "")
                  }
                  maxLength={1}
                  noWhiteSpace
                  onChange={(value) => {
                    setGender(value as string);
                    setPhoneApprove("ready");
                    if (String(value).length == 1) {
                      document.getElementById("gender")?.blur();
                      document.getElementById("phoneStation")?.click();
                    }
                  }}
                />
                <FlexChild gap={6}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Image
                      key={`dot_${index}`}
                      src="/resources/icons/dot.png"
                      width={10}
                      height={"auto"}
                    />
                  ))}
                </FlexChild>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
      <FlexChild paddingBottom={20}>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>휴대폰 번호</P>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex gap={10}>
              <FlexChild
                id="phoneStation"
                height={50}
                width={114}
                className={styles.phoneStationBox}
                onClick={() =>
                  NiceModal.show("list", {
                    list: phoneStations,
                    selected: phoneStation,
                    onSelect: (value: any) => {
                      setPhoneApprove("ready");
                      setPhoneStation(value);
                      document.getElementById("phone")?.focus();
                    },
                  })
                }
              >
                <P>{phoneStation.label}</P>
                <Image
                  src="/resources/icons/down_arrow.png"
                  width={11}
                  height={"auto"}
                  marginLeft={"auto"}
                />
              </FlexChild>
              <FlexChild position="relative">
                <Input
                  id="phone"
                  className={styles.input}
                  placeHolder="'-' 없이 숫자만 입력"
                  width={"100%"}
                  onFilter={(value: any) =>
                    value.replace(numberOnlyFormat.exp, "")
                  }
                  maxLength={11}
                  noWhiteSpace
                  onChange={(value) => {
                    setPhoneApprove("ready");
                    setPhone(value as string);
                    if (String(value).length === 11)
                      document.getElementById("phone")?.blur();
                  }}
                />
                {phoneApprove === "continue" && (
                  <P
                    className={styles.resend}
                    onClick={() => {
                      if (isLoading) return;
                      setIsLoading(true);
                      NiceModal.show("confirm", {
                        confirmText: "재전송",
                        cancelText: "취소",
                        message: "문자 메시지를 재전송하시겠습니까?",
                        onConfirm: async () => {
                          const { mokToken: token } =
                            await requester.getToken();
                          const data = handleUpdate?.({
                            key: "MOKAuthRequestData",
                            value: JSON.stringify({
                              encryptMOKToken: token.encryptMOKToken,
                              publicKey: token.publicKey,
                            }),
                          });
                          dataRef.current = {
                            data,
                            token,
                          };
                          sendSMS();
                        },
                      });
                    }}
                  >
                    재전송
                  </P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
      {phoneApprove === "ready" && (
        <FlexChild>
          <Button
            className={styles.button}
            disabled={
              !mobileNoFormat.exp.test(phone) ||
              !birthday6Format.exp.test(identification) ||
              !name ||
              !gender
            }
            isLoading={isLoading}
            onClick={async () => {
              setIsLoading(true);
              const { mokToken: token } = await requester.getToken();
              const data = handleUpdate?.([
                {
                  key: "userPhoneNum",
                  value: phone,
                },
                {
                  key: "providerid",
                  value: phoneStation.value,
                },
                {
                  key: "reqAuthType",
                  value: "SMS",
                },
                {
                  key: "userName",
                  value: name,
                },
                {
                  key: "userBirthday",
                  value: (Number(gender) < 3 ? "19" : "20") + identification,
                },
                {
                  key: "userGender",
                  value: Number(gender) % 2,
                },
                {
                  key: "userNation",
                  value: "0",
                },
                {
                  key: "sendMsg",
                  value: "본인확인 인증번호[000000]를 화면에 입력해주세요.",
                },
                {
                  key: "replyNumber",
                  value: "01048947486",
                },
                {
                  key: "MOKAuthRequestData",
                  value: JSON.stringify({
                    encryptMOKToken: token.encryptMOKToken,
                    publicKey: token.publicKey,
                  }),
                },
              ]);

              dataRef.current = {
                data,
                token,
              };
              sendSMS();
            }}
          >
            인증번호 받기
          </Button>
        </FlexChild>
      )}
      <FlexChild position="relative" hidden={phoneApprove === "ready"}>
        <Input
          id="code"
          className={styles.input}
          placeHolder="인증번호를 입력하세요"
          width={"100%"}
          maxLength={6}
          onChange={(value) => {
            setCode(value as string);
            if (String(value).length === 6)
              document.getElementById("code")?.blur();
          }}
        />
        <P className={styles.timer} notranslate>{`${Math.floor(
          time / 60
        )}:${String(time % 60).padStart(2, "0")}`}</P>
      </FlexChild>
      <FlexChild position="sticky" bottom={0} marginTop={"auto"}>
        <HorizontalFlex gap={9}>
          <FlexChild>
            <Button
              className={clsx(styles.button, styles.white)}
              onClick={() => {
                setStep("certification");
              }}
            >
              이전
            </Button>
          </FlexChild>
          <FlexChild>
            <Button
              className={styles.button}
              onClick={() => {
                const { token, verification, userPhoneNum } = dataRef.current;
                requester.verificationCheck(
                  {
                    MOKConfirmData: verification.MOKConfirmData,
                    session: token.session,
                    authNumber: code,
                  },
                  ({ resultData }: { resultData: any }) => {
                    if (resultData) {
                      requester.isExistUser(
                        {
                          phone: userPhoneNum,
                        },
                        ({
                          exist,
                          username,
                        }: {
                          exist: boolean;
                          username: string;
                        }) => {
                          if (exist) {
                            handleUpdate?.({
                              key: "username",
                              value: username,
                            });
                            setStep("found");
                          } else {
                            setStep("not_found");
                          }
                        }
                      );
                    } else {
                      NiceModal.show("confirm", {
                        message: "인증 실패. 인증번호를 확인해주세요.",
                        confirmText: "확인",
                      });
                    }
                  }
                );
              }}
              disabled={!code || phoneApprove === "ready"}
            >
              다음
            </Button>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}

function PassReady({ setStep, data, handleUpdate }: StepProps) {
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild margin={"auto"} padding={37}>
        <VerticalFlex>
          <P className={styles.title} paddingBottom={"0.5em"}>
            PASS앱에서 인증 후
          </P>
          <P className={styles.title}>인증완료 버튼을 눌러주세요</P>
          <Image
            src="/resources/images/pass_phone.png"
            width={"100%"}
            height={"auto"}
          />
        </VerticalFlex>
      </FlexChild>
      <FlexChild position="sticky" marginTop={"auto"}>
        <Button
          className={styles.button}
          onClick={() => {
            const { token, verification, userPhoneNum } = data.current;
            requester.verificationCheck(
              {
                MOKConfirmData: verification.MOKConfirmData,
                session: token.session,
              },
              ({ resultData }: { resultData: any }) => {
                if (resultData) {
                  requester.isExistUser(
                    {
                      phone: userPhoneNum,
                    },
                    ({
                      exist,
                      username,
                    }: {
                      exist: boolean;
                      username: string;
                    }) => {
                      if (exist) {
                        handleUpdate?.({ key: "username", value: username });
                        setStep("found");
                      } else {
                        setStep("not_found");
                      }
                    }
                  );
                } else {
                  NiceModal.show("confirm", {
                    message: "인증 실패. PASS앱을 다시 확인해주세요.",
                    confirmText: "확인",
                  });
                }
              }
            );
          }}
        >
          <P>인증완료</P>
        </Button>
      </FlexChild>
    </VerticalFlex>
  );
}

function Found({ data }: StepProps) {
  const naviagte = useNavigate();
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild paddingBottom={"0.5em"}>
        <P className={styles.title2}>회원님의 휴대전화로</P>
      </FlexChild>
      <FlexChild paddingBottom={30}>
        <P className={styles.title2}>가입된 아이디입니다</P>
      </FlexChild>
      <FlexChild
        className={styles.mailWrapper}
        marginBottom={20}
        justifyContent="center"
      >
        <P>
          <Span className={styles.mailLabel} paddingRight={"1em"}>
            아이디
          </Span>
          <Span className={styles.mailValue}>{data?.current?.username}</Span>
        </P>
      </FlexChild>
      <FlexChild>
        <P>
          <Span className={styles.forgetPW} paddingRight={"0.5em"}>
            비밀번호를 잊으셨나요?
          </Span>
          <Span
            className={styles.findPW}
            onClick={() => naviagte(`/findPw?id=${data?.current?.username}`)}
          >
            비밀번호 찾기
          </Span>
        </P>
      </FlexChild>
      <FlexChild position="sticky" marginTop={"auto"}>
        <Button
          className={styles.button}
          onClick={() => {
            naviagte(`/login?id=${data?.current?.username}`);
          }}
        >
          <P>로그인</P>
        </Button>
      </FlexChild>
    </VerticalFlex>
  );
}

function NotFound({}: StepProps) {
  const naviagte = useNavigate();
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild paddingBottom={"0.5em"}>
        <P className={styles.title2}>등록된 아이디가 없습니다</P>
      </FlexChild>
      <FlexChild paddingBottom={12}>
        <P className={styles.title2}>새로운 계정을 만들어보세요!</P>
      </FlexChild>
      <FlexChild paddingBottom={"0.25em"}>
        <P className={styles.description}>
          통합 회원가입으로 푸푸의 쇼핑몰과 앱을
        </P>
      </FlexChild>
      <FlexChild paddingBottom={30}>
        <P>모두 이용할 수 있어요.</P>
      </FlexChild>
      <FlexChild paddingBottom={30}>
        <Button className={styles.button} onClick={() => naviagte("/signup")}>
          푸푸 통합회원 가입하기
        </Button>
      </FlexChild>
      <FlexChild className={styles.divider} paddingBottom={20}>
        <P margin={"0 8px"} color="#8b8b8b" weight={500} fontSize={14}>
          또는
        </P>
      </FlexChild>
      <FlexChild justifyContent="center" paddingBottom={20}>
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
      <FlexChild position="sticky" marginTop={"auto"}>
        <Button
          className={clsx(styles.button, styles.reverse)}
          onClick={() => naviagte("/")}
        >
          <P>홈으로</P>
        </Button>
      </FlexChild>
    </VerticalFlex>
  );
}
