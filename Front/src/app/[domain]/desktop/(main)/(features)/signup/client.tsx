// import React, {
//   useState,
//   useRef,
//   useCallback,
//   useContext,
//   useEffect,
// } from "react";
// import style from "./SignUpPage.module.css";
// import { ReduxCheckboxGroup } from "components/checkbox/ReduxCheckboxGroup";
// import { ReduxCheckboxSelectAll } from "components/checkbox/ReduxCheckboxSelectAll";
// import { ReduxCheckboxItem } from "components/checkbox/ReduxCheckboxItem";
// import Div from "components/div/Div";
// import P from "components/P/P";
// import Container from "components/container/Container";
// import VerticalFlex from "components/flex/VerticalFlex";
// import FlexChild from "components/flex/FlexChild";
// import HorizontalFlex from "components/flex/HorizontalFlex";
// import Input from "components/inputs/Input";
// import MemberInfoStep from "./MemberInfoStep";
// import { useAuth } from "shared/hooks/useAuth";
// import { useNavigate } from "react-router-dom";
// import { toast, getStoredPartnerInfo, log } from "shared/utils/Utils";
// import SignUpComplete from "resources/images/signupComplete";

// import _ from "lodash";
// import Icon from "components/icons/Icon";
// import { useTranslation } from "react-i18next";
// import { LanguageContext } from "providers/LanguageProvider";
// import { certificationRequester, requester } from "App";
// import { chinessPhoneFormat } from "components/inputs/regExp";
// import useLanguageNavigate from "shared/hooks/useLanguageNavigate";
// import NiceModal from "@ebay/nice-modal-react";

// // 약관 동의 단계
// const AgreementStep = ({ formData, setFormData, onUpdate }) => {
//   const handleAgreementChange = useCallback(
//     (checkedItems) => {
//       setFormData((prev) => {
//         const termsAgreed = checkedItems.has("terms");
//         const privacyAgreed = checkedItems.has("privacy");
//         const ageConsentAgreed = checkedItems.has("ageConsent");

//         // 이전 상태와 비교하여 실제 변경이 있는 경우에만 업데이트
//         if (
//           prev.termsAgreed !== termsAgreed ||
//           prev.privacyAgreed !== privacyAgreed ||
//           prev.ageConsentAgreed !== ageConsentAgreed
//         ) {
//           return {
//             ...prev,
//             termsAgreed,
//             privacyAgreed,
//             ageConsentAgreed,
//           };
//         }
//         return prev;
//       });
//     },
//     [setFormData]
//   );

//   const { t } = useTranslation();

//   // 약관 내용 샘플 데이터
//   const TERMS_CONTENT = {
//     terms: `
//   ${t("article1Purpose")}
//   ${t("article1PurposeDescription1")}

//   ${t("article2Definition")}

//   ${t("article2DefinitionDescription0")}

//   ${t("article2DefinitionDescription1")}
//   ${t("article2DefinitionDescription2")}
//   ${t("article2DefinitionDescription3")}
//   ${t("article2DefinitionDescription4")}

//   ${t("article3MembershipRegistrationAndWithdrawal")}
//   ${t("article3MembershipRegistrationAndWithdrawalDescription1")}
//   ${t("article3MembershipRegistrationAndWithdrawalDescription2")}
//   ${t("article3MembershipRegistrationAndWithdrawalDescription3")}

//   ${t("article4Contract")}
//   ${t("article4ContractDescription1")}
//   ${t("article4ContractDescription2")}
  

//   ${t("puffuGlobalServiceInfo")}
//     `,
//     privacy: `
//     ${t("section1_title")}
// ${t("basic_info_only")}
// ${t("no_sensitive_data")}
// ${t("agree_check")}
// ${t("legal_violation_block")}
// ${t("cs_inquiry_check")}
// ${t("service_maintenance")}
// ${t("law_process")}
// ${t("complaint_response")}
// ${t("cs_point_management")}
// ${t("order_payment_check")}
// ${t("personalized_service")}
// ${t("event_notification")}
// ${t("statistics_and_development")}
// ${t("marketing_for_partners")}
// ${t("promotion_for_affiliates")}
// ${t("ads_and_email")}
// ${t("service_analysis_and_research")}
// ${t("log_record_protection")}
// ${t("payment_processing")}

