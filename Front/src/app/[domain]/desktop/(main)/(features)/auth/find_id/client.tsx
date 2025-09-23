"use client";

import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
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

export default function IdStepBox() {
  const [step, setStep] = useState<string>("certification");
  const data = useRef<any>({});
  const naviagte = useNavigate();
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
      return <Certification setStep={setStep} handleUpdate={handleUpdate} />;
    case "pass_ready":
      return (
        <PassReady setStep={setStep} data={data} handleUpdate={handleUpdate} />
      );
    case "found":
      return <Found setStep={setStep} data={data} />;
    case "not_found":
      return <NotFound setStep={setStep} />;
    default:
      return (
        <FlexChild padding={80}>
          <VerticalFlex gap={20}>
            <Image src="/resources/images/error_icon.png" width={80} />
            <P className={styles.title} paddingBottom={30}>
              알 수 없는 오류가 발생했습니다.
            </P>
            <FlexChild>
              <Button
                className={clsx(styles.button, styles.reverse)}
                onClick={() => naviagte("/")}
                width={363}
                margin={"0 auto"}
              >
                <P>홈으로</P>
              </Button>
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
      );
  }
}

function Certification({ setStep, handleUpdate }: StepProps) {
  const [type, setType] = useState<"pass" | "sms">("pass");
  return (
    <VerticalFlex className={styles.wrapper} paddingBottom={80}>
      <FlexChild justifyContent="center">
        <HorizontalFlex width={600} maxWidth={600} minWidth={600}>
          <FlexChild
            className={clsx(styles.certificationBox, {
              [styles.selected]: type === "pass",
            })}
            gap={10}
            onClick={() => setType("pass")}
          >
            <Image
              src="/resources/images/PASS.png"
              height={36}
              width={"auto"}
            />
            <P size={18} weight={600} color="#1C1B1F">
              PASS 인증
            </P>
          </FlexChild>
          <FlexChild
            className={clsx(styles.certificationBox, {
              [styles.selected]: type === "sms",
            })}
            gap={10}
            onClick={() => setType("sms")}
          >
            <Image src="/resources/images/SMS.png" height={36} width={"auto"} />
            <P size={18} weight={600} color="#1C1B1F">
              SMS 인증
            </P>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild className={styles.certificationContent} borderTop={"none"}>
        {type === "sms" ? (
          <SMS setStep={setStep} handleUpdate={handleUpdate} />
        ) : (
          <PASS setStep={setStep} handleUpdate={handleUpdate} />
        )}
      </FlexChild>
      <CopyRight paddingTop={68} />
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
    <VerticalFlex>
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
              width={512}
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
              width={512}
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
      <FlexChild paddingBottom={30}>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>휴대폰 번호</P>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex gap={10}>
              <Select
                hideScroll
                id="phoneStation"
                classNames={{
                  header: styles.phoneStationBox,
                  line: styles.phoneStationBox,
                  placeholder: styles.phoneStationBox,
                  search: styles.phoneStationBox,
                }}
                value={phoneStation.value}
                options={phoneStations.map((phone) => ({
                  display: phone.label,
                  value: phone.value,
                }))}
                onChange={(value) => {
                  setPhoneStation(
                    phoneStations.find((f) => f.value === value) || phoneStation
                  );
                  document.getElementById("phone")?.focus();
                }}
                height={50}
                maxHeight={300}
                width={114}
                minWidth={114}
              />
              <FlexChild>
                <Input
                  id="phone"
                  className={styles.input}
                  placeHolder="'-' 없이 숫자만 입력"
                  width={388}
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
      <FlexChild justifyContent="center" width={600} maxWidth={600}>
        <HorizontalFlex gap={7} width={363} maxWidth={363}>
          {/* <FlexChild>
            <Button
              width={"100%"}
              className={clsx(styles.button, styles.white)}
              onClick={() => {
                setStep("agree");
              }}
            >
              이전
            </Button>
          </FlexChild> */}
          <FlexChild>
            <Button
              width={"100%"}
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
                      withCloseButton: true,
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
  const navigate = useNavigate();
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
          withCloseButton: true,
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
    <VerticalFlex>
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
              width={512}
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
                  width={218}
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
                  width={49}
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
      <FlexChild>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>휴대폰 번호</P>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex gap={10}>
              <Select
                hideScroll
                id="phoneStation"
                classNames={{
                  header: styles.phoneStationBox,
                  line: styles.phoneStationBox,
                  placeholder: styles.phoneStationBox,
                  search: styles.phoneStationBox,
                }}
                value={phoneStation.value}
                options={phoneStations.map((phone) => ({
                  display: phone.label,
                  value: phone.value,
                }))}
                onChange={(value) => {
                  setPhoneApprove("ready");
                  setPhoneStation(
                    phoneStations.find((f) => f.value === value) || phoneStation
                  );
                  document.getElementById("phone")?.focus();
                }}
                height={50}
                maxHeight={300}
                width={114}
                minWidth={114}
              />
              <FlexChild position="relative">
                <Input
                  id="phone"
                  className={styles.input}
                  placeHolder="'-' 없이 숫자만 입력"
                  width={271}
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

                <Button
                  marginLeft={10}
                  width={107}
                  className={styles.button}
                  disabled={
                    !mobileNoFormat.exp.test(phone) ||
                    !birthday6Format.exp.test(identification) ||
                    !name ||
                    !gender
                  }
                  onClick={async () => {
                    if (phoneApprove === "ready") {
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
                          value:
                            (Number(gender) < 3 ? "19" : "20") + identification,
                        },
                        {
                          key: "birthday",
                          value:
                            (Number(gender) < 3 ? "19" : "20") + identification,
                        },
                        {
                          key: "userGender",
                          value: 2 - (Number(gender) % 2),
                        },
                        {
                          key: "userNation",
                          value: "0",
                        },
                        {
                          key: "sendMsg",
                          value:
                            "본인확인 인증번호[000000]를 화면에 입력해주세요.",
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
                    } else {
                      setIsLoading(true);
                      NiceModal.show("confirm", {
                        confirmText: "재전송",
                        cancelText: "취소",
                        message: "인증번호를 재전송하시겠습니까?",
                        width: 324,
                        classNames: {
                          confirm: styles.confirmButton,
                        },
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
                    }
                  }}
                >
                  <P fontSize={15}>
                    {phoneApprove === "ready" ? "인증번호 받기" : "재전송"}
                  </P>
                </Button>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
      <FlexChild
        position="relative"
        hidden={phoneApprove === "ready"}
        margin={12}
      >
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
      <FlexChild paddingTop={30} justifyContent="center">
        <HorizontalFlex gap={7} width={363} maxWidth={363}>
          {/* <FlexChild>
            <Button
              width={"100%"}
              className={clsx(styles.button, styles.white)}
              onClick={() => {
                setStep("agree");
              }}
            >
              이전
            </Button>
          </FlexChild> */}
          <FlexChild>
            <Button
              width={"100%"}
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
    <VerticalFlex className={styles.wrapper} paddingBottom={80}>
      <FlexChild margin={"auto"} padding={37}>
        <VerticalFlex>
          <P className={styles.title} paddingTop={80} paddingBottom={45}>
            {"PASS앱에서 인증 후\n인증완료 버튼을 눌러주세요"}
          </P>
          <Image
            src="/resources/images/pass_phone.png"
            width={"100%"}
            maxWidth={"285px"}
            // height={"auto"}
          />
        </VerticalFlex>
      </FlexChild>
      <FlexChild width={"max-content"} gap={7} paddingTop={60}>
        <Button
          className={clsx(styles.button, styles.white)}
          width={180}
          onClick={() => setStep("certification")}
        >
          이전
        </Button>
        <Button
          width={180}
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
      <CopyRight paddingTop={68} />
    </VerticalFlex>
  );
}

function Found({ data }: StepProps) {
  const naviagte = useNavigate();
  return (
    <VerticalFlex className={styles.wrapper} paddingBottom={80}>
      <FlexChild alignItems="center">
        <P className={styles.title} paddingTop={80} paddingBottom={45}>
          {"회원님의 휴대전화로\n가입된 아이디입니다"}
        </P>
      </FlexChild>
      <FlexChild
        border={"1px solid #d9d9d9"}
        borderRadius={4}
        padding={"40px 44px"}
      >
        <VerticalFlex>
          <FlexChild
            className={styles.mailWrapper}
            marginBottom={20}
            justifyContent="center"
          >
            <P>
              <Span className={styles.mailLabel} paddingRight={"1em"}>
                아이디
              </Span>
              <Span className={styles.mailValue}>
                {data?.current?.username}
              </Span>
            </P>
          </FlexChild>
          <FlexChild
            alignItems="center"
            width={"max-content"}
            paddingBottom={30}
          >
            <P>
              <Span className={styles.forgetPW} paddingRight={"0.5em"}>
                비밀번호를 잊으셨나요?
              </Span>
              <Span
                className={styles.findPW}
                onClick={() =>
                  naviagte(`/auth/find_pw?id=${data?.current?.username}`)
                }
              >
                비밀번호 찾기
              </Span>
            </P>
          </FlexChild>
          <FlexChild position="sticky" marginTop={"auto"}>
            <VerticalFlex>
              <Button
                className={styles.button}
                width={363}
                margin={"0 auto"}
                onClick={() => {
                  naviagte(`/auth/login?id=${data?.current?.username}`);
                }}
              >
                <P>로그인 바로가기</P>
              </Button>
            </VerticalFlex>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
      <CopyRight />
    </VerticalFlex>
  );
}

function NotFound({}: StepProps) {
  const naviagte = useNavigate();
  return (
    <VerticalFlex className={styles.wrapper} paddingBottom={80}>
      <FlexChild alignItems="center">
        <P className={styles.title} paddingTop={80} paddingBottom={10}>
          {"등록된 아이디가 없습니다\n새로운 계정을 만들어보세요!"}
        </P>
      </FlexChild>
      <FlexChild alignItems="center" width={"max-content"} paddingBottom={90}>
        <P className={styles.description}>
          통합 회원가입으로 푸푸의 쇼핑몰과 앱을 모두 이용할 수 있어요.
        </P>
      </FlexChild>
      <FlexChild paddingBottom={22}>
        <Button
          className={styles.button}
          width={363}
          margin={"0 auto"}
          onClick={() => naviagte("/signup")}
        >
          푸푸 통합회원 가입하기
        </Button>
      </FlexChild>
      <FlexChild>
        <Button
          className={clsx(styles.button, styles.reverse)}
          onClick={() => naviagte("/")}
          width={363}
          margin={"0 auto"}
        >
          <P>홈으로</P>
        </Button>
      </FlexChild>
      <CopyRight />
    </VerticalFlex>
  );
}

function CopyRight({
  paddingTop = 80,
}: {
  paddingTop?: React.CSSProperties["paddingTop"];
}) {
  return (
    <P className={styles.copyright} paddingTop={paddingTop}>
      © PUFFU ALL RIGHTS RESERVED.
    </P>
  );
}
