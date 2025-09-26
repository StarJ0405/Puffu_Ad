"use client";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import styles from "./page.module.css";
import ListPagination from "@/components/listPagination/ListPagination";
import { requester } from "@/shared/Requester";
import { useState, useCallback, useEffect, useMemo } from "react";
import mypage from "../mypage.module.css";
import useData from "@/shared/hooks/data/useData";
import StarRate from "@/components/star/StarRate";
import clsx from "clsx";
import usePageData from "@/shared/hooks/data/usePageData";
import NiceModal from "@ebay/nice-modal-react";

export function Client() {
  const [total, setTotal] = useState(0);
  return (
    <VerticalFlex
      className={clsx(mypage.box_frame, styles.delivery_box)}
      gap={35}
    >
      <FlexChild className={mypage.box_header}>
        <P>리뷰 관리</P>
        <FlexChild className={mypage.header_subTitle}>
          <P>전체 리뷰 {total.toLocaleString()}</P>
        </FlexChild>
      </FlexChild>

      <ReviewList onTotal={setTotal} />
    </VerticalFlex>
  );
}

export function ReviewList({ onTotal }: { onTotal?: (n: number) => void }) {
  const [rev, setRev] = useState(0);
  const PAGE_SIZE = 10;
  const key = useMemo(() => `my-reviews:${rev}`, [rev]);
  const refresh = () => setRev((v) => v + 1);
  const {
    [key]: pageData,
    page: page0,
    setPage: setPage0,
    maxPage: maxPage0,
  } = usePageData(
    key,
    (pageNumber) => ({
      pageSize: PAGE_SIZE,
      pageNumber, // 0-base
      relations: "item,item.brand,item.variant,item.variant.product,user",
      order: { created_at: "DESC" },
    }),
    (cond) => requester.getReviews(cond),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (res: any) => {
        const content = Array.isArray(res) ? res : res?.content ?? [];
        const total =
          (!Array.isArray(res) &&
            (res?.totalElements ??
              res?.total ??
              res?.meta?.total ??
              res?.meta?.totalElements ??
              (res as any)?.page?.totalElements ??
              (res as any)?.NumberOfTotalElements)) ??
          content.length;
        return { content, total };
      },
      fallbackData: { content: [], total: 0, totalPages: 0 },
      revalidateOnMount: true,
    }
  );

  // ListPagination 1-base
  const page = page0 + 1;
  const maxPage = Math.max(1, (maxPage0 ?? 0) + 1);
  const setPage = (n: number) => setPage0(n - 1);

  // 렌더용 목록
  const list = pageData?.content ?? [];
  const total = Number(pageData?.total ?? 0);

  useEffect(() => {
    onTotal?.(total);
  }, [total, onTotal]);

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
    <>
      {list.length > 0 ? (
        <VerticalFlex className={styles.review_list} gap={35}>
          {list.map((r: any) => (
            <VerticalFlex alignItems="start" gap={10} key={r.id}>
              <FlexChild
                gap={10}
                alignSelf="end"
                width={"auto"}
                className={styles.review_edit}
              >
                <P
                  size={13}
                  color="#ddd"
                  cursor="pointer"
                  onClick={() => {
                    const i = r.item;
                    NiceModal.show("reviewWrite", {
                      review: r,
                      item: {
                        id: i.id,
                        brand_name: i?.brand?.name,
                        product_title: i.product_title,
                        variant_title: i.variant_title,
                        thumbnail: i.thumbnail,
                      },
                      edit: true,
                      withPCButton: true,
                      onSuccess: refresh,
                    });
                  }}
                >
                  수정
                </P>
                <P
                  size={13}
                  color="#ddd"
                  cursor="pointer"
                  onClick={() =>
                    NiceModal.show("confirm", {
                      message: "리뷰를 삭제하시겠습니까?",
                      confirmText: "삭제",
                      cancelText: "취소",
                      width: "324px",
                      withCloseButton: true,
                      onConfirm: async () => {
                        await requester.deleteReview(r?.id, {
                          soft: false,
                        });
                        refresh();
                      },
                    })
                  }
                >
                  삭제
                </P>
              </FlexChild>
              <HorizontalFlex gap={35} className={styles.item}>
                <VerticalFlex className={styles.item_header}>
                  {/* 상품정보 */}
                  <HorizontalFlex className={styles.prodcut_data}>
                    <FlexChild className={styles.img}>
                      <Image src={r.item.thumbnail} width={45} />
                    </FlexChild>

                    <VerticalFlex className={styles.info}>
                      <FlexChild className={styles.title}>
                        <P
                          lineClamp={1}
                          overflow="hidden"
                          display="--webkit-box"
                        >
                          {r.item.product_title}
                        </P>
                      </FlexChild>
                      <FlexChild className={styles.info_rating}>
                        <P>
                          평가 <Span>{r.star_rate}</Span>
                        </P>
                        <P
                          lineClamp={1}
                          overflow="hidden"
                          display="--webkit-box"
                        >
                          리뷰 <Span>{r.length}</Span>
                        </P>
                      </FlexChild>
                    </VerticalFlex>
                  </HorizontalFlex>

                  <VerticalFlex gap={10}>
                    <FlexChild gap={15}>
                      <StarRate
                        width={100}
                        starWidth={20}
                        starHeight={20}
                        score={r.star_rate}
                        readOnly
                      />
                    </FlexChild>

                    <FlexChild>
                      <P color="#797979" size={13}>
                        {r.date}
                      </P>
                    </FlexChild>
                  </VerticalFlex>
                </VerticalFlex>

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

                  <HorizontalFlex className={styles.content}>
                    {r.images.length > 0 && (
                      <FlexChild
                        width={180}
                        className={styles.img_box}
                        cursor="pointer"
                      >
                        <Image
                          src={r.images[0]}
                          width={"100%"}
                          height={"auto"}
                        />
                        <Div className={styles.img_length}>
                          {r.images.length}
                        </Div>
                      </FlexChild>
                    )}

                    {/* 이미지 클릭하면 모달로 이미지 슬라이더 나타나서 크게 보여주기 */}
                    {/* {
                                  review.photos?.length > 0 && (
                                     review.photos?.map((img, j)=> (
                                        <FlexChild key={j} >
                                           <Image src={img} width={'100%'} height={'auto'} />
                                        </FlexChild>
                                     ))
                                  )
                               } */}
                    <P size={14} color="#fff" lineHeight={1.6}>
                      {r.content}
                    </P>
                  </HorizontalFlex>
                </VerticalFlex>
              </HorizontalFlex>
            </VerticalFlex>
          ))}
          <FlexChild>
            <ListPagination page={page} maxPage={maxPage} onChange={setPage} />
          </FlexChild>
        </VerticalFlex>
      ) : (
        <NoContent type="리뷰" />
      )}
    </>
  );
}