// ${t("section2_title")}
// ${t("info_collection_intro")}
// ${t("auto_collected_info")}
// ${t("usage_records")}

// ${t("section3_title")}
// ${t("child_under_14_consent")}
// ${t("child_guardian_verification")}

// ${t("section4_title")}
// ${t("outsourcing_within_purpose")}
// ${t("outsourcing_with_consent")}

// ${t("section5_title")}
// ${t("third_party_no_share")}
// ${t("third_party_share_conditions")}
// ${t("third_party_share_consent")}
// ${t("third_party_share_payment")}
// ${t("third_party_share_statistics")}
// ${t("third_party_share_legal_demand")}
// ${t("third_party_share_investigation")}

// ${t("section6_title")}
// ${t("retention_policy_intro")}
// ${t("retention_policy_intro_sub")}
// ${t("retention_law_contract")}
// ${t("retention_law_delivery")}
// ${t("retention_law_dispute")}
// ${t("retention_law_visit")}
// ${t("withdrawal_reactivation")}
// ${t("inactive_account_migration")}
// ${t("inactive_account_data_types")}
// ${t("inactive_account_notification")}
// ${t("inactive_account_reactivation")}
// ${t("credit_validity")}
// ${t("destruction_method_intro")}
// ${t("destruction_paper")}
// ${t("destruction_digital")}

// ${t("section7_title")}
// ${t("user_rights_intro")}
// ${t("user_rights_view_edit")}
// ${t("user_rights_request_info")}
// ${t("user_rights_info_held")}
// ${t("user_rights_consent_status")}
// ${t("user_rights_third_party_status")}
// ${t("user_rights_correction_flow")}
// ${t("user_rights_request_response_time")}
// ${t("withdraw_consent_right")}
// ${t("view_edit_restriction_conditions")}
// ${t("restriction_life_risk")}
// ${t("restriction_service_disruption")}
// ${t("restriction_law_violation")}

// ${t("section8_title")}
// ${t("privacy_manager_responsibility")}
// ${t("privacy_manager_info")}
// ${t("privacy_contact_rights")}

// ${t("section9_title")}
// ${t("cookie_intro")}
// ${t("cookie_purpose_frequency")}
// ${t("cookie_purpose_personalization")}
// ${t("cookie_purpose_improvement")}
// ${t("cookie_user_control")}

// ${t("section10_title")}
// ${t("privacy_protection_intro")}
// ${t("technical_measures_intro")}
// ${t("technical_encryption")}
// ${t("technical_antivirus")}
// ${t("technical_secure_transmission")}
// ${t("technical_ids_vulnerability")}
// ${t("organizational_measures_intro")}
// ${t("organizational_minimal_access")}
// ${t("organizational_access_control")}
// ${t("organizational_policy_audit")}

// ${t("section11_title")}
// ${t("privacy_violation_help_intro")}
// ${t("privacy_org_kisa")}
// ${t("privacy_org_kopico")}
// ${t("privacy_org_prosecution")}
// ${t("privacy_org_police")}

// ${t("section12_title")}
// ${t("privacy_policy_change_notice")}
// ${t("privacy_policy_last_updated")}
//     `,
//   };

//   return (
//     <Div className={style.formGroup}>
//       <ReduxCheckboxGroup onChange={handleAgreementChange}>
//         <Div className={style.allCheckbox}>
//           <Div className={style.checkboxWrapper}>
//             <ReduxCheckboxSelectAll
//               values={["terms", "privacy", "ageConsent"]}
//               display={"flex"}
//               className={style.checkbox}
//               fontSize={22}
//               gap={10}
//               // label={"전체 동의"}
//               label={
//                 <Div className={style.checkboxLabelText}>
//                   <P size={20} paddingLeft={10} color={"#353535"}>
//                     totallyAgree
//                   </P>
//                 </Div>
//               }
//             />
//           </Div>
//         </Div>

