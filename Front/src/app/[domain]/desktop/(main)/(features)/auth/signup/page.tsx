"use client";
import PrivacyContent from "@/components/agreeContent/privacyContent";
import TermContent from "@/components/agreeContent/TermContent";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Span from "@/components/span/Span";

import styles from "./page.module.css";
// import boardStyle from '../../boardGrobal.module.css'

import Button from "@/components/buttons/Button";
import Image from "@/components/Image/Image";
import Select from "@/components/select/Select";
import useClientEffect from "@/shared/hooks/useClientEffect";
import useNavigate from "@/shared/hooks/useNavigate";
import {
  birthday6Format,
  birthday8Format,
  mobileNoFormat,
  numberOnlyFormat,
  passwordFormat,
} from "@/shared/regExp";
import { requester } from "@/shared/Requester";
import { Cookies } from "@/shared/utils/Data";
import { getCookieOption } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";

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
  const [step, setStep] = useState<string>("agree");

  const [percent, setPercent] = useState<string>("25%");
  const data = useRef<any>({});
  const handleUpdate = (value: UpdateValue[] | UpdateValue) => {
    if (value) {
      (Array.isArray(value) ? value : [value]).forEach((v) => {
        data.current[v.key] = v.value;
      });
    }
    return data.current;
  };
  useEffect(() => {
    switch (step) {
      case "agree":
        setPercent(`${(1 / 6) * 100}%`);
        break;
      case "certification":
        setPercent(`${(3 / 6) * 100}%`);
        break;
      case "info":
        setPercent(`${(5 / 6) * 100}%`);
        break;
      case "completed":
        setPercent("100%");
        break;
    }
  }, [step]);
  return (
    <section className="root page_container">
      <VerticalFlex className={styles.signup_frame}>
        {step !== "completed" && (
          <>
            <FlexChild className={styles.page_title}>
              <h3>회원가입</h3>
            </FlexChild>

            <HorizontalFlex className={styles.step_root}>
              <FlexChild className={styles.step_number}>
                <Span>1</Span>
              </FlexChild>

              <FlexChild className={styles.step_number}>
                <Span>2</Span>
              </FlexChild>

              <FlexChild className={styles.step_number}>
                <Span>3</Span>
              </FlexChild>

              <FlexChild className={styles.step_number}>
                <Span>4</Span>
              </FlexChild>

              <FlexChild className={styles.step_line}>
                <div id={styles.line} style={{ width: percent }}></div>
                {/* 스탭 진행될때마다 width 값 올리면 됨. */}
              </FlexChild>
            </HorizontalFlex>
          </>
        )}

        {/* 동의 */}
        {step === "agree" && <Agree setStep={setStep} />}

        {/* 휴대폰 인증 */}
        {step === "certification" && (
          <Certification setStep={setStep} handleUpdate={handleUpdate} />
        )}

        {/* PASS 대기 */}
        {step === "pass_ready" && <PassReady setStep={setStep} data={data} />}

        {step === "info" && (
          <Info setStep={setStep} handleUpdate={handleUpdate} data={data} />
        )}

        {step === "completed" && <Completed setStep={setStep} data={data} />}
      </VerticalFlex>
    </section>
  );
}

