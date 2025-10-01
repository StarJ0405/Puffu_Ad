"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import ListPagination from "@/components/listPagination/ListPagination";
import NoContent from "@/components/noContent/noContent";
import Select from "@/components/select/Select";
import ReviewImgCard from "@/components/card/reviewImgCard";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import Link from "next/link";
import boardStyle from "../../boardGrobal.module.css";
import styles from "./photoReview.module.css";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import { useEffect, useState, useCallback, useMemo } from "react";
import { requester } from "@/shared/Requester";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
// 게시판 리스트 -----------------------------------------------
export function BoardTitleBox() {
  return (
    <HorizontalFlex className={boardStyle.board_titleBox}>
      <FlexChild justifyContent="center">
        {/* 여기 현재 path 주소에 맞게 이름 바뀌게 해야 함. */}
        <h3>포토 사용후기</h3>
      </FlexChild>

      <FlexChild gap={10} className={boardStyle.search_box} hidden>
        <FlexChild width={"auto"}>
          <Select
            classNames={{
              header: "web_select",
              placeholder: "web_select_placholder",
              line: "web_select_line",
              arrow: "web_select_arrow",
              search: "web_select_search",
            }}
            width={100}
            options={[
              { value: "제목", display: "제목" },
              { value: "내용", display: "내용" },
              { value: "작성자", display: "작성자" },
            ]}
            // placeholder={'선택 안함'}
            // value={selectedMessageOption}
          />
        </FlexChild>

        <Input
          type={"search"}
          placeHolder={"검색 내용을 입력해 주세요."}
        ></Input>
        <Link href={"/board/notice/noticeWrite"}>
          <Button className={boardStyle.searchBtn}>검색</Button>
        </Link>
      </FlexChild>
    </HorizontalFlex>
  );
}

type ApiReview = {
  id: string;
  images?: string[];
  avg?: number;
  count: number;
  content?: string;
  created_at?: string;
  star_rate?: number;
  recommend_count: number;
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
  const slideMax = 7; // 처음 보일 슬라이드 개수
  const [rows, setRows] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchBulk = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        pageSize: PAGE_SIZE,
        pageNumber: 0,
        photo: true,
        relations: "item,item.variant.product,user",
        order: { created_at: "DESC" },
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
  
  useEffect(() => {
    const onChanged = (e: any) => {
      const { id, delta } = e?.detail ?? {};
      if (!id || !delta) return;
      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                recommend_count: Number(r.recommend_count ?? 0) + Number(delta),
              }
            : r
        )
      );
    };
    window.addEventListener(
      "review:recommend-changed",
      onChanged as EventListener
    );
    return () =>
      window.removeEventListener(
        "review:recommend-changed",
        onChanged as EventListener
      );
  }, []);

  const ranked: ApiReview[] = useMemo(() => {
    return [...rows]
      .filter((r) => (r.images?.length ?? 0) > 0)
      .sort((a, b) => {
        const cb = Number(b.recommend_count ?? 0);
        const ca = Number(a.recommend_count ?? 0);
        if (cb !== ca) return cb - ca;
        const tb = new Date(b.created_at ?? 0).getTime();
        const ta = new Date(a.created_at ?? 0).getTime();
        return tb - ta;
        // return ta - tb; 
      })
      .slice(0, TOP_N);
  }, [rows]);

  if (!loading && ranked.length === 0) {
    return <NoContent type="리뷰" />;
  }

  return (
    <>
      <FlexChild id={id} className={styles.ProductSlider}>
        <Swiper
          loop={true}
          slidesPerView={slideMax}
          speed={600}
          spaceBetween={20}
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 4000 }}
          navigation={{
            prevEl: `#${id} .${styles.prevBtn}`,
            nextEl: `#${id} .${styles.nextBtn}`,
          }}
        >
          {ranked.map((review) => {
            return (
              <SwiperSlide key={review.id}>
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
        {ranked.length > slideMax && (
          <>
            <div className={clsx(styles.naviBtn, styles.prevBtn)}>
              <Image
                src={"/resources/icons/arrow/slide_arrow.png"}
                width={10}
              />
            </div>
            <div className={clsx(styles.naviBtn, styles.nextBtn)}>
              <Image
                src={"/resources/icons/arrow/slide_arrow.png"}
                width={10}
              />
            </div>
          </>
        )}
      </FlexChild>
    </>
  );
}

type ReviewEntity = {
  id: string;
  images?: string[];
  content?: string;
  avg?: number;
  count: number;
  recommend_count: number;
  created_at?: string;
  star_rate?: number;
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
        {items.length > 0 ? (
          <MasonryGrid breakpoints={5} width={"100%"}>
            {items.map((item, i) => {
              return (
                <ReviewImgCard
                  key={item.id ?? i}
                  review={item}
                  width={"100%"}
                  height={"auto"}
                  borderRadius={5}
                />
              );
            })}
          </MasonryGrid>
        ) : (
          !loading && <NoContent type="리뷰" />
        )}
      </FlexChild>

      {hasMore && (
        <FlexChild justifyContent="center" marginTop={30}>
          <Button
            className={styles.more_btn}
            disabled={loading}
            onClick={() => !loading && fetchPage(pageNumber + 1)}
          >
            {loading ? "로딩중" : "더보기"}
          </Button>
        </FlexChild>
      )}
    </VerticalFlex>
  );
}

// 게시판 리스트 end -----------------------------------------------