//         <Div className={style.checkboxWrapper}>
//           <ReduxCheckboxItem
//             value="terms"
//             className={style.checkbox}
//             display={"flex"}
//             label={
//               <Div className={style.checkboxLabelText}>
//                 <P size={20} paddingLeft={10} color={"#353535"}>
//                   agreeToTermsOfUse
//                 </P>
//               </Div>
//             }
//           />
//         </Div>
//         <Div className={style.termsContainer} marginBottom={20}>
//           <P>{TERMS_CONTENT.terms}</P>
//         </Div>

//         <Div className={style.checkboxWrapper}>
//           <ReduxCheckboxItem
//             value="privacy"
//             className={style.checkbox}
//             display={"flex"}
//             label={
//               <Div className={style.checkboxLabelText}>
//                 <P size={20} paddingLeft={10} color={"#353535"}>
//                   consentToCollectionAndUseOfPersonalInformation
//                 </P>
//               </Div>
//             }
//           />
//         </Div>
//         <Div className={style.termsContainer} marginBottom={20}>
//           <P>{TERMS_CONTENT.privacy}</P>
//         </Div>

//         <Div className={style.checkboxWrapper}>
//           <ReduxCheckboxItem
//             value="ageConsent"
//             className={style.checkbox}
//             display={"flex"}
//             label={
//               <HorizontalFlex>
//                 <Div className={style.checkboxLabelText}>
//                   <P size={20} paddingLeft={10} color={"#e31a43"}>
//                     [{t("essential")}]
//                   </P>
//                   <P size={20} paddingLeft={10} color={"#353535"}>
//                     least14YearsOld
//                   </P>
//                 </Div>
//               </HorizontalFlex>
//             }
//           />
//         </Div>
//       </ReduxCheckboxGroup>
//     </Div>
//   );
// };

// // 최종 확인 단계
// const ConfirmationStep = ({ formData }) => {
//   return (
//     <VerticalFlex marginTop={50}>
//       <FlexChild justifyContent={"center"} marginBottom={20}>
//         <SignUpComplete />
//       </FlexChild>
//       <FlexChild maxWidth={400}>
//         <HorizontalFlex>
//           <FlexChild maxWidth={120}>
//             <P size={20} color={"#8B8B8B"}>
//               이메일
//             </P>
//           </FlexChild>
//           <FlexChild>
//             <P size={20}>{formData.email}</P>
//           </FlexChild>
//         </HorizontalFlex>
//       </FlexChild>
//       {/* <FlexChild maxWidth={400}>
//         <HorizontalFlex>
//           <FlexChild maxWidth={120}>
//             <P size={20} color={'#8B8B8B'}>이름</P>
//           </FlexChild>
//           <FlexChild>
//             <P size={20}>{formData.name}</P>
//           </FlexChild>
//         </HorizontalFlex>
//       </FlexChild>
//       <FlexChild maxWidth={400}>
//         <HorizontalFlex>
//           <FlexChild maxWidth={120}>
//             <P size={20} color={'#8B8B8B'}>휴대폰 번호</P>
//           </FlexChild>
//           <FlexChild>
//             <P size={20}>{formData.phoneNumber}</P>
//           </FlexChild>
//         </HorizontalFlex>
//       </FlexChild>
//       <FlexChild maxWidth={400}>
//         <HorizontalFlex>
//           <FlexChild maxWidth={120}>
//             <P size={20} color={'#8B8B8B'}>생년월일</P>
//           </FlexChild>
//           <FlexChild>
//             <P size={20}>{formData.birthDay}</P>
//           </FlexChild>
//         </HorizontalFlex>
//       </FlexChild>
//       <FlexChild maxWidth={400}>
//         <HorizontalFlex>
//           <FlexChild maxWidth={120}>
//             <P size={20} color={'#8B8B8B'}>주소</P>
//           </FlexChild>
//           <FlexChild>
//             <P size={20}>{formData.address}</P>
//           </FlexChild>
//         </HorizontalFlex>
//       </FlexChild> */}
//     </VerticalFlex>
//   );
// };

