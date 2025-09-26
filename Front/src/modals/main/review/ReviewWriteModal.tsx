"use client";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import P from "@/components/P/P";
import ModalBase from "@/modals/ModalBase";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import styles from "./ReviewWriteModal.module.css";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import Image from "@/components/Image/Image";
import clsx from "clsx";
import InputTextArea from "@/components/inputs/InputTextArea";
import { requester } from "@/shared/Requester";
import { useCallback, useState, useRef, useEffect } from "react";
import InputImage, { InputImageHandle } from "@/components/inputs/InputImage";
import { toast } from "@/shared/utils/Functions";
import useNavigate from "@/shared/hooks/useNavigate";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";

const mapDesign = (v?: string) =>
  v === "마음에 쏙 들어요."
    ? "love"
    : v === "보통이에요."
    ? "ok"
    : v
    ? "not_my_style"
    : undefined;
const mapFinish = (v?: string) =>
  v === "양품이에요."
    ? "good"
    : v === "보통이에요."
    ? "ok"
    : v
    ? "poor"
    : undefined;
const mapMaint = (v?: string) =>
  v === "쉽게 관리 가능해요."
    ? "easy"
    : v === "보통이에요."
    ? "ok"
    : v
    ? "hard"
    : undefined;

const MAX_IMAGES = 4;

const toDisplayDesign = (v?: string) =>
  v === "love"
    ? "마음에 쏙 들어요."
    : v === "ok"
    ? "보통이에요."
    : v === "not_my_style"
    ? "내 취향은 아니네요."
    : v;
const toDisplayFinish = (v?: string) =>
  v === "good"
    ? "양품이에요."
    : v === "ok"
    ? "보통이에요."
    : v === "poor"
    ? "부실해요."
    : v;
const toDisplayMaint = (v?: string) =>
  v === "easy"
    ? "쉽게 관리 가능해요."
    : v === "ok"
    ? "보통이에요."
    : v === "hard"
    ? "관리하기 어려워요."
    : v;

