"use client";

import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { fileRequester } from "@/shared/FileRequester";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import mypage from "../mypage.module.css";
import styles from "./page.module.css";

export function EditInfoClient() {
  const router = useRouter();
  const { userData, reload } = useAuth();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [currentName, setCurrentName] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  useEffect(() => {
    if (userData?.name) {
      setCurrentName(userData.name);
    }
  }, [userData]);

  const handleSave = async () => {
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    let thumbnailUrl = userData?.thumbnail;

    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("files", selectedFile);
        const response: any = await fileRequester.upload(
          formData,
          "user/thumbnail"
        );
        const uploadedUrl = response?.urls?.[0];
        if (!uploadedUrl) {
          throw new Error("Image URL not returned from server.");
        }
        thumbnailUrl = uploadedUrl;
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("이미지 업로드에 실패했습니다.");
        return;
      }
    }

    const updateData: { password?: string; thumbnail?: string } = {};
    if (password) {
      updateData.password = password;
    }
    if (thumbnailUrl !== userData?.thumbnail) {
      updateData.thumbnail = thumbnailUrl;
    }

    if (Object.keys(updateData).length === 0) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    try {
      const res = await requester.updateCurrentUser({ password: password, thumbnail: thumbnailUrl });
      alert("사용자 정보가 성공적으로 변경되었습니다.");
      
      router.back();
    } catch (error) {
      console.error("User update failed:", error);
      alert("사용자 정보 변경에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <>
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageSelect}
        style={{ display: "none" }}
        accept="image/*"
      />
      <VerticalFlex className={clsx(mypage.box_frame)} gap={35}>
        {/* <FlexChild className={mypage.box_header}>
          <P>개인정보 수정</P>
        </FlexChild> */}

        <VerticalFlex className={styles.edit_container}>
          <VerticalFlex className={styles.thumb_box}>
            <FlexChild className={styles.thumbnail}>
              <Image
                src={
                  thumbnailPreview ||
                  userData?.thumbnail ||
                  "/resources/icons/mypage/user_no_img.png"
                }
                width={80}
              />
            </FlexChild>

            <Button
              className={styles.photo_edit_btn}
              onClick={() => imageInputRef.current?.click()}
            >
              <Image
                src={"/resources/icons/mypage/img_edit_icon.png"}
                width={15}
              />
              사진등록
            </Button>
          </VerticalFlex>

          <VerticalFlex className={styles.info_box}>
            <VerticalFlex className={styles.input_box}>
              <P className={styles.input_label}>아이디</P>
              <P size={14} color="#797979">
                {userData?.username || "mynameistony"}
              </P>
            </VerticalFlex>

            <VerticalFlex className={styles.input_box}>
              <P className={styles.input_label}>비밀번호</P>
              <Input
                className="web_input"
                type="password"
                width={"100%"}
                placeHolder="비밀번호를 입력하세요."
                value={password}
                onChange={(value) => setPassword(value as string)}
              />
            </VerticalFlex>

            <VerticalFlex className={styles.input_box}>
              <P className={styles.input_label}>비밀번호 확인</P>
              <Input
                className="web_input"
                type="password"
                width={"100%"}
                placeHolder="비밀번호를 한번 더 입력하세요."
                value={passwordConfirm}
                onChange={(value) => setPasswordConfirm(value as string)}
              />
            </VerticalFlex>

            <VerticalFlex className={styles.input_box}>
              <P className={styles.input_label}>이름</P>
              <Input
                disabled={true}
                className="web_input"
                type="text"
                width={"100%"}
                placeHolder="변경할 이름을 입력하세요"
                value={currentName}
                onChange={(value) => setCurrentName(value as string)}
              />
            </VerticalFlex>
          </VerticalFlex>

          <FlexChild className={styles.button_group}>
            <Button className={styles.cancel_btn} onClick={handleCancel}>
              취소
            </Button>
            <Button className={styles.submit_btn} onClick={handleSave}>
              저장
            </Button>
          </FlexChild>
        </VerticalFlex>
      </VerticalFlex>
    </>
  );
}


