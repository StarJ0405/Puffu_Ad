"use client";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import { BaseProductList } from "../../baseClient";
import { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useEffect, useRef, useState } from "react";
import VerticalFlex from "@/components/flex/VerticalFlex";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import FlexChild from "@/components/flex/FlexChild";
import Link from "next/link";
import P from "@/components/P/P";
import LoadingCard from "@/components/card/LoadingCard";
import ReviewImgCard from "@/components/card/reviewImgCard";
import Image from "@/components/Image/Image";
import NoContent from "@/components/noContent/noContent";
import clsx from "clsx";
import styles from './page.module.css'
import siteInfo from "@/shared/siteInfo";
import Select from "@/components/select/Select";
import Pstyles from "../../products.module.css"
import useNavigate from "@/shared/hooks/useNavigate";

function findCategoryById(categories: any[], id: string): any | undefined {
  for (const cat of categories) {
    if (cat.id === id) {
      return cat;
    }
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryById(cat.children, id);
      if (found) return found;
    }
  }
  return undefined;
}


// export function CategoryFilter({ category_id }: { category_id: any }) {
//   const { categoriesData } = useCategories();
//   const category = findCategoryById(categoriesData, category_id);

//   return (
//     <>
//       <ProdcutCategory />
//       <ChildCategory
//         categoryId={category_id}
//         childrenData={category?.children || []}
//         parent={category}
//       />
//     </>
//   );
// }




type ReviewEntity = {
  id: string;
  images?: string[];
  content?: string;
  avg?: number;
  count: number;
  created_at?: string;
  star_rate?: number;
  metadata?: {
    source?: string;
    aspects?: { design?: string; finish?: string; maintenance?: string };
  };
  recommend_count: number;
  user?: { id?: string; name?: string };
  item?: {
    id?: string;
    variant?: {
      id?: string;
      product?: { id?: string; title?: string; thumbnail?: string };
    };
  };
};

type CategoryTabProps = {
  category_id: string;
  onChange?: (id: string) => void;
};

export function CategoryTab({ category_id, onChange }: CategoryTabProps) {
  const { categoriesData } = useCategories();
  const navigate = useNavigate();

  const current = findCategoryById(categoriesData, category_id);
  if (!current) return null;

  let secondCategories: any[] = [];

  if (!current.parent_id) {
    secondCategories = current.children ?? [];
  } else {

    const parent = findCategoryById(categoriesData, current.parent_id);
    secondCategories = parent?.children ?? [];
  }

  if (!secondCategories.length) return null;

  return (
    <HorizontalFlex gap={10} className={styles.categoryTabs}>
      {secondCategories.map((cat) => (
        <FlexChild
          key={cat.id}
          className={clsx(
            styles.categoryTab,
            cat.id === category_id && styles.active
          )}
          onClick={() =>
            navigate(`/products/showcase?category_id=${cat.id}`)
          }
        >
          {cat.name}
        </FlexChild>
      ))}
    </HorizontalFlex>
  );
}






