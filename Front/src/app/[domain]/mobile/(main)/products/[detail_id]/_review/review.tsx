"use client";
import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useMemo, useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "@/components/card/dummyProductCard";
import Input from "@/components/inputs/Input";
import InputNumber from "@/components/inputs/InputNumber";
import ListPagination from "@/components/listPagination/ListPagination";
import styles from "./review.module.css";
import InputTextArea from "@/components/inputs/InputTextArea";
// import usePageData from "@/shared/hooks/data/usePageData";
import useInfiniteData from "@/shared/hooks/data/useInfiniteData";
import { toast, maskEmail, maskTwoThirds } from "@/shared/utils/Functions";
import StarRate from "@/components/star/StarRate";
import NoContent from "@/components/noContent/noContent";
import RecommendButton from "@/components/buttons/RecommendButton";

export default function Review({ product }: { product: ProductData }) {
  const navigate = useNavigate();
  const observer = useRef<any>(null);

  const avg = Number(product?.reviews?.avg ?? 0);
  const count = Number(product?.reviews?.count ?? 0);

  const [tab, setTab] = useState<"all" | "photo">("all");
  const PAGE_SIZE = 5;
  const ready = !!product?.id;

  const key = useMemo(() => `reviews:${product.id}:${tab}`, [product.id, tab]);

  const {
    [key]: reviewsFlat, // 평탄화된 리뷰 배열
    page, // 현재 마지막 페이지 index
    maxPage, // 마지막 페이지 index(0-base)
    Load, // 다음 페이지 로드
    isLoading,
  } = useInfiniteData(
    key,
    (index) => ({
      pageSize: PAGE_SIZE,
      pageNumber: index, // 0-based
      relations: "item,item.brand,item.variant.product,user",
      order: { created_at: "DESC" },
    }),
    (cond) => requester.getProductReviews(product.id, cond),
    // 전체 페이지 수 계산
    (res: Pageable) => Number(res?.totalPages ?? 0),
    {
      pause: !ready,
      revalidateOnMount: true,
      onReprocessing: (res: Pageable) => res?.content ?? [],
      fallbackData: [],
    }
  );

  const list =
    tab === "photo"
      ? (reviewsFlat ?? []).filter(
          (r: any) => Array.isArray(r?.images) && r.images.length > 0
        )
      : reviewsFlat ?? [];

  const hasMore = page < (maxPage ?? 0);

  const formatDateDots = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? "-"
      : d.toISOString().slice(0, 10).replaceAll("-", ".");
  };
  const DISPLAY = {
    design: {
      love: "마음에 쏙 들어요.",
      ok: "보통이에요.",
      not_my_style: "내 취향은 아니네요.",
    },
    finish: {
      good: "양품이에요.",
      ok: "보통이에요.",
      poor: "부실해요.",
    },
    maintenance: {
      easy: "쉽게 관리 가능해요.",
      ok: "보통이에요.",
      hard: "관리하기 어려워요.",
    },
  } as const;

  const toDisplayDesign = (v?: string) =>
    (DISPLAY.design as any)[v ?? ""] ?? v ?? "-";
  const toDisplayFinish = (v?: string) =>
    (DISPLAY.finish as any)[v ?? ""] ?? v ?? "-";
  const toDisplayMaintenance = (v?: string) =>
    (DISPLAY.maintenance as any)[v ?? ""] ?? v ?? "-";

  return (
    <VerticalFlex className={styles.review_wrap}>
      <VerticalFlex className={styles.review_top}>
        <FlexChild width={"auto"} gap={10}>
          <Image
            src={"/resources/icons/board/review_start_rating.png"}
            width={30}
          />
          <P className={styles.rating}>{avg}</P>
          <P className={styles.total_rating}>
            총{" "}
            <Span color="#fff" weight={600}>
              {count}
            </Span>
            건 리뷰
          </P>
        </FlexChild>

        <Button
          className={styles.link_btn}
          onClick={() => navigate("/board/photoReview")}
        >
          포토후기 이동
        </Button>
      </VerticalFlex>

      <VerticalFlex className={styles.review_board}>
        {/* 리스트 */}
        <VerticalFlex className={styles.review_list} gap={35}>
          {list?.length > 0 ? (
            list.map((r: any) => (
              <VerticalFlex key={r.id} gap={25} className={styles.item}>
                <VerticalFlex gap={15}>
                  <HorizontalFlex className={styles.item_header} gap={15}>
                    <FlexChild>
                      <StarRate
                        width={110}
                        starWidth={20}
                        starHeight={20}
                        score={r.star_rate}
                        readOnly
                      />
                    </FlexChild>

                    <FlexChild gap={10}>
                      <FlexChild justifyContent="center">
                        <P color="#d7d7d7" size={18}>
                          {maskTwoThirds(r.user.name)}
                        </P>{" "}
                        {/* 닉네임 뒷글자 *** 표시 */}
                      </FlexChild>

                      <FlexChild justifyContent="center">
                        <P color="#797979" size={13}>
                          {formatDateDots(r?.created_at)}
                        </P>
                      </FlexChild>
                    </FlexChild>
                  </HorizontalFlex>

                  <FlexChild hidden>
                    {/* 리뷰 추천 표시 */}
                    <P size={12} color="#797979">
                      {3}명에게 도움이 되었어요.
                    </P>
                  </FlexChild>
                </VerticalFlex>

                <VerticalFlex gap={25}>
                  <VerticalFlex className={styles.feedback} alignItems="start">
                    <FlexChild className={styles.feed_item}>
                      <FlexChild className={styles.feed_title}>
                        <P>외형/디자인</P>
                      </FlexChild>

                      <FlexChild className={styles.feed_content}>
                        <P>{toDisplayDesign(r?.metadata?.aspects?.design)}</P>
                      </FlexChild>
                    </FlexChild>

                    <FlexChild className={styles.feed_item}>
                      <FlexChild className={styles.feed_title}>
                        <P>마감/내구성</P>
                      </FlexChild>

                      <FlexChild className={styles.feed_content}>
                        <P>{toDisplayFinish(r?.metadata?.aspects?.finish)}</P>
                      </FlexChild>
                    </FlexChild>

                    <FlexChild className={styles.feed_item}>
                      <FlexChild className={styles.feed_title}>
                        <P>유지관리</P>
                      </FlexChild>

                      <FlexChild className={styles.feed_content}>
                        <P>
                          {toDisplayMaintenance(
                            r?.metadata?.aspects?.maintenance
                          )}
                        </P>
                      </FlexChild>
                    </FlexChild>
                  </VerticalFlex>

                  <VerticalFlex className={styles.content}>
                    <P size={14} color="#fff" lineHeight={1.4}>
                      {r.content}
                    </P>

                    {r.images.length > 0 && (
                      <FlexChild
                        width={100}
                        height={100}
                        overflow="hidden"
                        className={styles.img_box}
                        cursor="pointer"
                        onClick={() =>
                          NiceModal.show("ImgViewSliderModal", {
                            images: r.images,
                          })
                        }
                        backgroundImage={`url(${r.images[0]})`}
                      >
                        {/* <Image
                            src={r.images[0]}
                            width={"100%"}
                            height={"auto"}
                          /> */}
                        <Div className={styles.img_length}>
                          {r.images.length}
                        </Div>
                      </FlexChild>
                    )}
                  </VerticalFlex>
                </VerticalFlex>

                <RecommendButton reviewId={r.id} />
              </VerticalFlex>
            ))
          ) : (
            <NoContent type={"리뷰"} />
          )}
        </VerticalFlex>

        {hasMore && (
          <FlexChild>
            <Button
              className={styles.review_more_btn}
              disabled={isLoading}
              onClick={() => Load()}
            >
              리뷰 더보기
            </Button>
          </FlexChild>
        )}

        {/* <ListPagination
          page={page}
          maxPage={totalPages}
          onChange={handlePageChange}
        /> */}
      </VerticalFlex>
    </VerticalFlex>
  );
}
