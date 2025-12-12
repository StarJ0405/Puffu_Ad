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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";
import useNavigate from "@/shared/hooks/useNavigate";

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
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import Div from "@/components/div/Div";
import { usePathname } from "next/navigation";
import siteInfo from "@/shared/siteInfo";
import usePageData from "@/shared/hooks/data/usePageData";
import { EventCard } from "@/components/card/EventCard";

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

  const [bulletIdx, setbulltIdx] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const navigate = useNavigate();

  // 베너 링크값 없으면 링크 없애는 코드
  const linkCheck = (link: string | undefined) => {
    if (link) {
      navigate(`${link}`);
    } else {
      navigate("");
    }
  };

  return (
    <FlexChild className={clsx("mob_page_container", styles.main_banner)}>
      <Swiper
        loop={true}
        slidesPerView={1}
        speed={600}
        spaceBetween={10}
        modules={[Autoplay]}
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        autoplay={{ delay: 4000 }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(e) => setbulltIdx(e.realIndex)}
      >
        {[...banners]?.map(
          (item: BannerData, i: number) =>
            item.thumbnail.mobile && (
              <SwiperSlide
                key={i}
                className={clsx(styles.slideItem, `swiper_0${i}`)}
              >
                <div
                  onClick={() => linkCheck(item.to)}
                  className={styles.thumbnail}
                  style={{
                    backgroundImage: userData?.adult
                      ? `url(${item.thumbnail.mobile})`
                      : "url(/resources/images/19_only_banner_mobile.png)",
                  }}
                />
              </SwiperSlide>
            )
        )}
      </Swiper>

      <div className={styles.pagination}>
        {[...banners]?.map((_, i) => (
          <span
            key={i}
            className={clsx(
              styles.bullet,
              bulletIdx === i ? styles.active : ""
            )}
            onClick={() => swiperRef.current?.slideToLoop(i)}
          ></span>
        ))}
      </div>
    </FlexChild>
  );
}

// export function LinkBanner() {
//   const link_banner = [
//     { link: "/", src: "/resources/images/dummy_img/link_banner_01.png" },
//     { link: "/", src: "/resources/images/dummy_img/link_banner_02.png" },
//     { link: "/", src: "/resources/images/dummy_img/link_banner_03.png" },
//     { link: "/", src: "/resources/images/dummy_img/link_banner_04.png" },
//   ];

//   const { userData } = useAuth();

//   return (
//     <VerticalFlex className={styles.link_Banner}>
//       {link_banner.map((item, i) => (
//         <Link href={item.link} key={i} className={styles.disabled}>
//           {userData?.adult ? (
//             <Image src={item.src} width={"100%"} height={"auto"} />
//           ) : (
//             // 성인인증 안될때 나오는 이미지
//             <Image
//               src={"/resources/images/19_only_sub_banner_mobile.png"}
//               width={"100%"}
//               height={"auto"}
//             />
//           )}
//         </Link>
//       ))}
//     </VerticalFlex>
//   );
// }

// export function SubBanner1() {
//   const { userData } = useAuth();

//   return (
//     <FlexChild width={"100%"} className={styles.sub_banner}>
//       <Link href={"/"} className={styles.disabled}>
//         {userData?.adult ? (
//           <Image
//             src={"/resources/images/dummy_img/mob_sub_banner_01.jpg"}
//             width={"100%"}
//             height={"auto"}
//           />
//         ) : (
//           // 성인인증 안될때 나오는 이미지
//           <Image
//             src={"/resources/images/19_only_sub_banner_mobile.png"}
//             width={"100%"}
//             height={"auto"}
//           />
//         )}
//       </Link>
//     </FlexChild>
//   );
// }

// export function SubBanner2() {
//   const { userData } = useAuth();

//   return (
//     <FlexChild width={"100%"} className={styles.sub_banner}>
//       <Link href={"/"} className={styles.disabled}>
//         {userData?.adult ? (
//           <Image
//             src={"/resources/images/dummy_img/mob_sub_banner_02.jpg"}
//             width={"100%"}
//             height={"auto"}
//           />
//         ) : (
//           // 성인인증 안될때 나오는 이미지
//           <Image
//             src={"/resources/images/19_only_sub_banner_mobile.png"}
//             width={"100%"}
//             height={"auto"}
//           />
//         )}
//       </Link>
//     </FlexChild>
//   );
// }

// export function MiniBanner() {
//   const link_banner = [
//     { link: "/", src: "/resources/images/dummy_img/mini_banner_01.png" },
//     { link: "/", src: "/resources/images/dummy_img/mini_banner_02.png" },
//     { link: "/", src: "/resources/images/dummy_img/mini_banner_03.png" },
//     { link: "/", src: "/resources/images/dummy_img/mini_banner_04.png" },
//   ];

