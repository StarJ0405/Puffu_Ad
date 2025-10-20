"use client";
import Button from "@/components/buttons/Button";
import LoadingCard from "@/components/card/LoadingCard";
import ReviewImgCard from "@/components/card/reviewImgCard";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import { requester } from "@/shared/Requester";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import boardStyle from "../../boardGrobal.module.css";
import styles from "./photoReview.module.css";

// 게시판 리스트 -----------------------------------------------
export function BoardTitleBox() {
  return (
    <HorizontalFlex className={boardStyle.board_titleBox}>
      {/* <FlexChild>
        <h3>포토 사용후기</h3>
      </FlexChild> */}

      <HorizontalFlex
        className={boardStyle.board_searchBox}
        marginTop={"unset"}
        hidden
      >
        <FlexChild className={boardStyle.search_box}>
          <Input
            type={"search"}
            // value={q}
            // onChange={(e) => setQ(e as string)}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") {
            //     e.preventDefault();
            //     handleSearch();
            //   }
            // }}
            placeHolder={"검색 내용을 입력해 주세요."}
          ></Input>
          <Button
            className={boardStyle.searchBtn}
            // onClick={handleSearch}
          >
            <Image src="/resources/icons/search_gray.png" width={20} />
          </Button>
        </FlexChild>
      </HorizontalFlex>
    </HorizontalFlex>
  );
}

type ApiReview = {
  id: string;
  images?: string[];
  avg?: number;
  count: number;
  content?: string;
  recommend_count: number;
  created_at?: string;
  star_rate?: number;
  metadata?: {
    source?: string;
    aspects?: { design?: string; finish?: string; maintenance?: string };
  };
  user?: { id?: string; name?: string };
  item?: {
    variant?: {
      product?: {
        id?: string;
        title?: string;
        thumbnail?: string;
        reviews?: { count?: number; avg?: number };
      };
    };
  };
};

