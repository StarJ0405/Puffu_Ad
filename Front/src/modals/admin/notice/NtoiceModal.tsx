import Button from "@/components/buttons/Button";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import DatePicker from "@/components/date-picker/DatePicker";
import Div from "@/components/div/Div";
import Editor from "@/components/editor/edtior";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputImage from "@/components/inputs/InputImage";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import { adminRequester } from "@/shared/AdminRequester";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { dateToString, toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./NoticeModal.module.css";

const types = ["일반", "이벤트"].map((type) => ({
  display: type,
  value: type,
}));

const NoticeModal = NiceModal.create(
  ({
    notice,
    edit = false,
    max = 0,
    onSuccess,
  }: {
    notice: any;
    edit?: boolean;
    onSuccess?: () => void;
    max: number;
  }) => {    
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "배너 " + (edit ? "편집" : "상세정보");
    const buttonText = "close";
    const modal = useRef<any>(null);
    const [unlimit, setUnlimit] = useState(
      !notice.starts_at || !notice.ends_at
    );
    const [dates, setDates] = useState<Date[]>([
      new Date(notice.starts_at),
      new Date(notice.ends_at),
    ]);

    const [actives, setActives] = useState<Date[]>([
      new Date(notice.actives_at || new Date()),
      new Date(notice.deactives_at || new Date()),
    ]);
    const [type, setType] = useState(
      types.find((f) => f.value === notice?.type) || types[0]
    );
    const inputs = useRef<any[]>([]);
    const images = useRef<any[]>([]);
    const [visible, setVisible] = useState<boolean>(notice.visible);
    const [detail, setDetail] = useState<string>(notice.detail);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const handleSave = async () => {
      setIsLoading(true);
      try {
        const title = inputs.current[0].getValue();
        if (!title) {
          return setError("배너명이 입력되지 않았습니다.");
        }

        validateInputs([...inputs.current, ...images.current])
          .then(({ isValid }: { isValid: boolean }) => {
            if (!isValid) return;
            const _data: NoticeDataFrame = {
              title,
              store_id: notice.store_id,
              type: type.value,
              detail,
              visible,
            };
            if (type.value === "이벤트") {
              _data.thumbnail = inputs.current[1].getValue();
              _data.actives_at = actives[0];
              _data.deactives_at = actives[1];
            }
            if (unlimit) {
              _data.starts_at = null;
              _data.ends_at = null;
            } else {
              _data.starts_at = dates[0];
              _data.ends_at = dates[1];
            }

            adminRequester.updateNotice(
              notice.id,
              _data,
              ({ message, error }: { message?: string; error?: string }) => {
                setIsLoading(false);
                if (message) {
                  onSuccess?.();
                  modal.current.close();
                } else if (error) setError(error);
              }
            );
          })
          .catch(() => {
            toast({ message: "오류가 발생했습니다." });
            setIsLoading(false);
          });
      } catch (error) {
        setIsLoading(false);
      }
    };
    useEffect(() => {
      if (!notice) {
        modal.current.close();
      }
    }, [notice]);
    useClientEffect(() => {
      if (error) {
        setIsLoading(false);
        toast({ message: error });
      }
    }, [error]);
    return (
      <ModalBase
        borderRadius={10}
        zIndex={10055}
        ref={modal}
        width={width}
        height={height}
        withHeader={withHeader}
        withFooter={withFooter}
        withCloseButton={withCloseButton}
        clickOutsideToClose={clickOutsideToClose}
        title={title}
        buttonText={buttonText}
      >
        <VerticalFlex
          padding={"10px 20px"}
          maxHeight={"90dvh"}
          overflow="scroll"
          overflowY="scroll"
          hideScrollbar
        >
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>제목</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Input
                    value={notice.title}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[0] = el;
                    }}
                  />
                ) : (
                  <P>{notice.title}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>타입</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Select
                    zIndex={10080}
                    options={types}
                    value={type.value}
                    onChange={(value) =>
                      setType(types.find((f) => f.value === value) || types[0])
                    }
                  />
                ) : (
                  <P notranslate>{notice.type || "미설정"}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild
            hidden={(!edit && !notice.thumbnail) || type.value !== "이벤트"}
          >
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>썸네일</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <InputImage
                    ref={(el) => {
                      inputs.current[1] = el;
                    }}
                    path="/notice"
                    value={notice?.thumbnail}
                  />
                ) : (
                  <Image src={notice.thumbnail} width={"100%"} />
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild hidden={type.value !== "이벤트"}>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>이벤트 기간</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <FlexChild width={300}>
                    <DatePicker
                      zIndex={10080}
                      selectionMode="range"
                      defaultSelectedRange={actives as any}
                      onChange={(dates: any) => setActives(dates)}
                    />
                  </FlexChild>
                ) : (
                  <P>
                    {!notice.actives_at && !notice.deactives_at
                      ? "미설정"
                      : `${dateToString(notice.actives_at)} ~ ${dateToString(
                        notice.deactives_at
                      )}`}
                  </P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>기간 설정</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <CheckboxGroup
                    name="limit"
                    initialValues={unlimit ? ["unlimit"] : []}
                    onChange={(values) =>
                      setUnlimit(values.includes("unlimit"))
                    }
                  >
                    <HorizontalFlex justifyContent="flex-start" gap={20}>
                      <FlexChild width={"max-content"} gap={12}>
                        <CheckboxChild id="unlimit" />
                        <P>무제한</P>
                      </FlexChild>
                      <FlexChild width={300}>
                        <DatePicker
                          zIndex={10080}
                          disabled={unlimit}
                          selectionMode="range"
                          defaultSelectedRange={
                            unlimit ? undefined : (dates as any)
                          }
                          onChange={(dates: any) => setDates(dates)}
                        />
                      </FlexChild>
                    </HorizontalFlex>
                  </CheckboxGroup>
                ) : (
                  <P>
                    {notice?.starts_at && notice?.ends_at
                      ? `${dateToString(notice.starts_at)} ~ ${dateToString(
                        notice.ends_at
                      )}`
                      : "무제한"}
                  </P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>공개상태</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <CheckboxGroup
                    name="visible"
                    initialValues={visible ? ["visible"] : []}
                    onChange={(values) =>
                      setVisible(values.includes("visible"))
                    }
                  >
                    <CheckboxChild id="visible" />
                  </CheckboxGroup>
                ) : (
                  <Image
                    src={
                      notice.visible
                        ? "/resources/images/checkbox_on.png"
                        : "/resources/images/checkbox_off.png"
                    }
                  />
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>상세페이지</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Editor
                    defaultValue={detail}
                    onChange={(detail) => setDetail(detail)}
                    path="/notice"
                  />
                ) : (
                  <Div
                    id="detail"
                    border={"1px solid #d0d0d0"}
                    padding={10}
                    className={clsx(styles.detail)}
                    dangerouslySetInnerHTML={{ __html: detail }}
                  />
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          {edit ? (
            <FlexChild
              justifyContent="center"
              gap={5}
              position="sticky"
              bottom={0}
            >
              <Button
                styleType="admin"
                padding={"12px 20px"}
                fontSize={18}
                isLoading={isLoading}
                onClick={handleSave}
              >
                등록
              </Button>
              <Button
                styleType="white"
                padding={"12px 20px"}
                fontSize={18}
                onClick={() => modal.current.close()}
              >
                취소
              </Button>
            </FlexChild>
          ) : (
            <FlexChild justifyContent="center" gap={5}>
              <Button
                styleType="white"
                padding={"12px 20px"}
                fontSize={18}
                onClick={() => modal.current.close()}
              >
                닫기
              </Button>
            </FlexChild>
          )}
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default NoticeModal;