//   return (
//     <FlexChild width={"auto"}>
//       <div className={styles.mini_Banner}>
//         {link_banner.map((item, i) => (
//           <Link
//             href={item.link}
//             key={i}
//             className={clsx(item.link?.length <= 1 ? styles.disabled : "")}
//           >
//             <Image src={item.src} width={"100%"} height={"auto"} />
//           </Link>
//         ))}
//       </div>
//     </FlexChild>
//   );
// }

export function MainCategory() {
  // 카테고리메뉴

  const { categoriesData } = useCategories();
  const costumeData = categoriesData.find((ca) => ca.name === "코스튬/의류");

  // console.log(costumeData?.id);

  return (
    <>
      <nav className={styles.category_menu}>
        {categoriesData
          .sort((c1, c2) => c1.index - c2.index)
          .filter((ca) => ca.name !== "코스튬/의류")
          .map((cat, i) => (
            <Link
              href={`/categories/${cat.id}`}
              key={i}
              className={styles.ca_item}
            >
              <FlexChild
                className={styles.ca_img}
                justifyContent="center"
                alignItems="center"
              >
                <Image src={cat.thumbnail} />
              </FlexChild>
              <VerticalFlex className={styles.text_box}>
                <h5>{cat.name}</h5>
                <Span className="Wanted">{cat.english_name}</Span>
              </VerticalFlex>
            </Link>
          ))}
      </nav>

      <Link
        href={`categories/${costumeData?.id}`}
        className={styles.exhibitionBox}
      >
        <Div className={styles.itemBox}>
          <VerticalFlex className={styles.text_box} alignItems="start">
            <P className={styles.text1}>특별한 의상을 찾으시나요?</P>
            <h3>{costumeData?.name}</h3>
            <P className={styles.text2}>
              파자마부터 메이드, 교복 등 취향에 맞는 <br />
              다양한 스타일을 만나보세요.
            </P>
            <Span className={styles.arrow_btn}>
              <Image src={"/resources/images/button_arrow.png"} width={5} />
            </Span>
          </VerticalFlex>
          <Image src={costumeData?.thumbnail} />
        </Div>

        <Div className={styles.bg_layer}>
          <Image src={costumeData?.thumbnail} />
          <Image src={costumeData?.thumbnail} />
          <Image src={costumeData?.thumbnail} />
        </Div>
      </Link>
    </>
  );
}

// 이 달의 핫딜
// export function HotDealWrapper({
//   id,
//   lineClamp,
//   initProducts,
//   initCondition,
// }: {
//   id: string;
//   lineClamp?: number;
//   initProducts: Pageable;
//   initCondition: any;
// }) {
//   const {
//     [id]: products,
//     Load,
//     page,
//     maxPage,
//   } = useInfiniteData(
//     id,
//     (pageNumber) => ({
//       ...initCondition,
//       pageSize: 6,
//       pageNumber,
//     }),
//     (condition) => requester.getProducts(condition),
//     (data) => data?.totalPages || 0,
//     {
//       onReprocessing: (data) => data?.content || [],
//       fallbackData: [initProducts],
//     }
//   );

//   return (
//     <FlexChild hidden={!products || products?.length === 0} marginBottom={20}>
//       <VerticalFlex>
//         <HorizontalFlex
//           className={clsx(styles.titleBox, styles.titleBox1)}
//           alignItems="end"
//           gap={20}
//         >
//           <div className={styles.title}>
//             <h2 className="SacheonFont">
//               <Image
//                 src="/resources/images/header/HotDeal_icon.png"
//                 width={15}
//                 height={"auto"}
//               />
//               이 달의 <Span color={"#FF4A4D"}>HOT</Span>딜
//             </h2>
//             <P width={"auto"}>매달 갱신되는 Hot Deal 상품!</P>
//           </div>
//           <FlexChild width={"auto"}>
//             <Link className={styles.linkBtn} href={"/products/hot"}>
//               더보기
//             </Link>
//           </FlexChild>
//         </HorizontalFlex>
//         {/* 메인, 상세 리스트 */}
//         <ProductList
//           id="discount"
//           products={products}
//           Load={Load}
//           hidden={maxPage < 1 || page >= maxPage}
//           maxPage={maxPage}
//           page={page}
//           // loading={loading}
//         />
//       </VerticalFlex>
//     </FlexChild>
//   );
// }

