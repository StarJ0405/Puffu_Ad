"use client";
import ProductCard from "@/components/card/ProductCard";
import ReviewImgCard from "@/components/card/reviewImgCard";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import Span from "@/components/span/Span";
import clsx from "clsx";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

import ProductLoadBtn from "@/components/buttons/ProductLoadBtn";
import LoadingCard from "@/components/card/LoadingCard";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import useData from "@/shared/hooks/data/useData";
import useInfiniteData from "@/shared/hooks/data/useInfiniteData";
import { requester } from "@/shared/Requester";
import { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";





export function MainBanner({ initBanners }: { initBanners: Pageable }) {
  const { userData } = useAuth();
  const { banners } = useData(
    "banners",
    {},
    (condition) => requester.getBanners(condition),
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initBanners,
    }
  );

  const swiperRef = useRef<SwiperType | null>(null);

  

  const paintBullets = (swiper: SwiperType) => {
    // 페이지네이션 스타일 설정
    const bullets = swiper.pagination?.el?.querySelectorAll(
      ".swiper-pagination-bullet"
    );
    if (!bullets) return;

    bullets.forEach((el) => {
      const bullet = el as HTMLElement;
      bullet.style.setProperty("background-color", "#000", "important");
      bullet.style.setProperty("opacity", "0.3", "important");
      bullet.style.setProperty("transform", "scale(1)");
      bullet.style.setProperty("margin", "0 4px", "important");
      bullet.style.setProperty("left", "0", "important");
      bullet.style.setProperty("top", "2px", "important");
    });

    const active = swiper.pagination?.el?.querySelector(
      ".swiper-pagination-bullet-active"
    ) as HTMLElement | null;
    if (active) {
      active.style.setProperty("opacity", "1", "important");
      active.style.setProperty("background-color", "#fff", "important");
      active.style.setProperty("transform", "scale(1.66)");
    }
  };

  return (
    <FlexChild className={clsx('mob_page_container', styles.main_banner)}>
      <Swiper
        loop={true}
        slidesPerView={1}
        speed={600}
        spaceBetween={0}
        modules={[Pagination, Autoplay]}
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        autoplay={{ delay: 4000 }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onAfterInit={(swiper) => {
          // Pagination DOM이 생성된 뒤
          paintBullets(swiper);
        }}
        onSlideChange={(swiper) => {
          // active bullet이 바뀔 때마다
          paintBullets(swiper);
        }}
        onPaginationUpdate={(swiper) => {
          // dynamicBullets로 bullet 구성이 바뀌는 경우
          paintBullets(swiper);
        }}
      >
        {[...banners]?.map((item: BannerData, i: number) => (
            item.thumbnail.mobile && (
              <SwiperSlide key={i} className={`swiper_0${i}`}>
                {item.to ? (
                  <Link href={item.to}>
                    <Image
                      src={
                        userData?.adult
                          ? item.thumbnail.mobile
                          : "/resources/images/19_only_banner_mobile.png"
                      }
                      width={"100%"}
                    />
                  </Link>
                ) : (
                  <Image
                    src={
                      userData?.adult
                        ? item.thumbnail.mobile
                        : "/resources/images/19_only_banner_mobile.png"
                    }
                    width={"100%"}
                  />
                )}
              </SwiperSlide>
            )
        ))}
      </Swiper>
    </FlexChild>
  );
}

export function LinkBanner() {
  const link_banner = [
    { link: "/", src: "/resources/images/dummy_img/link_banner_01.png" },
    { link: "/", src: "/resources/images/dummy_img/link_banner_02.png" },
    { link: "/", src: "/resources/images/dummy_img/link_banner_03.png" },
    { link: "/", src: "/resources/images/dummy_img/link_banner_04.png" },
  ];

  const { userData } = useAuth();

  return (
    <VerticalFlex className={styles.link_Banner}>
      {link_banner.map((item, i) => (
        <Link href={item.link} key={i} className={styles.disabled}>
          {userData?.adult ? (
            <Image src={item.src} width={"100%"} height={"auto"} />
          ) : (
            // 성인인증 안될때 나오는 이미지
            <Image
              src={"/resources/images/19_only_sub_banner_mobile.png"}
              width={"100%"}
              height={"auto"}
            />
          )}
        </Link>
      ))}
    </VerticalFlex>
  );
}

export function SubBanner1() {
  const { userData } = useAuth();

  return (
    <FlexChild width={"100%"} className={styles.sub_banner}>
      <Link href={"/"} className={styles.disabled}>
        {userData?.adult ? (
          <Image
            src={"/resources/images/dummy_img/mob_sub_banner_01.jpg"}
            width={"100%"}
            height={"auto"}
          />
        ) : (
          // 성인인증 안될때 나오는 이미지
          <Image
            src={"/resources/images/19_only_sub_banner_mobile.png"}
            width={"100%"}
            height={"auto"}
          />
        )}
      </Link>
    </FlexChild>
  );
}

export function SubBanner2() {
  const { userData } = useAuth();

  return (
    <FlexChild width={"100%"} className={styles.sub_banner}>
      <Link href={"/"} className={styles.disabled}>
        {userData?.adult ? (
          <Image
            src={"/resources/images/dummy_img/mob_sub_banner_02.jpg"}
            width={"100%"}
            height={"auto"}
          />
        ) : (
          // 성인인증 안될때 나오는 이미지
          <Image
            src={"/resources/images/19_only_sub_banner_mobile.png"}
            width={"100%"}
            height={"auto"}
          />
        )}
      </Link>
    </FlexChild>
  );
}

export function MiniBanner() {
  const link_banner = [
    { link: "/", src: "/resources/images/dummy_img/mini_banner_01.png" },
    { link: "/", src: "/resources/images/dummy_img/mini_banner_02.png" },
    { link: "/", src: "/resources/images/dummy_img/mini_banner_03.png" },
    { link: "/", src: "/resources/images/dummy_img/mini_banner_04.png" },
  ];

  return (
    <FlexChild width={"auto"}>
      <div className={styles.mini_Banner}>
        {link_banner.map((item, i) => (
          <Link
            href={item.link}
            key={i}
            className={clsx(item.link?.length <= 1 ? styles.disabled : "")}
          >
            <Image src={item.src} width={"100%"} height={"auto"} />
          </Link>
        ))}
      </div>
    </FlexChild>
  );
}

export function MainCategory() {
  // 카테고리메뉴

  const { categoriesData } = useCategories();

  return (
    <nav className={styles.category_wrap}>
      {categoriesData
        .sort((c1, c2) => c1.index - c2.index)
        .map((cat, i) => (
          <VerticalFlex className={styles.ca_item} key={i}>
            <Link href={`/categories/${cat.id}`}>
              <FlexChild className={styles.ca_thumb}>
                <Image src={cat.thumbnail} width={"auto"} height={66} />
              </FlexChild>
            </Link>
            <Span>{cat.name}</Span>
          </VerticalFlex>
        ))}
    </nav>
  );
}

// 이 달의 핫딜
export function HotDealWrapper({
  id,
  lineClamp,
  initProducts,
  initCondition,
}: {
  id: string;
  lineClamp?: number;
  initProducts: Pageable;
  initCondition: any;
}) {
  const {
    [id]: products,
    Load,
    page,
    maxPage,
  } = useInfiniteData(
    id,
    (pageNumber) => ({
      ...initCondition,
      pageSize: 6,
      pageNumber,
    }),
    (condition) => requester.getProducts(condition),
    (data) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: [initProducts],
    }
  );

  const [loading, setLoading] = useState(false);

  // const showMore = () => {
  //   Load(); // 서버에서도 다음 페이지 로드
  // };

  return (
    <FlexChild hidden={!products || products?.length === 0} marginBottom={20}>
      <VerticalFlex>
        <HorizontalFlex
          className={clsx(styles.titleBox, styles.titleBox1)}
          alignItems="end"
          gap={20}
        >
          <div className={styles.title}>
            <h2 className="SacheonFont">
              <Image
                src="/resources/images/header/HotDeal_icon.png"
                width={15}
                height={"auto"}
              />
              이 달의 <Span color={"#FF4A4D"}>HOT</Span>딜
            </h2>
            <P width={"auto"}>매달 갱신되는 Hot Deal 상품!</P>
          </div>
          <FlexChild width={"auto"}>
            <Link className={styles.linkBtn} href={"/products/hot"}>
              더보기
            </Link>
          </FlexChild>
        </HorizontalFlex>
        {/* 메인, 상세 리스트 */}
        <ProductList
          id="discount"
          products={products}
          Load={Load}
          hidden={maxPage < 1 || page >= maxPage}
          maxPage={maxPage}
          page={page}
          // loading={loading}
        />
        {/* <>
          {products.length > 0 ? (
            <>
              <VerticalFlex gap={10}>
                <MasonryGrid gap={20} width={"100%"}>
                  {products.map((product: ProductData, i: number) => {
                    return (
                      <ProductCard
                        key={i}
                        product={product}
                        lineClamp={2}
                        width={200}
                      />
                    );
                  })}
                </MasonryGrid>
                {loading && <LoadingSpinner />}
                <ProductLoadBtn maxPage={maxPage} page={page} loading={loading} showMore={showMore} />
              </VerticalFlex>
            </>
          ) : (
            <NoContent type="상품" />
          )}
        </> */}
      </VerticalFlex>
    </FlexChild>
  );
}

