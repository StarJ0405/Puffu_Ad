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
import usePageData from "@/shared/hooks/data/usePageData";
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
  const PAGE_SIZE = 10;
  const ready = !!product?.id;

  const key = useMemo(() => `reviews:${product.id}:${tab}`, [product.id, tab]);

  const {
    [key]: reviewsPage,
    page,
    setPage,
    maxPage,
  } = usePageData(
    key,
    (pageNumber) => ({
      pageSize: PAGE_SIZE,
      pageNumber, // 0-based
      relations: "item,item.brand,item.variant.product,user",
      order: { created_at: "DESC" },
    }),
    (cond) => requester.getProductReviews(product.id, cond),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (res: any) => {
        const reviews = Array.isArray(res) ? res : res?.content ?? [];
        const total =
          (!Array.isArray(res) &&
            (res?.totalElements ?? res?.total ?? res?.meta?.total)) ??
          reviews.length;
        return { reviews, total };
      },
      fallbackData: { reviews: [], total: 0, totalPages: 0 },
      revalidateOnMount: true,
      pause: !ready,
    }
  );

  const listAll = reviewsPage?.reviews ?? [];
  const list =
    tab === "photo"
      ? listAll.filter(
          (r: any) => Array.isArray(r?.images) && r.images.length > 0
        )
      : listAll;

  // ListPagination 바인딩(1-base)
  const page1 = (page ?? 0) + 1;
  const totalPage = Math.max(1, (maxPage ?? 0) + 1);
  const handlePageChange = (n: number) => setPage(n - 1);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

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
      <HorizontalFlex backgroundColor={"#f5f5f5"} padding={"35px 0"} className={styles.review_top}>
        <FlexChild borderRight={"1px solid #d5d5d5"}>
          <VerticalFlex gap={14}>
            <FlexChild width={"fit-content"}>
              <P size={50} weight={600}>{avg}</P>
            </FlexChild>
            <FlexChild width={"fit-content"}>
              <HorizontalFlex gap={6}>
                {Array.from({ length: avg }).map((_, i) => (
                  <FlexChild key={`${key}:avg-star-red-${i}`}>
                    <Image
                      src={"/resources/icons/board/review_rating_star_red.png"}
                      width={28}
                    />
                  </FlexChild>
                ))}
                {Array.from({ length: 5 - avg }).map((_, i) => (
                  <FlexChild key={`${key}:avg-star-black-${i}`}>
                    <Image
                      src={"/resources/icons/board/review_rating_star_black.png"}
                      width={28}
                    />
                  </FlexChild>
                ))}
              </HorizontalFlex>
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
        <FlexChild>
          <VerticalFlex gap={15}>
            <FlexChild width={"fit-content"}>
              <P size={50} weight={600}>{count}</P>
            </FlexChild>
            <FlexChild width={"fit-content"}>
              <P size={24} weight={700}>REVIEWS</P>
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
      </HorizontalFlex>

      <VerticalFlex className={styles.review_board}>
        {/* 리스트 */}
        <VerticalFlex className={styles.review_list} gap={35}>
          {list?.length > 0 ? (
            <div className={styles.items}>
              {list.map((r: any) => (
                <VerticalFlex key={r.id} gap={15} className={styles.item}>
                  <HorizontalFlex className={styles.item_header}>
                    <FlexChild width={"fit-content"}>
                      <HorizontalFlex gap={4}>
                        {Array.from({ length: r.star_rate }).map((_, i) => (
                          <FlexChild key={`${r.id}:rating-star-red-${i}`}>
                            <Image
                              src={"/resources/icons/board/review_rating_star_red.png"}
                              width={20}
                            />
                          </FlexChild>
                        ))}
                        {Array.from({ length: 5 - r.star_rate }).map((_, i) => (
                          <FlexChild key={`${r.id}:rating-star-black-${i}`}>
                            <Image
                              src={"/resources/icons/board/review_rating_star_black.png"}
                              width={20}
                            />
                          </FlexChild>
                        ))}
                        <FlexChild paddingLeft={6}>
                          <P size={19} weight={600}>{r.star_rate}</P>
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>

                    <FlexChild width={"fit-content"}>
                      <HorizontalFlex gap={15}>
                        <FlexChild justifyContent="center" width={"fit-content"}>
                          <P color="#797979" size={16}>
                            {maskTwoThirds(r.user.name)}
                          </P>{" "}
                          {/* 닉네임 뒷글자 *** 표시 */}
                        </FlexChild>
  
                        <FlexChild justifyContent="center" width={"fit-content"}>
                          <P color="#797979" size={16}>
                            {formatDateDots(r?.created_at)}
                          </P>
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    {/* <RecommendButton
                      reviewId={r.id}
                    /> */}
                  </HorizontalFlex>

                  <VerticalFlex gap={25}>
                    <HorizontalFlex className={styles.feedback}>
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
                    </HorizontalFlex>

                    <VerticalFlex className={styles.content}>
                      <P size={16} color="#2F2C2C" lineHeight={1.6}>
                        {r.content}
                      </P>
                      {r.images.length > 0 && (
                        <FlexChild
                          width={180}
                          height={180}
                          overflow="hidden"
                          className={styles.img_box}
                          cursor="pointer"
                          onClick={() =>
                            NiceModal.show("ImgViewSliderModal", {
                              images: r.images,
                              height: "auto",
                            })
                          }
                          backgroundImage={`url(${r.images[0]})`}
                        >
                          <Div className={styles.img_length}>
                            {r.images.length}
                          </Div>

                          <Div className={styles.click_layer}>자세히 보기</Div>
                        </FlexChild>
                      )}

                    </VerticalFlex>
                  </VerticalFlex>
                </VerticalFlex>
              ))}
            </div>
          ) : (
            <FlexChild padding={"30px 0"}>
              <NoContent type={"리뷰"} />
            </FlexChild>
           
          )}
          <FlexChild justifyContent="center" paddingTop={20}>
            <ListPagination
              page={page1}
              maxPage={totalPage}
              onChange={handlePageChange}
            />
          </FlexChild>
        </VerticalFlex>

        {/* <ListPagination /> */}
      </VerticalFlex>
    </VerticalFlex>
  );
}
