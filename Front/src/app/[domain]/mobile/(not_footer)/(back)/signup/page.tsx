"use client";
import Button from "@/components/buttons/Button";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
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
  emailFormat,
  mobileNoFormat,
  numberOnlyFormat,
  passwordFormat,
} from "@/shared/regExp";
import { requester } from "@/shared/Requester";
import { Cookies } from "@/shared/utils/Data";
import { getCookieOption, toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useCookies } from "react-cookie";
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
  const [step, setStep] = useState<string>("ready");
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
    case "ready":
      return <Ready setStep={setStep} />;
    case "agree":
      return <Agree setStep={setStep} />;
    case "certification":
      return <Certification setStep={setStep} />;
    case "pass":
      return <PASS setStep={setStep} handleUpdate={handleUpdate} />;
    case "pass_ready":
      return <PassReady setStep={setStep} data={data} />;
    case "sms":
      return <SMS setStep={setStep} handleUpdate={handleUpdate} />;
    case "info":
      return <Info setStep={setStep} handleUpdate={handleUpdate} data={data} />;
    case "email_ready":
      return (
        <EmailReday setStep={setStep} handleUpdate={handleUpdate} data={data} />
      );
    case "complete":
      return <Complete setStep={setStep} data={data} />;
    default:
      return (
        <FlexChild padding={15}>
          <P className={styles.title}>알 수 없는 오류가 발생했습니다.</P>
        </FlexChild>
      );
  }
}

function Ready({ setStep }: StepProps) {
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild paddingBottom={13}>
        <VerticalFlex className={styles.title} gap={10}>
          <FlexChild>
            <P>하나의 계정으로</P>
          </FlexChild>
          <FlexChild>
            <P>푸푸의 모든 서비스를!</P>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
      <FlexChild paddingBottom={70}>
        <VerticalFlex className={styles.description} gap={6}>
          <FlexChild>
            <P>통합 회원가입으로 푸푸의 쇼핑몰과 앱을</P>
          </FlexChild>
          <FlexChild>
            <P>모두 이용할 수 있어요.</P>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
      <FlexChild>
        <Button className={styles.button}>
          <P onClick={() => setStep("agree")}>푸푸 통합회원 가입하기</P>
        </Button>
      </FlexChild>
    </VerticalFlex>
  );
}