export function ReviewSection({
  // id,
  lineClamp,
  category_id
}: {
  // id: string;
  lineClamp?: number;
  category_id?: string

}) {
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
      if (category_id) {
        params.category_id = category_id;
      }
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

  const prevRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);

  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      const navigation = swiperInstance.params.navigation;

      // Swiper 인스턴스의 네비게이션 요소를 명시적으로 업데이트
      if (navigation && typeof navigation !== 'boolean') {
        navigation.prevEl = prevRef.current;
        navigation.nextEl = nextRef.current;
      } else {
        // navigation 이 없거나 boolean인 경우 새로 세팅
        swiperInstance.params.navigation = {
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        } as any; // 필요하면 NavigationOptions 타입으로 캐스팅
      }

      // 네비게이션을 업데이트(초기화)합니다.
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  return (
    <>
      <VerticalFlex className={styles.titleBox} gap={20} alignItems="start">
        <HorizontalFlex alignItems="end" gap={20}>
          <div className={styles.title}>
            <h2 className="Wanted">
              BEST
              <small>리뷰</small>
            </h2>
          </div>

          <FlexChild width={"auto"}>
            <Link className={styles.linkBtn} href={siteInfo.bo_review}>
              자세히 보기 <b>+</b>
            </Link>
          </FlexChild>
        </HorizontalFlex>

        <P className={styles.text1}>
          베스트 리뷰에 선정되면  <br />
          30% 할인쿠폰 증정!
        </P>
      </VerticalFlex>

      {items.length > 0 || loading ? (
        <FlexChild id={styles.review_slider} className={styles.ProductSlider}>
          <Swiper
            loop={false}
            slidesPerView={1.4}
            speed={600}
            spaceBetween={15}
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 4000 }}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current
            }}
            breakpoints={{
              580: {
                slidesPerView: 2.5,
              },
              680: {
                slidesPerView: 3.5,
              },
              768: {
                slidesPerView: 3.5,
              },

              1080: {
                slidesPerView: 3.5,
              },
            }}
          >
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                <SwiperSlide key={`skeleton-${i}`}>
                  <LoadingCard />
                </SwiperSlide>
              ))
              : [...items]
                .sort(() => Math.random() - 0.5)
                .map((item, i) => (
                  <SwiperSlide key={item.id ?? i}>
                    <ReviewImgCard
                      review={item}
                      lineClamp={lineClamp ?? 2}
                      type={'slide'}
                      width="100%"
                      height="auto"
                    />
                  </SwiperSlide>
                ))}
          </Swiper>

          <div ref={prevRef} className={clsx(styles.naviBtn, styles.prevBtn)}>
            <Image
              src={"/resources/icons/arrow/slide_arrow.png"}
              width={8}
            ></Image>
          </div>
          <div ref={nextRef} className={clsx(styles.naviBtn, styles.nextBtn)}>
            <Image
              src={"/resources/icons/arrow/slide_arrow.png"}
              width={8}
            ></Image>
          </div>
        </FlexChild>
      ) : (
        <NoContent type="리뷰" />
      )}
    </>
  );
}


export function BestList({
  initProducts,
  initConiditon,
}: {
  initProducts: Pageable;
  initConiditon: any;
}) {
  const sortOptions = [
    { id: "latest", display: "최신순" },
    { id: "best", display: "인기순" },
    { id: "recommend", display: "추천순" },
  ] as const;

  const [sort, setSort] = useState<(typeof sortOptions)[number]>(
    sortOptions[0]
  );


  const getOrderParam = (id: string | undefined) => {
    switch (id) {
      case "best":
        return "best";
      case "recommend":
        return "recommend";
      case "latest":
      default:
        return undefined;
    }
  };

  const {
    products = [],
    maxPage,
    page,
    setPage,
    mutate,
    origin = {} as any,
  } = usePageData(
    "products",
    (pageNumber) => {
      const order = getOrderParam(sort.id);
      return {
        ...initConiditon,
        pageSize: 24,
        pageNumber,
        ...(order && { order }),
      };
    },
    (condition) => requester.getProducts(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initProducts,
    }
  );

  return (
    <>
      <HorizontalFlex className={Pstyles.sort_group}>
        <FlexChild className={Pstyles.count_txt}>
          <P>
            <b>{origin.NumberOfTotalElements || 0}</b>개의 상품
          </P>
        </FlexChild>
        <FlexChild width="auto">
          <Select
            options={sortOptions.map((opt) => ({
              value: opt.id,
              display: opt.display,
            }))}
            value={sort.id}
            onChange={(v) => {
              if (!v) return;
              const next = sortOptions.find((o) => o.id === v);
              if (!next) return;
              setPage(0);
              setSort(next);
            }}
            width={"120px"}
            height={"36px"}
          />
        </FlexChild>
      </HorizontalFlex>

      <BaseProductList
        pageSize={origin.pageSize}
        mutate={mutate}
        total={origin.NumberOfTotalElements || 0}
        listArray={products}
        pagination={{ page, maxPage, setPage }}
      />
    </>
  );
}