// 베스트 상품
export function BestProducts({
  initProducts,
  initCondition,
}: {
  initProducts: Pageable;
  initCondition: any;
}) {
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
    <VerticalFlex className={styles.best_list}>
      <HorizontalFlex className={styles.titleBox} alignItems="end" gap={20}>
        <div className={styles.title}>
          <h2 className="Wanted">
            BEST
            <small>상품</small>
          </h2>
        </div>

        <FlexChild width={"auto"}>
          <Link className={styles.linkBtn} href={siteInfo.pt_best}>
            자세히 보기 <b>+</b>
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
}: // loading,
{
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
  const pathname = usePathname();

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
          <MasonryGrid
            breakpoints={{
              default: 3,
              992: 3,
              768: 3,
              680: 3,
              560: 2,
            }}
            gap={16}
            width={"100%"}
          >
            {products.slice(0, visibleCount).map((product: ProductData, i) => {
              return (
                <FlexChild className={'card_wrap'} key={product.id}>
                  {
                    // 프로덕트, new일때만 나타나기. 제품 인기순 표시임
                    <FlexChild
                      color="#000"
                      className={clsx(
                        'rank'
                        // i + page * 12 < 3 ? styles.topRank : "" // 더보기나 페이징으로 다음 페이지 있을때 적용
                      )}
                    >
                      <Span>
                        {/* {page * 12 + i + 1} */}
                        {i + 1}
                      </Span>
                    </FlexChild>
                  }
                  <ProductCard product={product} lineClamp={2} width={"auto"} />
                </FlexChild>
              );
            })}
          </MasonryGrid>
          {loading && <LoadingSpinner />}
          <ProductLoadBtn
            maxPage={maxPage}
            page={page}
            loading={loading}
            showMore={showMore}
          />
        </VerticalFlex>
      ) : (
        <NoContent type="상품" />
      )}
    </>
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

export function ReviewSection({
  // id,
  lineClamp,
}: {
  // id: string;
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
        relations: "item.variant.product,user",
        best: true,
        order: { index: "ASC", idx: "DESC" },
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

  const prevRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);

  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      const navigation = swiperInstance.params.navigation;

      // Swiper 인스턴스의 네비게이션 요소를 명시적으로 업데이트
      if (navigation && typeof navigation !== "boolean") {
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
          베스트 리뷰에 선정되면 <br />
          30% 할인쿠폰 증정!
        </P>
      </VerticalFlex>

      {ranked.length > 0 || loading ? (
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
              nextEl: nextRef.current,
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
              : [...ranked]
                  .sort(() => Math.random() - 0.5)
                  .map((review, i) => (
                    <SwiperSlide key={review.id ?? i}>
                      <ReviewImgCard
                        review={review}
                        lineClamp={lineClamp ?? 2}
                        type={"slide"}
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

export function EventSection({
  // id,
  initCondition,
  initNotices,
  lineClamp,
}: {
  // id: string;
  initCondition: any;
  initNotices: Pageable;
  lineClamp?: number;
}) {
  const [loading, setLoading] = useState(false);

  const { notices, setPage } = usePageData(
    "notices",
    (pageNumber) => ({
      ...initCondition,
      pageNumber,
    }),
    (condition) => requester.getNotices(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initNotices,
    }
  );

  useEffect(() => {
    setPage(0);
  }, [initCondition.q]);

  const prevRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);

  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      const navigation = swiperInstance.params.navigation;

      // Swiper 인스턴스의 네비게이션 요소를 명시적으로 업데이트
      if (navigation && typeof navigation !== "boolean") {
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

  console.log(notices);

  return (
    <>
      <VerticalFlex className={styles.titleBox} gap={20} alignItems="start">
        <HorizontalFlex alignItems="end" gap={20}>
          <div className={styles.title}>
            <h2 className="Wanted">EVENT</h2>
          </div>

          <FlexChild width={"auto"}>
            <Link className={styles.linkBtn} href={siteInfo.bo_event}>
              자세히 보기 <b>+</b>
            </Link>
          </FlexChild>
        </HorizontalFlex>

        <P className={styles.text1}>다양한 이벤트들을 만나 보세요.</P>
      </VerticalFlex>

      {notices.length > 0 || loading ? (
        <FlexChild className={styles.ProductSlider}>
          <Swiper
            loop={true}
            slidesPerView={1.2}
            speed={600}
            spaceBetween={15}
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 4000 }}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
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
              : notices.map((item: NoticeData, i: number) => (
                  <SwiperSlide key={item.id ?? i}>
                    <EventCard item={item} workType={"slide"} />
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
        <NoContent type="게시판" />
      )}
    </>
  );
}