function Agree({ setStep }: StepProps) {
  const [values, setValues] = useState<string[]>([]);
  const agrees = [
    {
      label: "만 14세 이상입니다.",
      code: "14",
      require: true,
    },
    {
      label: "개인 정보 이용 및 제공 동의",
      code: "personal",
      require: true,
      description: (
        <VerticalFlex paddingTop={30}>
          <VerticalFlex className={styles.agreeDescriptionWrapper}>
            <FlexChild className={styles.agreeDescriptionTitle}>
              <P>제1조 (목적)</P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                이 약관은 푸푸글로벌 (이하 "회사")가 제공하는 쇼핑몰 서비스의
                이용에 관한 기본적인 사항을 규정함을 목적으로 합니다
              </P>
            </FlexChild>
          </VerticalFlex>
          <VerticalFlex className={styles.agreeDescriptionWrapper}>
            <FlexChild className={styles.agreeDescriptionTitle}>
              <P>제2조 (서비스 제공 내용)</P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                회사는 회원에게 다음과 같은 서비스를 제공합니다.
              </P>
            </FlexChild>
            <FlexChild className={styles.emptyLine} />
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                • 상품 구매 및 결제 서비스
              </P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                • 상품 배송 서비스
              </P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                • 회원 관리 및 고객 지원 서비스
              </P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                • 기타 회사가 제공하는 부가 서비스
              </P>
            </FlexChild>
          </VerticalFlex>
          <VerticalFlex className={styles.agreeDescriptionWrapper}>
            <FlexChild className={styles.agreeDescriptionTitle}>
              <P>제3조 (회원가입 및 탈퇴)</P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                1. 회원은 본 약관에 동의함으로써 회원 가입을 신청할 수 있습니다.
              </P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                2. 회원 가입 시 제공되는 개인 정보는 정확하고 최신의 정보로
                입력해야 합니다
              </P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                3. 회원은 언제든지 서비스 탈퇴를 신청할 수 있으며, 탈퇴 절차는
                회사의 정책에 따릅니다
              </P>
            </FlexChild>
          </VerticalFlex>
          <VerticalFlex className={styles.agreeDescriptionWrapper}>
            <FlexChild className={styles.agreeDescriptionTitle}>
              <P>제4조 (계약의 체결 및 해지)</P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                1. 회원이 본 약관에 동의하고 가입 절차를 마친 후, 회사는 회원의
                신청을 승인하여 서비스를 제공합니다.
              </P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                2. 회원은 언제든지 서비스 이용을 중지하고 계약을 해지할 수
                있습니다. 해지 절차는 회사 정책에 따릅니다.
              </P>
            </FlexChild>
            <FlexChild className={styles.emptyLine} />
            <FlexChild className={styles.emptyLine} />
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                푸푸글로벌에서 제공하는 서비스를 이용하기 전에 본 계약의 조건,
                특히 굵은 글씨로 표시된 부분(면제 또는 책임 한도 조건을 포함하되
                이에 국한되지 않음)을 주의 깊게 읽고 완전히 이해하시기 바랍니다.
                만약 귀하가 본 서비스 계약 및/또는 그 수정 사항에 동의하지 않을
                경우, 귀하는 푸푸글로벌이 제공하는 서비스 이용을 적극적으로
                중단할 수 있습니다. 귀하가 푸푸글로벌이 제공하는 서비스를
                사용하는 순간, 귀하는 푸푸글로벌이 언제든지 할 수 있는 서비스
                계약 수정 사항을 포함하여 본 서비스 계약의 모든 조건을 이해하고
                완전히 동의한 것으로 간주되며, 당사의 사용자가 됩니다.
              </P>
            </FlexChild>
          </VerticalFlex>
        </VerticalFlex>
      ),
    },
    {
      label: "통신사 이용약관 동의",
      code: "carrier",
      require: true,
      description: <VerticalFlex></VerticalFlex>,
    },
    {
      label: "고유식별정보 처리 동의",
      code: "unique",
      require: true,
      description: <VerticalFlex></VerticalFlex>,
    },
    {
      label: "서비스 이용약관 동의",
      code: "service",
      require: true,
      description: <VerticalFlex></VerticalFlex>,
    },
  ];
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild>
        <P className={styles.title2}>푸푸 통합회원 이용을 위해</P>
      </FlexChild>
      <FlexChild paddingBottom={30}>
        <P className={styles.title2}>아래 약관에 동의해주세요.</P>
      </FlexChild>
      <CheckboxGroup
        name="agree"
        images={{
          off: "/resources/images/login_radio_off.png",
          on: "/resources/images/login_radio_on.png",
        }}
        onChange={(values) => setValues(values)}
        values={values}
      >
        <VerticalFlex>
          <FlexChild gap={8}>
            <CheckboxAll id="all" />
            <P
              className={styles.agreeAll}
              onClick={() => document.getElementById("all")?.click()}
            >
              전체 동의
            </P>
          </FlexChild>
          <FlexChild className={styles.line} />
          {agrees.map((agree) => (
            <FlexChild key={agree.code} gap={8} paddingTop={20}>
              <CheckboxChild id={agree.code} />

              <P
                className={styles.agree}
                onClick={() => document.getElementById(agree.code)?.click()}
              >
                {agree.require && (
                  <Span className={styles.agreeRequire}>[필수] </Span>
                )}
                <Span>{agree.label}</Span>
              </P>
              {agree.description && (
                <P
                  marginLeft={"auto"}
                  className={styles.agreeMore}
                  onClick={() =>
                    NiceModal.show("confirm", {
                      title: agree.label,
                      message: agree.description,
                      confirmText: "동의",
                      onConfirm: () =>
                        setValues(Array.from(new Set([...values, agree.code]))),
                      withCloseButton: true,
                      width: "100vw",
                      height: "100dvh",
                    })
                  }
                >
                  보기
                </P>
              )}
            </FlexChild>
          ))}
        </VerticalFlex>
      </CheckboxGroup>
      <FlexChild position="sticky" bottom={0} marginTop={"auto"}>
        <Button
          className={styles.button}
          disabled={
            !agrees.every((agree) => {
              if (agree.require) {
                return values.includes(agree.code);
              }
              return true;
            })
          }
          onClick={() => setStep("certification")}
        >
          다음
        </Button>
      </FlexChild>
    </VerticalFlex>
  );
}