// 베스트 상품
export function BestProducts({ initProducts, initCondition }: { initProducts: Pageable, initCondition: any; }) {
  const { bestProducts, Load, maxPage, page } = useInfiniteData(
    "bestProducts",
    (pageNumber) => ({
      ...initCondition,
      pageSize: 30,
      pageNumber,
    }),
    (condition) => requester.getProducts(condition),
    (data) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: [initProducts],
    }
  );

  const [loading, setLoading] = useState(false);

  return (
    <FlexChild marginBottom={20}>
      <VerticalFlex>
        <HorizontalFlex className={styles.titleBox} alignItems="end" gap={20}>
          <div className={styles.title}>
            <Image src={'/resources/images/header/logo.png'} width={50} />
            <h2 className="SacheonFont">
              <Span position="relative" top={3}>BEST</Span> 상품
            </h2>
          </div>

          <FlexChild width={"auto"}>
            <Link className={styles.linkBtn} href={"/products/new"}>
              더보기
            </Link>
          </FlexChild>
        </HorizontalFlex>
        <ProductList
          id="best"
          products={bestProducts}
          Load={Load}
          hidden={maxPage < 1 || page >= maxPage}
          maxPage={maxPage}
          page={page}
          // loading={loading}
        />
      </VerticalFlex>
    </FlexChild>
  );
}