// const CompleteStep = ({ formData }) => {
//   return (
//     <VerticalFlex marginTop={50} maxWidth={900}>
//       <FlexChild
//         justifyContent={"center"}
//         alignItems="flex-end"
//         marginBottom={60}
//       >
//         <P size={40} weight={"600"} color={"#353535"}>
//           signUpComplete
//         </P>
//       </FlexChild>
//       <FlexChild
//         borderRadius={9999}
//         backgroundColor={"var(--main-color)"}
//         cursor={"none"}
//         width={"fit-content"}
//         padding={"10px 26px"}
//         marginBottom={50}
//       >
//         <P size={16} color={"white"} weight={"500"}>
//           UserTips
//         </P>
//       </FlexChild>
//       <FlexChild
//         justifyContent={"center"}
//         alignItems="flex-end"
//         marginBottom={20}
//       >
//         <P size={30} weight={"600"} paddingBottom={9}>
//           signUpShareLink
//         </P>
//         <P
//           bottom={0}
//           size={50}
//           weight={700}
//           color={"var(--main-color)"}
//           padding={"0 14px"}
//         >
//           signUpPoint
//         </P>
//         <P size={30} weight={"600"} paddingBottom={9}>
//           signUpReceive
//         </P>
//       </FlexChild>
//       <FlexChild justifyContent={"center"}>
//         <P
//           size={14}
//           weight={"400"}
//           color={"#bababa"}
//           textAlign={"center"}
//           lineHeight={2}
//         >
//           signUpInfo
//         </P>
//       </FlexChild>
//       {/* <FlexChild justifyContent={'center'} marginBottom={20}>
//         <P size={18} weight={'500'} color={'#8B8B8B'}>회원님에게 일정 포인트가 적립됩니다</P>
//       </FlexChild> */}
//       <FlexChild
//         className={style.CardImg}
//         justifyContent={"center"}
//         paddingTop={70}
//         height={320}
//         alignItems="flex-start"
//         overflowY={"hidden"}
//       >
//         <Icon name={"pointCard2"} />
//       </FlexChild>
//     </VerticalFlex>
//   );
// };

// const SignUpPage = () => {
//   const navigate = useNavigate();
//   const languageNavigate = useLanguageNavigate()
//   const { login, signup } = useAuth();
//   const [currentStep, setCurrentStep] = useState(1);
//   const { t } = useTranslation();
//   const { currencyCode } = useContext(LanguageContext);
//   const [emailVerified, setEmailVerified] = useState(false);
//   const [phoneVerified, setPhoneVerified] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);

//   const handleEmailVerified = (emailExists) => {
//     setEmailVerified(!emailExists);
//   };

//   const handlePhoneVerified = (phoneExists) => {
//     setPhoneVerified(!phoneExists);
//   };

//   const [formData, setFormData] = useState({
//     email: "",
//     name: "",
//     password: "",
//     passwordConfirm: "",
//     termsAgreed: false,
//     privacyAgreed: false,
//     ageConsentAgreed: false,
//     // passwordQuestion: '',
//     // passwordAnswer: '',
//     question: "",
//     value: "",
//     birthDate: "",
//     phoneNumber: "",
//   });
//   useEffect(() => {
//     log("formData : ", formData);
//   }, [formData])

//   const partnerInfo = getStoredPartnerInfo();

//   const getFillWidth = (step) => {
//     switch (step) {
//       case 1:
//         return "25%";
//       case 2:
//         return "75%";
//       case 3:
//         return "99%";
//       case 4:
//         return "100%";
//       default:
//         return "0%";
//     }
//   };