function Certification({ setStep }: StepProps) {
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild paddingBottom={"0.5em"}>
        <P className={styles.title2}>회원 가입을 위해</P>
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
                  key: "birthday",
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
                            NiceModal.show("confirm", {
                              slideUp: true,
                              clickOutsideToClose: false,
                              width: "100vw",
                              message: (
                                <VerticalFlex>
                                  <P
                                    className={styles.duplicateTitle}
                                    paddingBottom={17}
                                  >
                                    이미 가입된 계정이 있습니다
                                  </P>
                                  <P
                                    className={styles.duplicateDescription}
                                    paddingBottom={23}
                                  >
                                    아래 아이디로 로그인해주세요
                                  </P>
                                  <FlexChild
                                    justifyContent="center"
                                    className={styles.duplicateInfoWrapper}
                                  >
                                    <P>
                                      <Span
                                        className={styles.duplicateInfoLabel}
                                        paddingRight={"2em"}
                                      >
                                        아이디
                                      </Span>
                                      <Span
                                        className={styles.duplicateInfoValue}
                                      >
                                        {username}
                                      </Span>
                                    </P>
                                  </FlexChild>
                                </VerticalFlex>
                              ),
                              confirmText: "기존 계정으로 로그인하기",
                              onConfirm: () => {
                                navigate(`/login?id=${username}`);
                              },
                            });
                          } else {
                            handleUpdate?.({ key: "authNumber", value: code });
                            setStep("info");
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

function PassReady({ setStep, data }: StepProps) {
  const navigate = useNavigate();
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
                        NiceModal.show("confirm", {
                          slideUp: true,
                          clickOutsideToClose: false,
                          width: "100vw",
                          message: (
                            <VerticalFlex>
                              <P
                                className={styles.duplicateTitle}
                                paddingBottom={17}
                              >
                                이미 가입된 계정이 있습니다
                              </P>
                              <P
                                className={styles.duplicateDescription}
                                paddingBottom={23}
                              >
                                아래 아이디로 로그인해주세요
                              </P>
                              <FlexChild
                                justifyContent="center"
                                className={styles.duplicateInfoWrapper}
                              >
                                <P>
                                  <Span
                                    className={styles.duplicateInfoLabel}
                                    paddingRight={"2em"}
                                  >
                                    아이디
                                  </Span>
                                  <Span className={styles.duplicateInfoValue}>
                                    {username}
                                  </Span>
                                </P>
                              </FlexChild>
                            </VerticalFlex>
                          ),
                          confirmText: "기존 계정으로 로그인하기",
                          onConfirm: () => {
                            navigate(`/login?id=${username}`);
                          },
                        });
                      } else {
                        setStep("info");
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

function Info({ setStep, handleUpdate, data }: StepProps) {
  const [username, setUsername] = useState<string>(
    data?.current?.username || ""
  );
  const [usernameError, setUsernameError] = useState<string>("");
  const [password, setPassword] = useState<string>(
    data?.current?.password || ""
  );
  const [passwordError, setPasswordError] = useState<string>("");
  const [password2, setPassword2] = useState<string>(
    data?.current?.password || ""
  );
  const [passwordError2, setPasswordError2] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild paddingBottom={"0.5em"}>
        <P className={styles.title2}>아이디(이메일)과</P>
      </FlexChild>
      <FlexChild paddingBottom={30}>
        <P className={styles.title2}>비밀번호를 입력해주세요</P>
      </FlexChild>
      <FlexChild paddingBottom={25}>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>
              아이디(이메일)<Span className={styles.inputRequire}>*</Span>
              <Span className={styles.inputError} paddingLeft={6}>
                {usernameError}
              </Span>
            </P>
          </FlexChild>
          <FlexChild>
            <Input
              className={styles.input}
              width={"100%"}
              placeHolder="예) puffu1234@puffu.com"
              regExp={[emailFormat]}
              feedback="올바른 아이디 형식이 아닙니다"
              value={username}
              onChange={(value) => setUsername(value as string)}
              onFeedBackChange={(feedback) => setUsernameError(feedback)}
              feedbackHide
            />
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
      <FlexChild paddingBottom={25}>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>
              비밀번호<Span className={styles.inputRequire}>*</Span>
              <Span className={styles.inputError} paddingLeft={6}>
                {passwordError}
              </Span>
            </P>
          </FlexChild>
          <FlexChild>
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
        </VerticalFlex>
      </FlexChild>
      <FlexChild paddingBottom={25}>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>
              비밀번호 확인<Span className={styles.inputRequire}>*</Span>
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
        </VerticalFlex>
      </FlexChild>
      <FlexChild position="sticky" bottom={0} marginTop={"auto"}>
        <Button
          isLoading={isLoading}
          className={styles.button}
          disabled={
            !username ||
            !password ||
            !password2 ||
            !!usernameError ||
            !!passwordError ||
            !!passwordError2 ||
            password !== password2
          }
          onClick={() => {
            handleUpdate?.([
              { key: "username", value: username },
              { key: "password", value: password },
            ]);
            setIsLoading(true);
            requester.isExistUser(
              {
                username,
              },
              ({ exist }: { exist: boolean }) => {
                if (exist) {
                  NiceModal.show("confirm", {
                    message: "해당 이메일로 가입된 계정이 있습니다.",
                    confirmText: "확인",
                    onConfirm: () => {
                      setIsLoading(false);
                    },
                  });
                } else {
                  requester.sendEmail(
                    {
                      email: username,
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
                }
              }
            );
          }}
        >
          다음
        </Button>
      </FlexChild>
    </VerticalFlex>
  );
}

function EmailReday({ setStep, data, handleUpdate }: StepProps) {
  const dataRef = useRef<any>(data.current);
  const [code, setCode] = useState<string>("");

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
              requester.sendEmail(
                {
                  email: data.username,
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
                  } else if (error) {
                    toast({ message: error });
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
                setStep("info");
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
                  const {
                    username,
                    userName,
                    password,
                    userPhoneNum,
                    birthday,
                  } = dataRef.current;

                  requester.createUser(
                    {
                      username,
                      password,
                      name: userName,
                      phone: userPhoneNum,
                      birthday: new Date(
                        `${birthday.slice(0, 4)}-${birthday.slice(
                          4,
                          6
                        )}-${birthday.slice(6)}`
                      ),
                    },
                    ({ access_token }: { access_token: string }) => {
                      handleUpdate?.({
                        key: "access_token",
                        value: access_token,
                      });
                      setStep("complete");
                    }
                  );
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
              가입완료
            </Button>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}

function Complete({ data }: StepProps) {
  const [, setCookie] = useCookies([Cookies.JWT]);
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
          <P className={styles.title2} paddingBottom={10}>
            회원가입 완료
          </P>
          <P className={styles.completeDescription} paddingBottom={"0.25em"}>
            이제 푸푸의 모든 서비스를
          </P>
          <P className={styles.completeDescription}>
            자유롭게 이용하실 수 있어요.
          </P>
        </VerticalFlex>
      </FlexChild>
      <FlexChild position="sticky" bottom={0} marginTop={"auto"}>
        <Button
          className={styles.button}
          onClick={() => {
            setCookie(
              Cookies.JWT,
              data.current.access_token,
              getCookieOption()
            );
            navigate("/");
          }}
        >
          시작하기
        </Button>
      </FlexChild>
    </VerticalFlex>
  );
}