function Agree({ setStep }: { setStep: Dispatch<SetStateAction<string>> }) {
  const [agrees, setAgrees] = useState<string[]>([]);

  return (
    <VerticalFlex>
      <FlexChild className={styles.step_title}>
        <P>약관 동의</P>
      </FlexChild>

      <VerticalFlex gap={50}>
        <CheckboxGroup
          name="member_agree"
          className={styles.agree_box}
          onChange={(values) => setAgrees(values)}
        >
          <FlexChild className={styles.agree_item}>
            <FlexChild className={styles.checkbox}>
              <label>
                <CheckboxAll />
                <Span>전체동의</Span>
              </label>
            </FlexChild>
          </FlexChild>

          <VerticalFlex className={styles.agree_item}>
            <FlexChild className={styles.checkbox}>
              <label>
                <CheckboxChild id="term_agree" />
                <Span>이용약관 동의</Span>
              </label>
            </FlexChild>

            <FlexChild className={"agree_content"}>
              <TermContent size={8} />
            </FlexChild>
          </VerticalFlex>

          <VerticalFlex className={styles.agree_item}>
            <FlexChild className={styles.checkbox}>
              <label>
                <CheckboxChild id="privacy_agree" />
                <Span>개인정보 수집 및 이용 동의</Span>
              </label>
            </FlexChild>

            <FlexChild className={"agree_content"}>
              <PrivacyContent size={8} />
            </FlexChild>
          </VerticalFlex>
        </CheckboxGroup>

        {/* <VerticalFlex className={styles.phone_verification}>
          <FlexChild className={styles.title}>
            <h5>본인인증 방식 선택</h5>
          </FlexChild>

          <FlexChild className={styles.verification_box}>
            <RadioGroup name="verification" className={styles.verfi_item}>
              <label>
                <input type="radio" />
                휴대폰 본인인증
              </label>
            </RadioGroup>
          </FlexChild>
        </VerticalFlex> */}
        <FlexChild className={styles.continue_box}>
          <Button className={styles.prev_btn} disabled>
            이전
          </Button>
          <Button
            className={styles.next_btn}
            disabled={agrees.length < 2}
            onClick={() => setStep("certification")}
          >
            다음
          </Button>
        </FlexChild>
      </VerticalFlex>
    </VerticalFlex>
  );
}