//   const onSignUpClick = async () => {
//     if (validateStep(currentStep)) {
//       try {
//         const signupData = {
//           email: formData.email,
//           password: formData.password,
//           first_name: formData.name,
//           phone: formData.phoneNumber,
//           // birthday: formData.birth,
//           // question: _.pick(formData, ['passwordQuestion', 'passwordAnswer']),
//           question: _.pick(formData, ["question", "value"]),
//           recommender: partnerInfo?.partnerId,
//         };

//         const response = await signup(signupData);

//         if (response) {
//           const email = formData.email;
//           const password = formData.password;

//           try {
//             const success = await login({ email, password });
//           } catch (error) {
//             // 에러 메시지 처리
//             toast({
//               message: "pleaseRetry",
//             });
//           }

//           // handleNext()
//         } else {
//           toast({
//             type: "error",
//             message: "duplicateEmail",
//           });
//         }
//       } catch (error) {
//         const errorMessage = error?.response?.data?.message;
//         if (errorMessage === "account is locked") {
//           toast({
//             type: "error",
//             message: "pleaseCheckedLoginInfo",
//           });
//         } else if (errorMessage === "email or password is not correct") {
//           toast({
//             type: "error",
//             message: "pleaseCheckedLoginInfo",
//           });
//         } else {
//           toast({
//             type: "error",
//             message: "pleaseRetry",
//           });
//         }
//       }
//     } else {
//       if (formData.password !== formData.passwordConfirm) {
//         toast({
//           type: "error",
//           message: "passwordIsIncorrect",
//         });
//       } else {
//         toast({
//           type: "error",
//           message: "enterAllRequiredItems",
//         });
//       }
//     }
//   };
//   // const verificationSuccess = (verifiedName, birthday) => {
//   //   setFormData((prev) => ({
//   //     ...prev,
//   //     name: verifiedName,
//   //     birthDate: birthday,
//   //   }));
//   // };

//   const validateStep = (step) => {
//     switch (step) {
//       case 1:
//         return formData.termsAgreed && formData.privacyAgreed && formData.ageConsentAgreed;

//       case 2: {
//         const birthDatePattern = /^\d{4}-\d{2}-\d{2}$/;
//         // const phoneNumberPattern = /^\+\d{2}\)\d{3}-\d{4}-\d{4}$/;
//         const phoneNumberPattern = chinessPhoneFormat.exp; ///^\(\+86\)1\d{10}$/; // /^\(\+\d{2}\)\d{3}-\d{4}-\d{4}$/;
//         const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         // const emailPattern = /@/;

//         if (
//           !formData.email ||
//           !formData.password ||
//           !formData.passwordConfirm ||
//           !formData.name
//           // !formData.phoneNumber
//           // !formData.birthDate
//         ) {
//           toast({
//             type: "error",
//             message: "enterAllRequiredItems",
//           });
//           return false;
//         }

//         if (!emailPattern.test(formData.email)) {
//           toast({
//             type: "error",
//             message: "emailFormatInvalid",
//           });
//           return false;
//         }

//         if (!emailVerified) {
//           toast({
//             type: "error",
//             message: "checkEmailDoubleCheck",
//           });
//           return false;
//         }

//         if (formData.password !== formData.passwordConfirm) {
//           toast({
//             type: "error",
//             message: "passwordIsIncorrect",
//           });
//           return false;
//         }

//         // if (!phoneNumberPattern.test(formData.phoneNumber)) {
//         //   toast({
//         //     type: "error",
//         //     message: "phoneNumberFormatInvalid",
//         //   });
//         //   return false;
//         // }

//         // if (!phoneVerified) {
//         //   toast({
//         //     type: "error",
//         //     message: "checkPhoneNumberDoubleCheck",
//         //   });
//         //   return false;
//         // }

//         // 전화번호가 입력됬을 때만 , 전화번호 유효성 검증
//         if (formData.phoneNumber) {
//           if (!phoneNumberPattern.test(formData.phoneNumber)) {
//             toast({ type: "error", message: "phoneNumberFormatInvalid" });
//             return false;
//           }
//           if (!phoneVerified) {
//             toast({ type: "error", message: "checkPhoneNumberDoubleCheck" });
//             return false;
//           }
//         }