export function BestReviewSlider({
  id,
  lineClamp,
}: {
  id: string;
  lineClamp?: number;
}) {
  const PAGE_SIZE = 300; // 랭킹 근사치용 벌크 수집
  const TOP_N = 21; // 슬라이드 상단 노출 개수
  const [rows, setRows] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBulk = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        pageSize: PAGE_SIZE,
        pageNumber: 0,
        photo: true,
        relations: "item.variant.product,user",
        order: { index: "ASC", idx: "DESC" },
        best: true,
      };
      const res = await requester.getPublicReviews(params);
      const data = res?.data ?? res;
      setRows(data?.content ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBulk();
  }, [fetchBulk]);

  type ProductLite = { id: string; title?: string; thumbnail?: string };

  const ranked: ApiReview[] = useMemo(() => {
    const map = new Map<
      string,
      { product: ProductLite; reviews: ApiReview[]; sum: number }
    >();

    for (const r of rows) {
      const p = r.item?.variant?.product;
      if (!p?.id) continue;
      if (!r.images?.length) continue; // 포토만
      const star = Number(r.star_rate ?? 0);

      if (!map.has(p.id)) {
        map.set(p.id, {
          product: { id: p.id, title: p.title, thumbnail: p.thumbnail },
          reviews: [r],
          sum: star,
        });
      } else {
        const g = map.get(p.id)!;
        g.reviews.push(r);
        g.sum += star;
      }
    }

    const enriched: ApiReview[] = [];
    for (const [, g] of map) {
      const count = g.reviews.length;
      const avg = count ? g.sum / count : 0;

      g.reviews.sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
      );
      const rep = { ...g.reviews[0] };

      const injected = {
        ...rep,
        item: {
          ...rep.item,
          variant: {
            ...rep.item?.variant,
            product: {
              ...(rep.item?.variant?.product ?? {}),
              reviews: { count, avg },
            },
          },
        },
      } as ApiReview;

      enriched.push(injected);
    }

    enriched.sort((a, b) => {
      const ac = a.item?.variant?.product?.reviews?.count ?? 0;
      const bc = b.item?.variant?.product?.reviews?.count ?? 0;
      if (bc !== ac) return bc - ac;
      const aa = a.item?.variant?.product?.reviews?.avg ?? 0;
      const ba = b.item?.variant?.product?.reviews?.avg ?? 0;
      return ba - aa;
    });

    return enriched.slice(0, TOP_N);
  }, [rows]);

  return (
    <VerticalFlex className={styles.best_review_box} hidden={rows.length === 0}>
      <FlexChild className={styles.title}>
        <P className="SacheonFont">사용후기 베스트</P>
      </FlexChild>

      <FlexChild className={styles.slide_body}>
        {ranked.length > 0 && (
          <FlexChild id={id} className={styles.BestSlider}>
            <Swiper
              // loop={true}
              slidesPerView={1.6}
              speed={600}
              spaceBetween={20}
              modules={[Autoplay, Navigation]}
              autoplay={{ delay: 40000 }}
              navigation={{
                prevEl: `#${id} .${styles.prevBtn}`,
                nextEl: `#${id} .${styles.nextBtn}`,
              }}
              breakpoints={{
                580: {
                  slidesPerView: 2,
                },
                680: {
                  slidesPerView: 3,
                },
                768: {
                  slidesPerView: 4,
                },

                1080: {
                  slidesPerView: 4,
                },
              }}
            >
              {ranked.map((review, i) => {
                return (
                  <SwiperSlide key={i}>
                    <ReviewImgCard
                      review={review}
                      width={"100%"}
                      height={"auto"}
                      board="photoReviewSlide"
                      slide={true}
                      lineClamp={lineClamp ?? 2}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
            {
              // 슬라이드옵션들 props로 빼버리고 그 값 따라서 조건문 걸기
            }
            {/* <div className={clsx(styles.naviBtn, styles.prevBtn)}>
            <Image
              src={"/resources/icons/arrow/slide_arrow.png"}
              width={10}
            ></Image>
          </div>
          <div className={clsx(styles.naviBtn, styles.nextBtn)}>
            <Image
              src={"/resources/icons/arrow/slide_arrow.png"}
              width={10}
            ></Image>
          </div> */}
          </FlexChild>
        )}
      </FlexChild>
    </VerticalFlex>
  );
}

type ReviewEntity = {
  id: string;
  images?: string[];
  content?: string;
  avg?: number;
  count: number;
  created_at?: string;
  star_rate?: number;
  recommend_count: number;
  metadata?: {
    source?: string;
    aspects?: { design?: string; finish?: string; maintenance?: string };
  };
  user?: { id?: string; name?: string };
  item?: {
    id?: string;
    variant?: {
      id?: string;
      product?: { id?: string; title?: string; thumbnail?: string };
    };
  };
};
export function GalleryTable() {
  const PAGE_SIZE = 10;
  const [items, setItems] = useState<ReviewEntity[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(async (pn: number) => {
    setLoading(true);
    try {
      const params: any = {
        pageSize: PAGE_SIZE,
        pageNumber: pn,
        photo: true,
        relations: "item,item.variant.product,user",
        order: { created_at: "DESC" },
      };
      const res = await requester.getPublicReviews(params);
      const data = res?.data ?? res;
      const list: ReviewEntity[] = data?.content ?? [];

      setItems((prev) => (pn === 0 ? list : prev.concat(list)));
      if (typeof data?.totalPages === "number") {
        setTotalPages(data.totalPages);
        setHasMore(pn + 1 < data.totalPages);
      } else {
        setTotalPages(null);
        setHasMore(list.length === PAGE_SIZE);
      }
      setPageNumber(pn);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(0);
  }, [fetchPage]);

  return (
    <VerticalFlex>
      <FlexChild>
        {items.length > 0 || loading ? (
          <MasonryGrid
            gap={20}
            breakpoints={{ default: 3, 768: 3, 650: 2, 550: 1 }}
            width={"100%"}
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <LoadingCard key={i} />)
              : items.map((item, i) => {
                  return (
                    <ReviewImgCard
                      key={item.id ?? i}
                      review={item}
                      width={"100%"}
                      height={"auto"}
                      borderRadius={10}
                    />
                  );
                })}
          </MasonryGrid>
        ) : (
          <NoContent type="리뷰" />
        )}
      </FlexChild>

      {!loading && hasMore && (
        <FlexChild justifyContent="center" marginTop={30}>
          <Button
            className={styles.more_btn}
            disabled={loading}
            onClick={() => !loading && fetchPage(pageNumber + 1)}
          >
            리뷰 더보기
          </Button>
        </FlexChild>
      )}
    </VerticalFlex>
  );
}

// 게시판 리스트 end -----------------------------------------------
