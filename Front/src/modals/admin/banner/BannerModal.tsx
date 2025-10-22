import Button from "@/components/buttons/Button";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import DatePicker from "@/components/date-picker/DatePicker";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputImage from "@/components/inputs/InputImage";
import P from "@/components/P/P";
import { adminRequester } from "@/shared/AdminRequester";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { dateToString, toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./BannerModal.module.css";
const BannerModal = NiceModal.create(
  ({
    banner,
    edit = false,
    max = 0,
    onSuccess,
  }: {
    banner: any;
    edit?: boolean;
    onSuccess?: () => void;
    max: number;
  }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const isMini = !!(banner && banner.index !== undefined && !banner.id);
    const title =
      (isMini ? "미니배너 " : "배너 ") + (edit ? "편집" : "상세정보");
    const buttonText = "close";
    const modal = useRef<any>(null);
    const [unlimit, setUnlimit] = useState(
      isMini ? true : !banner.starts_at || !banner.ends_at
    );
    const [dates, setDates] = useState<Date[]>(
      isMini
        ? [new Date(), new Date()]
        : [new Date(banner.starts_at), new Date(banner.ends_at)]
    );
    const inputs = useRef<any[]>([]);
    const images = useRef<any[]>([]);
    const [adult, setAdult] = useState<boolean>(isMini ? false : banner.adult);
    const [visible, setVisible] = useState<boolean>(
      isMini ? true : banner.visible
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const handleSave = async () => {
      setIsLoading(true);
      try {
        const name = inputs.current[0]?.getValue?.();
        if (!name) return setError("배너명이 입력되지 않았습니다.");

        const to = inputs.current[1]?.getValue?.() || "";

        const pc =
          images.current[0]?.getValue?.() ?? banner?.thumbnail?.pc ?? "";
        const mobile =
          images.current[1]?.getValue?.() ?? banner?.thumbnail?.mobile ?? "";

        if (isMini) {
          if (!to) return setError("URL 링크가 입력되지 않았습니다.");

          const patch = { name, link: to, thumbnail: { pc, mobile } };
          adminRequester.updateStoreMiniBanner(
            banner.store?.id,
            banner.index,
            patch,
            ({ message, error }: { message?: string; error?: string }) => {
              setIsLoading(false);
              if (error) return setError(error);
              onSuccess?.();
              modal.current.close();
            }
          );
          return;
        }

        validateInputs([...inputs.current, ...images.current])
          .then(({ isValid }: { isValid: boolean }) => {
            if (!isValid) return;

            const _data: BannerDataFrame = {
              name,
              store_id: banner.store_id,
              to,
              thumbnail: { pc, mobile },
              adult,
              visible,
            };
            if (unlimit) {
              _data.starts_at = null;
              _data.ends_at = null;
            } else {
              _data.starts_at = dates[0];
              _data.ends_at = dates[1];
            }

            adminRequester.updateBanner(
              banner.id,
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
      } catch {
        setIsLoading(false);
      }
    };
    useEffect(() => {
      if (!banner) {
        modal.current.close();
      }
    }, [banner]);
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
        <VerticalFlex padding={"10px 20px"}>
          <FlexChild>
            {edit ? (
              <HorizontalFlex justifyContent="center" gap={10}>
                <FlexChild width={"max-content"}>
                  <VerticalFlex gap={5}>
                    <P>썸네일(PC)</P>
                    <Div width={280}>
                      <InputImage
                        ref={(el) => {
                          images.current[0] = el;
                        }}
                        value={banner?.thumbnail?.pc}
                      />
                    </Div>
                  </VerticalFlex>
                </FlexChild>
                <FlexChild width={"max-content"}>
                  <VerticalFlex gap={5}>
                    <P>썸네일(모바일)</P>
                    <Div width={280}>
                      <InputImage
                        ref={(el) => {
                          images.current[1] = el;
                        }}
                        value={banner?.thumbnail?.mobile}
                        placeHolder="375X320을 권장합니다."
                      />
                    </Div>
                  </VerticalFlex>
                </FlexChild>
              </HorizontalFlex>
            ) : (
              <HorizontalFlex justifyContent="center" gap={10}>
                <FlexChild width={"max-content"}>
                  <VerticalFlex gap={5}>
                    <P>썸네일(PC)</P>
                    <Image
                      className={styles.image}
                      src={
                        banner?.thumbnail?.pc || "/resources/images/no-img.png"
                      }
                      padding={10}
                      size={200}
                    />
                  </VerticalFlex>
                </FlexChild>
                <FlexChild width={"max-content"}>
                  <VerticalFlex gap={5}>
                    <P>썸네일(모바일)</P>
                    <Image
                      className={styles.image}
                      src={
                        banner?.thumbnail?.mobile ||
                        "/resources/images/no-img.png"
                      }
                      padding={10}
                      size={200}
                    />
                  </VerticalFlex>
                </FlexChild>
              </HorizontalFlex>
            )}
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>배너명</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Input
                    value={banner.name}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[0] = el;
                    }}
                  />
                ) : (
                  <P>{banner.name}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>URL 링크</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Input
                    value={banner.to}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[1] = el;
                    }}
                  />
                ) : (
                  <P notranslate>{banner.to || "미설정"}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>

          {!isMini && (
            <>
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
                        {banner?.starts_at && banner?.ends_at
                          ? `${dateToString(banner.starts_at)} ~ ${dateToString(
                              banner.ends_at
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
                          banner.visible
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
                    <P>성인설정</P>
                  </FlexChild>
                  <FlexChild className={styles.content}>
                    {edit ? (
                      <CheckboxGroup
                        name="adult"
                        initialValues={adult ? ["adult"] : []}
                        onChange={(values) =>
                          setAdult(values.includes("adult"))
                        }
                      >
                        <CheckboxChild id="adult" />
                      </CheckboxGroup>
                    ) : (
                      <Image
                        src={
                          banner.adult
                            ? "/resources/images/checkbox_on.png"
                            : "/resources/images/checkbox_off.png"
                        }
                      />
                    )}
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
            </>
          )}
          {edit ? (
            <FlexChild justifyContent="center" gap={5}>
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

export default BannerModal;
