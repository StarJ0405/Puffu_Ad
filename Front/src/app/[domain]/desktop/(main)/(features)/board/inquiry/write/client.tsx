"use client";
import PrivacyContent from "@/components/agreeContent/privacyContent";
import Button from "@/components/buttons/Button";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputImage from "@/components/inputs/InputImage";
import InputTextArea from "@/components/inputs/InputTextArea";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { requester } from "@/shared/Requester";
import { toast } from "@/shared/utils/Functions";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import boardStyle from "../../boardGrobal.module.css";
import styles from "./page.module.css";

export function WriteFrame() {
  const router = useRouter();
  const { userData } = useAuth();
  const imageRef = useRef<any>(null);

  const [qaType, setQaType] = useState<"etc" | "exchange" | "refund" | "">("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAgree, setIsAgree] = useState(false);

  useEffect(() => {
    if (userData) {
      setAuthor(userData.name);
    }
  }, [userData]);

  const handleSubmit = async () => {
    if (!qaType) {
      toast({ message: "문의 유형을 선택해주세요." });
      return;
    }
    if (!title) {
      toast({ message: "제목을 입력해주세요." });
      return;
    }
    if (!content) {
      toast({ message: "내용을 입력해주세요." });
      return;
    }
    if (!isAgree) {
      toast({ message: "개인정보 수집에 동의해주세요." });
      return;
    }

    const imageValidation = await imageRef.current?.isValid();
    if (!imageValidation) {
      return;
    }
    const images = imageRef.current?.getValue();

    const qaData: QADataFrame = {
      type: qaType,
      title,
      user_id: userData?.id || "비회원",
      content,
      images,
    };

    const res = await requester.createQA(qaData);
    if (res) {
      toast({ message: "문의가 등록되었습니다." });
      router.push("/board/inquiry");
    } else {
      toast({ message: "문의 등록에 실패했습니다." });
    }
  };

  return (
    <VerticalFlex className={styles.write_container}>
      <HorizontalFlex className={styles.input_group} justifyContent="start">
        <FlexChild className={styles.input_box}>
          <Span>문의유형</Span>
          <FlexChild className={styles.select}>
            <Select
              classNames={{
                header: "web_select",
                placeholder: "web_select_placholder",
                line: "web_select_line",
                arrow: "web_select_arrow",
                search: "web_select_search",
              }}
              options={[
                { value: "exchange", display: "교환" },
                { value: "refund", display: "환불" },
                { value: "etc", display: "기타" },
              ]}
              placeholder={"문의 유형 선택"}
              value={qaType}
              onChange={(value) =>
                setQaType(value as "etc" | "exchange" | "refund")
              }
            />
          </FlexChild>
        </FlexChild>
      </HorizontalFlex>

      <HorizontalFlex className={styles.input_group} justifyContent="start">
        <FlexChild className={styles.input_box}>
          <Span>작성자</Span>
          <FlexChild>
            <Input
              type={"text"}
              placeHolder="이름을 입력해 주세요."
              className={"web_input"}
              value={author}
              onChange={(value) => setAuthor(value as string)}
              readOnly={!!userData}
            />
          </FlexChild>
        </FlexChild>
      </HorizontalFlex>

      <HorizontalFlex className={styles.input_group} justifyContent="start">
        <FlexChild className={clsx(styles.input_box, styles.title_input)}>
          <Span>제목</Span>
          <FlexChild>
            <Input
              type={"text"}
              placeHolder="제목을 입력해 주세요."
              className={"web_input"}
              width={"100%"}
              value={title}
              onChange={(value) => setTitle(value as string)}
            />
          </FlexChild>
        </FlexChild>
      </HorizontalFlex>

      <FlexChild>
        <InputTextArea
          className={styles.content_textArea}
          placeHolder="내용을 입력해 주세요."
          value={content}
          onChange={(value) => setContent(value as string)}
        />
      </FlexChild>

      <VerticalFlex className={styles.fileUpload_box} alignItems="start">
        <P>이미지 첨부파일 추가</P>
        <InputImage ref={imageRef} multiple />
      </VerticalFlex>

      <VerticalFlex className={styles.privacy_box} gap={15}>
        <FlexChild className={styles.title}>
          <P>개인정보 수집 동의</P>
        </FlexChild>

        <FlexChild className={"agree_content"}>
          <PrivacyContent size={8} />
        </FlexChild>

        <FlexChild>
          <CheckboxGroup name="privacy_check" className={styles.checkBox} onChange={(values) => setIsAgree(values.includes("privacy_input"))}>
            <label>
              <FlexChild gap={10}>
                <CheckboxChild
                  id="privacy_input"
                  checked={isAgree}
                  onChange={(e) => setIsAgree(e.target.checked)}
                />
                <P>개인정보수집에 동의합니다.</P>
              </FlexChild>
            </label>
          </CheckboxGroup>
        </FlexChild>
      </VerticalFlex>

      <FlexChild className={styles.button_group}>
        <Button
          className={styles.cancel_btn}
          onClick={() => router.back()}
        >
          작성 취소
        </Button>
        <Button className={styles.submit_btn} onClick={handleSubmit}>
          문의하기
        </Button>
      </FlexChild>
    </VerticalFlex>
  );
}