function Certification({ setStep, handleUpdate }: StepProps) {
  const [type, setType] = useState<"pass" | "sms">("pass");
  return (
    <VerticalFlex
      width={"100%"}
      maxWidth={600}
      className={styles.auth_check_group}
    >
      <FlexChild justifyContent="center">
        <HorizontalFlex className={styles.auth_btn_box}>
          <FlexChild
            gap={10}
            onClick={() => setType("pass")}
            justifyContent="center"
            className={clsx(styles.auth_btn, {
              [styles.active]: type !== "sms",
            })}
          >
            {/* <Image
              src="/resources/images/PASS.png"
              height={36}
              width={"auto"}
            /> */}
            <P size={25} weight={600}>
              PASS 인증
            </P>
          </FlexChild>
          <FlexChild
            justifyContent="center"
            className={clsx(styles.auth_btn, {
              [styles.active]: type === "sms",
            })}
            gap={10}
            onClick={() => setType("sms")}
          >
            {/* <Image src="/resources/images/SMS.png" height={36} width={"auto"} /> */}
            <P size={25} weight={600}>
              SMS 인증
            </P>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild className={styles.certificationContent}>
        {type === "sms" ? (
          <SMS setStep={setStep} handleUpdate={handleUpdate} />
        ) : (
          <PASS setStep={setStep} handleUpdate={handleUpdate} />
        )}
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
    <VerticalFlex className={styles.auth_root_box}>
      <FlexChild paddingBottom={30}>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>이름</P>
          </FlexChild>
          <FlexChild>
            <Input
              id="name"
              className={"web_input"}
              placeHolder="이름을 입력하세요"
              width={"100%"}
              noWhiteSpace
              onChange={(value) => setName(value as string)}
            />
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
      <FlexChild paddingBottom={30}>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>생년월일</P>
          </FlexChild>
          <FlexChild>
            <Input
              id="birthday"
              className={"web_input"}
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
      <FlexChild paddingBottom={30}>
        <VerticalFlex gap={9} width={"auto"}>
          <FlexChild>
            <P className={styles.inputLabel}>휴대폰 번호</P>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex
              gap={10}
              width={"auto"}
              className={styles.phone_input_group}
            >
              <Select
                hideScroll
                id="phoneStation"
                classNames={{
                  header: styles.phone_select_header,
                  placeholder: "web_select_placholder",
                  line: "web_select_line",
                  arrow: "web_select_arrow",
                  search: "web_select_search",
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
                width={"100%"}
                minWidth={130}
              />
              <FlexChild>
                <Input
                  id="phone"
                  className={"web_input"}
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
      <FlexChild
        justifyContent="center"
        width={600}
        maxWidth={600}
        paddingTop={30}
      >
        <HorizontalFlex
          gap={10}
          width={363}
          maxWidth={363}
          className={styles.continue_box}
        >
          <FlexChild>
            <Button
              width={"100%"}
              className={clsx(styles.prev_btn, styles.white)}
              onClick={() => {
                setStep("agree");
              }}
            >
              이전
            </Button>
          </FlexChild>
          <FlexChild>
            <Button
              width={"100%"}
              className={styles.next_btn}
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
    <VerticalFlex className={styles.auth_root_box}>
      <FlexChild paddingBottom={30}>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>이름</P>
          </FlexChild>
          <FlexChild>
            <Input
              id="name"
              className={"web_input"}
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
      <FlexChild paddingBottom={30}>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>주민등록번호 7자리</P>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex gap={10}>
              <FlexChild>
                <Input
                  id="identification"
                  className={"web_input"}
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
                  className={styles.icon_filter}
                />
              </FlexChild>
              <FlexChild gap={8}>
                <Input
                  id="gender"
                  className={"web_input"}
                  width={"100%"}
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
                      className={styles.icon_filter}
                    />
                  ))}
                </FlexChild>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
      <FlexChild paddingBottom={30}>
        <VerticalFlex gap={9}>
          <FlexChild>
            <P className={styles.inputLabel}>휴대폰 번호</P>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex
              gap={10}
              width={"auto"}
              className={styles.phone_input_group}
            >
              <Select
                hideScroll
                id="phoneStation"
                classNames={{
                  header: styles.phone_select_header,
                  placeholder: "web_select_placholder",
                  line: "web_select_line",
                  arrow: "web_select_arrow",
                  search: "web_select_search",
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
                width={"100%"}
                minWidth={130}
              />
              <FlexChild position="relative">
                <Input
                  id="phone"
                  className={"web_input"}
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
                  backgroundColor="var(--main-color2)"
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
        gap={10}
      >
        <Input
          id="code"
          className={"web_input"}
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
      <FlexChild
        paddingTop={30}
        justifyContent="center"
        width={600}
        maxWidth={600}
      >
        <HorizontalFlex
          gap={10}
          width={363}
          maxWidth={363}
          className={styles.continue_box}
        >
          <FlexChild>
            <Button
              width={"100%"}
              className={clsx(styles.prev_btn, styles.white)}
              onClick={() => {
                setStep("agree");
              }}
            >
              이전
            </Button>
          </FlexChild>
          <FlexChild>
            <Button
              width={"100%"}
              className={styles.next_btn}
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
                              clickOutsideToClose: true,
                              width: 403,
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
    <VerticalFlex>
      <P
        className={styles.title}
        size={18}
        paddingTop={80}
        paddingBottom={45}
        color="#fff"
      >
        {"PASS앱에서 인증 후\n인증완료 버튼을 눌러주세요"}
      </P>

      <Image
        src="/resources/images/pass_phone.png"
        width={"100%"}
        maxWidth={"285px"}
        // height={"auto"}
      />

      <FlexChild
        width={"max-content"}
        gap={7}
        paddingTop={60}
        className={styles.continue_box}
      >
        <Button
          className={clsx(styles.prev_btn, styles.white)}
          width={180}
          onClick={() => setStep("certification")}
        >
          이전
        </Button>
        <Button
          width={180}
          className={styles.next_btn}
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
                          clickOutsideToClose: true,
                          width: 403,
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
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(
    data?.current?.username || ""
  );
  // const [email, setEmail] = useState<string>(data?.current?.email || "");
  // const [emailError, setEmailError] = useState<string>("");
  const [password, setPassword] = useState<string>(
    data?.current?.password || ""
  );
  const [passwordError, setPasswordError] = useState<string>("");
  const [password2, setPassword2] = useState<string>(
    data?.current?.password || ""
  );
  const [passwordError2, setPasswordError2] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  // const [code, setCode] = useState<string>("");
  // const [inputCode, setInputCode] = useState<string>("");
  return (
    <VerticalFlex width={"100%"} maxWidth={600}>
      <FlexChild className={styles.step_title}>
        <P>기본 정보</P>
      </FlexChild>

      <VerticalFlex className={styles.input_box}>
        <VerticalFlex className={styles.input_item}>
          <HorizontalFlex className={styles.label}>
            <P>이름</P>
            <Span>(필수)</Span>
          </HorizontalFlex>
          <FlexChild>
            <Input
              type="text"
              width={"100%"}
              placeHolder="이름을 입력하세요"
              readOnly
              value={data?.current?.userName}
              className="web_input"
            />
          </FlexChild>
        </VerticalFlex>
        {/* 이메일 안씀 */}
        {/* <VerticalFlex className={styles.input_item}>
          <HorizontalFlex className={styles.label}>
            <P>이메일</P>
            <Span>(필수)</Span>
          </HorizontalFlex>
          <FlexChild gap={10}>
            <Input
              type="text"
              width={"100%"}
              placeHolder="이메일을 입력하세요"
              regExp={[emailFormat]}
              value={email}
              onChange={(value) => {
                setEmail(value as string);
                setCode("");
              }}
              onFeedBackChange={(feedback) => setEmailError(feedback)}
              feedbackHide
              className="web_input"
            />
            <Button
              disabled={!!emailError || !email}
              backgroundColor={'var(--main-color2)'}
              width={130}
              minWidth={130}
              height={49}
              onClick={() => {
                setIsLoading(true);
                requester.isExistUser(
                  {
                    email,
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
                        clickOutsideToClose: true,
                        width: 403,
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
                      requester.sendEmail(
                        {
                          email,
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
                            setCode(code);
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
              <P fontWeight={600} fontSize={15} lineHeight={1.3}>
                {code ? "재전송" : "인증코드 받기"}
              </P>
            </Button>
          </FlexChild>
          <FlexChild>
            {code && (
              <FlexChild paddingTop={12}>
                <Input
                  id="code"
                  width={"100%"}
                  placeHolder="인증코드 6자리"
                  value={inputCode}
                  maxLength={6}
                  onChange={(value) => {
                    setInputCode(value as string);
                    if (String(value).length === 6)
                      document.getElementById("password")?.click();
                  }}
                  className="web_input"
                />
              </FlexChild>
            )}
          </FlexChild>
        </VerticalFlex> */}

        <VerticalFlex className={styles.input_item}>
          <HorizontalFlex className={styles.label}>
            <P>휴대폰번호</P>
            <Span>(필수)</Span>
          </HorizontalFlex>
          <FlexChild>
            <Input
              type="text"
              width={"100%"}
              readOnly
              value={data?.current?.userPhoneNum}
              className="web_input"
            />
          </FlexChild>
        </VerticalFlex>

        <VerticalFlex className={styles.input_item}>
          <HorizontalFlex className={styles.label}>
            <P>아이디</P>
            <Span>(필수)</Span>
          </HorizontalFlex>
          <FlexChild>
            <Input
              type="text"
              width={"100%"}
              placeHolder="아이디를 입력하세요"
              value={username}
              onChange={(value) => setUsername(value as string)}
              className="web_input"
            />
          </FlexChild>
        </VerticalFlex>

        <VerticalFlex className={styles.input_item}>
          <HorizontalFlex className={styles.label}>
            <P>비밀번호</P>
            <Span>(필수)</Span>
          </HorizontalFlex>
          <FlexChild>
            <VerticalFlex alignItems="flex-start">
              <Input
                type="password"
                width={"100%"}
                placeHolder="비밀번호를 입력하세요"
                feedback="영문 대소문자, 숫자, 특수문자 조합 최소8자"
                regExp={[passwordFormat]}
                value={password}
                onChange={(value) => setPassword(value as string)}
                onFeedBackChange={(feedback) => setPasswordError(feedback)}
                feedbackHide
                className="web_input"
              />
              <Span className={styles.inputError} paddingLeft={6}>
                {passwordError}
              </Span>
            </VerticalFlex>
          </FlexChild>
          <FlexChild>
            <VerticalFlex alignItems="flex-start">
              <Input
                type="password"
                width={"100%"}
                placeHolder="비밀번호를 한번 더 입력하세요"
                feedback="비밀번호가 일치하지 않습니다"
                regExp={[
                  {
                    exp: {
                      test: (value) => value === password,
                    },
                  },
                ]}
                value={password2}
                onChange={(value) => setPassword2(value as string)}
                onFeedBackChange={(feedback) => setPasswordError2(feedback)}
                feedbackHide
                className="web_input"
              />
              <Span className={styles.inputError} paddingLeft={6}>
                {passwordError2}
              </Span>
            </VerticalFlex>
          </FlexChild>
        </VerticalFlex>

        {/* <VerticalFlex className={styles.input_item}>
          <HorizontalFlex className={styles.label}>
            <P>비밀번호 질문</P>
          </HorizontalFlex>
          <FlexChild>
            <Select
              classNames={{
                header: "web_select",
                placeholder: "web_select_placholder",
                line: "web_select_line",
                arrow: "web_select_arrow",
                search: "web_select_search",
              }}
              width={"100%"}
              options={[
                {
                  value: "가장 좋아하는 동물은?",
                  display: "가장 좋아하는 동물은?",
                },
                { value: "어릴적 별명은?", display: "어릴적 별명은?" },
                { value: "어머니 성함은?", display: "어머니 성함은?" },
                { value: "출생 도시는?", display: "출생 도시는?" },
                {
                  value: "졸업한 초등학교는?",
                  display: "졸업한 초등학교는?",
                },
              ]}
              placeholder={"질문을 선택하세요"}
              // value={selectedMessageOption}
            />
          </FlexChild>
          <FlexChild>
            <Input
              type="text"
              width={"100%"}
              placeHolder="질문에 대한 답변을 입력하세요."
            />
          </FlexChild>
        </VerticalFlex> */}
        <FlexChild className={styles.continue_box}>
          <Button
            className={styles.prev_btn}
            onClick={() => setStep("certification")}
          >
            이전
          </Button>
          <Button
            className={styles.next_btn}
            disabled={
              !password ||
              !password2 ||
              !!passwordError ||
              !!passwordError2 ||
              password !== password2
              //   ||
              //   !code ||
              //   !inputCode
            }
            onClick={() => {
              // if (code !== inputCode) {
              //   return NiceModal.show("confirm", {
              //     message: "인증코드가 일치하지않습니다.",
              //     confirmText: "확인",
              //     onConfirm: () => {
              //       const _code = document.getElementById("code");
              //       _code?.click();
              //       _code?.focus();
              //     },
              //   });
              // }
              handleUpdate?.([
                { key: "username", value: username },
                // { key: "email", value: email },
                { key: "password", value: password },
              ]);
              requester
                .isExistUser({ username })
                .then(
                  ({
                    exist,
                    username: _username,
                  }: {
                    exist: boolean;
                    username: string;
                  }) => {
                    if (exist) {
                      NiceModal.show("confirm", {
                        clickOutsideToClose: true,
                        width: 403,
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
                                  {_username}
                                </Span>
                              </P>
                            </FlexChild>
                          </VerticalFlex>
                        ),
                        confirmText: "기존 계정으로 로그인하기",
                        onConfirm: () => {
                          navigate(`/login?id=${_username}`);
                        },
                      });
                    } else {
                      const { userName, userPhoneNum, birthday } = data.current;
                      const _birthday = new Date(
                        `${birthday.slice(0, 4)}-${birthday.slice(
                          4,
                          6
                        )}-${birthday.slice(6)}`
                      );
                      if (
                        new Date().getFullYear() - _birthday.getFullYear() <
                        19
                      ) {
                        NiceModal.show("confirm", {
                          message: "만 19세 미만은 가입하 수 없습니다.",
                          confirmText: "확인",
                          onConfirm: () => navigate("/login"),
                        });
                      } else
                        requester.createUser(
                          {
                            username,
                            // email,
                            password,
                            name: userName,
                            phone: userPhoneNum,
                            birthday: _birthday,
                          },
                          ({ access_token }: { access_token: string }) => {
                            handleUpdate?.({
                              key: "access_token",
                              value: access_token,
                            });
                            setStep("completed");
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
    </VerticalFlex>
  );
}

function Completed({ data }: StepProps) {
  const [, setCookie] = useCookies([Cookies.JWT]);
  const navigate = useNavigate();
  return (
    <VerticalFlex className={styles.signup_completed}>
      <FlexChild className={styles.completed_ttitle}>
        <P>회원가입 완료</P>
      </FlexChild>

      <FlexChild className={styles.completed_txt}>
        <P>
          회원가입을 축하드립니다. <br />
          푸푸토이와 함께 더 특별한 경험을 시작해 보세요!
        </P>
      </FlexChild>
      <FlexChild className={styles.continue_box}>
        <Button
          className={styles.home_btn}
          onClick={() => {
            setCookie(
              Cookies.JWT,
              data.current.access_token,
              getCookieOption()
            );
            navigate("/");
          }}
        >
          홈으로
        </Button>
        {/* <Button className={styles.login_btn}>로그인</Button> */}
      </FlexChild>
    </VerticalFlex>
  );
}