export function ProductList({
  id,
  lineClamp,
  products,
  Load,
  hidden,
  maxPage,
  page,
  // loading,
}: {
  id: string;
  lineClamp?: number;
  products: ProductData[];
  Load: () => void;
  hidden?: boolean;
  maxPage: number;
  page: number;
  // loading: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(6);

  const [loading, setLoading] = useState(false);

  // const showMore = async () => {
  //   if (loading) return;
  //   setLoading(true);
  //   try {
  //     await showMore2(); // 데이터 로드
      
  //   } finally {
  //     setLoading(false); // 끝나면 로딩 해제
  //   }
  // }

  const showMore = () => {
    setVisibleCount((prev) => prev + 6); // 12개씩 늘려서 보여주기
    Load(); // 서버에서도 다음 페이지 로드
  };

  return (
    <>
      {products.length > 0 ? (
        <VerticalFlex gap={10}>
          <MasonryGrid gap={15} width={"100%"}>
            {products.slice(0, visibleCount).map((product: ProductData, i) => {
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  lineClamp={2}
                  width={"auto"}
                />
              );
            })}
          </MasonryGrid>
          {loading && <LoadingSpinner />}
          <ProductLoadBtn maxPage={maxPage} page={page} loading={loading} showMore={showMore} />
        </VerticalFlex>
      ) : (
        <NoContent type="상품" />
      )}
    </>
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

export function ProductSlider({
  id,
  lineClamp,
}: {
  id: string;
  lineClamp?: number;
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
    <>
      {(items.length > 0 || loading) ? (
        <FlexChild id={id} className={styles.ProductSlider}>
          <Swiper
            loop={false}
            slidesPerView={1.5}
            speed={600}
            spaceBetween={15}
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 4000 }}
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
                        width="100%"
                        height="auto"
                      />
                    </SwiperSlide>
            ))}
          </Swiper>
        </FlexChild>
      ) : (
        <NoContent type="리뷰" />
      )}
    </>
  );
}