//         // if (!birthDatePattern.test(formData.birthDate)) {
//         //   toast({
//         //     type: "error",
//         //     message: "birthDateFormatInvalid",
//         //   });
//         //   return false;
//         // }
//         // if (!formData.question || !formData.value) {
//         //   toast({
//         //     type: "error",
//         //     message: "enterAllRequiredItems",
//         //   });
//         //   return false;
//         // }

//         // log(currencyCode)
//         // if (currencyCode === "cny") {
//         //   const phonePattern = /^1\d{2}-\d{4}-\d{4}$/;
//         //   if (!phonePattern.test(formData.phoneNumber)) {
//         //     toast({
//         //       type: "error",
//         //       message:
//         //         "phoneNumberFormatInvalid",
//         //     });
//         //     return false;
//         //   }
//         // }

//         return true;
//       }

//       default:
//         return true;
//     }
//   };

//   const signUp = async () => {
//     try {
//       const signupData = {
//         email: formData.email,
//         password: formData.password,
//         // question: _.pick(formData, ["question", "value"]),
//         // question: {
//         //   [formData.question]: {
//         //     value: formData.value,
//         //     index: 0,
//         //   },
//         // },
//         ...(formData.question && formData.value
//           ? {
//             question: {
//               [formData.question]: { value: formData.value, index: 0 },
//             },
//           }
//           : {}),
//         metadata: {
//           certification: false,
//         },
//         recommender: partnerInfo?.partnerId,
//         first_name: formData.name.toString(),
//         // phone: formData.phoneNumber.toString(),

//         ...(formData.phoneNumber
//           ? { phone: formData.phoneNumber.toString() }
//           : {}),
//         // birthday: formData.birthDate.toString(),
//       };

//       const response = await signup(signupData);
//       if (response) {
//         setCurrentStep((prev) => Math.min(prev + 1, 4));
//       } else {
//         toast({
//           type: "error",
//           message: "duplicateEmail",
//         });
//       }
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message;
//       toast({
//         type: "error",
//         message: errorMessage,
//       });
//     }
//   };

//   const goToShopping = async () => {
//     const email = formData.email;
//     const password = formData.password;

//     try {
//       const success = await login({ email, password });
//       navigate("/");
//     } catch (error) {
//       // 에러 메시지 처리
//       toast({
//         message: "pleaseRetry",
//       });
//     }
//   };

//   const handleNext = async () => {
//     // log("formData : ", formData);
//     // if (currentStep === 2 && !isVerified) {
//     //   certificationRequester.createCertification(
//     //     {
//     //       name: formData.vertificationName,
//     //       cardno: formData.vertificationCardno,
//     //     },
//     //     (res) => {
//     //       if (res?.code === 1 && res?.isok === 1) {
//     //         verificationSuccess(
//     //           formData.vertificationName,
//     //           res?.data?.birthday
//     //         );
//     //         setIsVerified(true);
//     //         // signUp();
//     //       } else {
//     //         toast({
//     //           type: "error",
//     //           message: "identityVerificationFailed",
//     //         });
//     //       }
//     //     }
//     //   );
//     // } else {
//     //   if (validateStep(currentStep)) {
//     //     if (currentStep === 2) {
//     //       signUp();
//     //     } else {
//     //       setCurrentStep((prev) => Math.min(prev + 1, 4));
//     //     }
//     //   }
//     // }
//     if (!validateStep(currentStep)) {
//       return;
//     } else {
//       if (currentStep === 2) {
//         signUp();
//       } else {
//         setCurrentStep((prev) => Math.min(prev + 1, 4));
//       }
//     }
//   };

//   const handlePrev = () => {
//     setCurrentStep((prev) => {
//       const newStep = Math.max(prev - 1, 1);
//       if (prev === 2 && isVerified) {
//         setIsVerified(false);
//       }
//       return newStep;
//     });
//   };