const ReviewModal = NiceModal.create(
  ({
    item,
    review,
    edit = false,
    onConfirm,
    onCancel,
    width = "80vw",
    height = "auto",
    onSuccess,
  }: {
    item?: {
      id: string;
      brand_name?: string;
      product_title?: string;
      variant_title?: string;
      thumbnail?: string;
      discount_price?: string | number;
      unit_price?: string | number;
    };
    review?: any;
    edit?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
    onSuccess?: () => void;
    width?: React.CSSProperties["width"];
    height?: React.CSSProperties["height"];
  }) => {
    const modal = useModal();
    const isEdit = !!review?.id;
    if (!isEdit && !item?.id) return;
    const mode: "view" | "write" | "edit" = edit
      ? isEdit
        ? "edit"
        : "write"
      : "view";
    const title =
      mode === "edit"
        ? "리뷰 수정"
        : mode === "write"
        ? "리뷰 작성"
        : "리뷰 상세";

    const [rating, setRating] = useState<number>(0);
    const [design, setDesign] = useState<string | undefined>();
    const [finish, setFinish] = useState<string | undefined>();
    const [maintenance, setMaintenance] = useState<string | undefined>();
    const [content, setContent] = useState<string>("");

    const [isLoading, setIsLoading] = useState(false);

    const imgRef = useRef<InputImageHandle>(null);
    const [persisted, setPersisted] = useState<string[]>(
      Array.isArray(review?.images) ? review!.images! : []
    );
    const [uploadedPreviews, setUploadedPreviews] = useState<string[]>([]);
    const totalImages = persisted.length + uploadedPreviews.length;

    const navigate = useNavigate();
    const { isMobile } = useBrowserEvent();

    // 수정 모드 프리필
    useEffect(() => {
      if (!isEdit) return;
      setRating(
        Number(review?.star_rate ?? review?.metadata?.rating ?? 0) || 0
      );
      setContent(review?.content ?? "");
      setPersisted(Array.isArray(review?.images) ? review!.images! : []);
      const aspects = review?.metadata?.aspects ?? {};
      setDesign(toDisplayDesign(aspects?.design));
      setFinish(toDisplayFinish(aspects?.finish));
      setMaintenance(toDisplayMaint(aspects?.maintenance));
      imgRef.current?.empty?.();
      setUploadedPreviews([]);
    }, [isEdit, review]);

    const handleImagesChanged = useCallback((imgs: any[]) => {
      const urls = imgs.map((i: any) => i.url);
      setUploadedPreviews(urls);
    }, []);

    const removePersistedAt = (idx: number) =>
      setPersisted((prev) => prev.filter((_, i) => i !== idx));
    const removeUploadedAt = (idx: number) => imgRef.current?.removeAt?.(idx);

    const disabled = isLoading;
    // rating < 1 || content.trim().length < 10;

    const handleSubmit = useCallback(async () => {
      // 작성 모드만 item.id 필수
      if (!isEdit && !item?.id) return;
      if (disabled) return;

      setIsLoading(true);
      try {
        const metadata = {
          version: "1.0.0",
          source: "web",
          aspects: {
            design: mapDesign(design),
            finish: mapFinish(finish),
            maintenance: mapMaint(maintenance),
          },
        };

        const ok = (await imgRef.current?.isValid?.()) ?? true;
        if (!ok) return;
        const val = imgRef.current?.getValue?.();
        const uploaded: string[] = Array.isArray(val) ? val : val ? [val] : [];
        const images = Array.from(new Set([...(persisted || []), ...uploaded]));

        if (isEdit) {
          await requester.updateReviews(review!.id, {
            content,
            images,
            star_rate: rating,
            metadata,
            return_data: false,
          });
        } else {
          await requester.createReview(
            {
              item_id: item!.id,
              content,
              images,
              star_rate: rating,
              metadata,
              return_data: false,
            },
            () => {}
          );
        }

        // 글자수 제한 별점 체크 통과 못하면 return
        if (rating < 1) {
          toast({ message: "평점을 1점 이상 평가해 주세요." });
          return;
        }
        if (content.trim().length < 10) {
          toast({ message: "내용을 10자 이상 적어주세요." });
          return;
        }

        onConfirm?.();
        onSuccess?.();
        modal.remove();
        toast({ message: "리뷰 작성이 완료되었습니다." });
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, [
      isEdit,
      review?.id,
      item?.id,
      disabled,
      design,
      finish,
      maintenance,
      content,
      rating,
      persisted,
      modal,
      onConfirm,
    ]);

    return (
      <ModalBase
        withHeader
        headerStyle={{
          backgroundColor: '#221f22',
          borderBottom: 'none',
          color: '#fff',
        }}
        borderRadius={!isMobile ? 10 : 0}
        closeBtnWhite
        width={'100%'}
        maxWidth={700}
        height={!isMobile ? height : '100dvh'}
        // height={height}
        title={title}
        onClose={() => {
          onCancel?.();
          modal.remove();
        }}
        // withCloseButton
        clickOutsideToClose={!isLoading}
        backgroundColor={"#221f22"}
      >
        <VerticalFlex className={clsx(styles.review_write, (isMobile && styles.mob_review_write))}>
          {/* 상품 요약 */}
          <FlexChild 
            className={styles.product_data}
            // 상품 링크 걸어주기
            // onClick={()=> navigate(`/products/${item?.id}`)}
          >
            <HorizontalFlex gap={12} alignItems="flex-start">
              <Image
                width={!isMobile ? 80 : 60}
                height={!isMobile ? 80 : 60}
                src={
                  item?.thumbnail ||
                  review?.item?.thumbnail ||
                  review?.item?.variant?.product?.thumbnail ||
                  review?.item?.product?.thumbnail ||
                  "/resources/images/cart.png"
                }
                borderRadius={5}
              />
              <VerticalFlex alignItems="flex-start" className={styles.product_info}>
                <P lineClamp={2} overflow="hidden" display="--webkit-box" className={styles.brand}>
                  {item?.brand_name ??
                    review?.item?.brand?.name ??
                    review?.item?.brand_name ??
                    "-"}
                </P>
                <P className={styles.title}>
                  {item?.product_title ??
                    review?.item?.product?.name ??
                    review?.item?.product_title ??
                    review?.item?.title ??
                    "-"}
                </P>
                <P className={styles.option_title}>
                  {item?.variant_title ??
                    review?.item?.variant_title ??
                    review?.item?.variant?.title ??
                    "상품 옵션"}
                </P>
                {/* <P>
                  {item?.unit_price}원
                </P> */}
                <P className={styles.price}>
                  {item?.discount_price}원
                </P>
              </VerticalFlex>
            </HorizontalFlex>
          </FlexChild>

          {/* 선택 영역 */}
          <HorizontalFlex className={styles.feedback_select}>
            <FlexChild className={styles.select_item}>
              <Span className={styles.label}>평점</Span>
              <Select
                classNames={{
                  header: "web_select",
                  placeholder: "web_select_placholder",
                  line: "web_select_line",
                  arrow: "web_select_arrow",
                  search: "web_select_search",
                }}
                options={[
                  { value: 5, display: "★★★★★(아주 만족)" },
                  { value: 4, display: "★★★★(만족)" },
                  { value: 3, display: "★★★(보통)" },
                  { value: 2, display: "★★(미흡)" },
                  { value: 1, display: "★(매우 미흡)" },
                ]}
                width={"100%"}
                zIndex={10060}
                value={rating}
                onChange={(v: any) =>
                  setRating(typeof v === "number" ? v : Number(v))
                }
                placeholder="평점을 선택하세요"
              />
            </FlexChild>

            <FlexChild className={styles.select_item}>
              <Span className={styles.label}>외형/디자인</Span>
              <Select
                classNames={{
                  header: "web_select",
                  placeholder: "web_select_placholder",
                  line: "web_select_line",
                  arrow: "web_select_arrow",
                  search: "web_select_search",
                }}
                options={[
                  { value: "마음에 쏙 들어요.", display: "마음에 쏙 들어요." },
                  { value: "보통이에요.", display: "보통이에요." },
                  {
                    value: "내 취향은 아니네요.",
                    display: "내 취향은 아니네요.",
                  },
                ]}
                width={"100%"}
                zIndex={10060}
                value={design}
                onChange={(v: any) =>
                  setDesign(typeof v === "string" ? v : v?.value)
                }
                placeholder="외형/디자인 평가해 주세요."
              />
            </FlexChild>

            <FlexChild className={styles.select_item}>
              <Span className={styles.label}>마감/내구성</Span>
              <Select
                classNames={{
                  header: "web_select",
                  placeholder: "web_select_placholder",
                  line: "web_select_line",
                  arrow: "web_select_arrow",
                  search: "web_select_search",
                }}
                options={[
                  { value: "양품이에요.", display: "양품이에요." },
                  { value: "보통이에요.", display: "보통이에요." },
                  { value: "부실해요.", display: "부실해요." },
                ]}
                width={"100%"}
                zIndex={10060}
                value={finish}
                onChange={(v: any) =>
                  setFinish(typeof v === "string" ? v : v?.value)
                }
                placeholder="마감/내구성 평가해 주세요."
              />
            </FlexChild>

            <FlexChild className={styles.select_item}>
              <Span className={styles.label}>유지관리</Span>
              <Select
                classNames={{
                  header: "web_select",
                  placeholder: "web_select_placholder",
                  line: "web_select_line",
                  arrow: "web_select_arrow",
                  search: "web_select_search",
                }}
                options={[
                  {
                    value: "쉽게 관리 가능해요.",
                    display: "쉽게 관리 가능해요.",
                  },
                  { value: "보통이에요.", display: "보통이에요." },
                  {
                    value: "관리하기 어려워요.",
                    display: "관리하기 어려워요.",
                  },
                ]}
                width={"100%"}
                zIndex={10060}
                value={maintenance}
                onChange={(v: any) =>
                  setMaintenance(typeof v === "string" ? v : v?.value)
                }
                placeholder="유지관리 평가해 주세요."
              />
            </FlexChild>
          </HorizontalFlex>

          {/* 본문 */}
          <VerticalFlex className={clsx("textarea_box", styles.review_content)}>
            <InputTextArea
              width={"100%"}
              style={{ height: "150px" }}
              placeHolder="다른 고객님에게도 도움이 되도록 솔직한 평가를 남겨주세요."
              value={content}
              onChange={(v: any) =>
                setContent(typeof v === "string" ? v : v?.target?.value ?? "")
              }
              maxLength={2000}
              className={styles.content_txtArea}
            />
            <P className={styles.helper}>최소 10자, 평점 필수</P>
          </VerticalFlex>

          <VerticalFlex className={styles.uploader_wrapper}>
            {/* 사진 첨부 아이콘 + 안내 */}
            <FlexChild
              className={styles.upload_btn}
              justifyContent="center"
              gap={10}
              cursor="pointer"
              onClick={() => {
                if (totalImages >= MAX_IMAGES) {
                  toast({ message: "이미지는 최대 4개까지 등록 가능해요." });
                  return;
                }
                totalImages < MAX_IMAGES && imgRef.current?.open();
              }}
              width={"auto"}
            >
              <FlexChild gap={10} width={"auto"}>
                <FlexChild gap={10} width={"auto"}>
                  <Image
                    src={"/resources/icons/board/file_upload_btn.png"}
                    width={35}
                  />
                  <P size={16} color="#fff">
                    이미지 첨부
                  </P>
                </FlexChild>
              </FlexChild>
              <P size={13} color="#797979">
                ※ 이미지는 최대 4개까지 등록이 가능해요.
              </P>
            </FlexChild>

            {/* 미리보기 */}
            {(persisted.length > 0 || uploadedPreviews.length > 0) && (
              <VerticalFlex
                className={styles.upload_preview}
                alignItems="flex-start"
              >
                <FlexChild gap={12} justifyContent="center">
                  {persisted.map((url, idx) => (
                    <FlexChild
                      className={styles.upload_thumb}
                      key={`p_${url}_${idx}`}
                    >
                      <Image src={url} width={'100%'} height={'auto'} objectFit="cover" />
                      <Button
                        className={styles.closeButton}
                        onClick={() => removePersistedAt(idx)}
                        aria-label="remove"
                      >
                        <Image
                          src="/resources/icons/closeBtn_black.png"
                        />
                      </Button>
                    </FlexChild>
                  ))}
                  {uploadedPreviews.map((url, idx) => (
                    <FlexChild
                      key={`u_${url}_${idx}`}
                      className={styles.upload_thumb}
                    >
                      <Image
                        src={url}
                        width={"100%"}
                        height={"auto"}
                        objectFit="cover"
                      />
                      <Button
                        className={styles.closeButton}
                        onClick={() => removeUploadedAt(idx)}
                        aria-label="remove"
                      >
                        <Image src="/resources/icons/closeBtn_black.png" />
                      </Button>
                    </FlexChild>
                  ))}
                </FlexChild>
              </VerticalFlex>
            )}

            {/* 업로더 */}
            <InputImage
              key={`uploader_${persisted.length}`}
              ref={imgRef}
              name="review-images"
              path="review"
              multiple
              maxFiles={Math.max(0, MAX_IMAGES - persisted.length)}
              frame={false}
              placeHolder="10MB 이하, JPG/PNG"
              onChangeImages={handleImagesChanged}
            />
          </VerticalFlex>

          {/* 액션 */}
          <FlexChild className={clsx(isMobile && styles.mob_submit_btn)}>
            <Button
              className={clsx('post_btn', disabled && 'disabled')}
              marginTop={!isMobile ? 25 : 0}
              disabled={disabled}
              isLoading={isLoading}
              onClick={handleSubmit}
            >
              <P>
                {mode === "edit"
                  ? "수정 완료"
                  : mode === "write"
                  ? "리뷰 등록"
                  : "닫기"}
              </P>
            </Button>
          </FlexChild>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default ReviewModal;