//   const updateFormData = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };
//   const goCertification = async () => {
//     const email = formData.email;
//     const password = formData.password;
//     const name = formData.name;
//     try {
//       // const success = await login({ email, password });
//       NiceModal.show("certification", { email, password, name, notLogin: false })
//       // await login({ email, password })
//       // languageNavigate("certification")
//     } catch (error) {
//       toast({
//         message: "pleaseRetry",
//       });
//     }
//   }

//   return (
//     <Container maxWidth={1200} minHeight={"calc(100vh - 92px)"}>
//       <VerticalFlex>
//         <FlexChild margin={"50px 0"} justifyContent={"center"}>
//           <P textAlign={"center"} size={50} weight={700} color={"#353535"}>
//             signUp
//           </P>
//         </FlexChild>
//         <FlexChild>
//           <Div className={style.progressContainer}>
//             <Div className={style.progressBar}>
//               <div
//                 className={style.progressBarFill}
//                 style={{
//                   width: getFillWidth(currentStep),
//                 }}
//               />
//             </Div>
//             <Div className={style.progressDots}>
//               {[1, 2, 3].map((step) => (
//                 <Div
//                   key={step}
//                   className={`
//                     ${style.progressDot}
//                     ${step < currentStep ? style.progressDotComplete : ""}
//                     ${step === currentStep ? style.progressDotActive : ""}
//                   `}
//                 >
//                   {step < currentStep ? "" : step}
//                 </Div>
//               ))}
//             </Div>
//           </Div>
//         </FlexChild>
//         <FlexChild justifyContent={"center"}>
//           {currentStep === 1 && (
//             <AgreementStep
//               formData={formData}
//               setFormData={setFormData}
//               onUpdate={updateFormData}
//             />
//           )}
//           {currentStep === 2 && (
//             <MemberInfoStep
//               formData={formData}
//               onUpdate={updateFormData}
//               isVerified={isVerified}
//               // onVerificationSuccess={verificationSuccess}
//               handleEmailVerified={handleEmailVerified}
//               handlePhoneVerified={handlePhoneVerified}
//             />
//           )}
//           {/* {currentStep === 3 && <ConfirmationStep formData={formData} />} */}
//           {currentStep === 3 && <CompleteStep formData={formData} />}
//         </FlexChild>
//         <FlexChild padding={"0px 0 100px 0"} justifyContent={"center"}>
//           {currentStep >= 3 ? (
//             <HorizontalFlex justifyContent={"center"} gap={15}>
//               <FlexChild
//                 // justifyContent={"center"}
//                 onClick={goToShopping}
//                 className={`${style.button} ${style.buttonNext}`}
//               >
//                 <P size={18}>goShopping</P>
//               </FlexChild>
//               <FlexChild
//                 onClick={() => goCertification()}
//                 className={`${style.button} ${style.buttonNext}`}
//               >
//                 <P size={18} weight={500}>
//                   identityVerification
//                 </P>
//               </FlexChild>
//             </HorizontalFlex>

//           ) : (
//             <HorizontalFlex gap={15} justifyContent={"center"}>
//               <FlexChild
//                 onClick={handlePrev}
//                 className={`${style.button} ${currentStep === 1
//                   ? style.buttonPrevDisabled
//                   : style.buttonPrev
//                   }`}
//                 disabled={currentStep === 1}
//               >
//                 <P size={18}>before</P>
//               </FlexChild>
//               {currentStep === 3 ? (
//                 <FlexChild
//                   onClick={() => onSignUpClick()}
//                   className={`${style.button} ${style.buttonNext}`}
//                 >
//                   <P size={18}>signupComplete</P>
//                 </FlexChild>
//               ) : (
//                 <FlexChild
//                   onClick={handleNext}
//                   className={`${style.button} ${style.buttonNext}`}
//                 >
//                   <P size={18}>next</P>
//                 </FlexChild>
//               )}
//             </HorizontalFlex>
//           )}
//         </FlexChild>
//       </VerticalFlex>
//     </Container>
//   );
// };

// export default SignUpPage;
