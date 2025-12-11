"use client";
import Button from "@/components/buttons/Button";
import ProductCard from "@/components/card/ProductCard";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import Span from "@/components/span/Span";
import clsx from "clsx";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";
import { useStore } from "@/providers/StoreProvider/StorePorivderClient";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import useData from "@/shared/hooks/data/useData";
import useInfiniteData from "@/shared/hooks/data/useInfiniteData";
import { requester } from "@/shared/Requester";
import { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import ReviewImgCard from "@/components/card/reviewImgCard";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import LoadingCard from "@/components/card/LoadingCard";
import ProductLoadBtn from "@/components/buttons/ProductLoadBtn";
import useNavigate from "@/shared/hooks/useNavigate";
import Div from "@/components/div/Div";
import usePageData from "@/shared/hooks/data/usePageData";
import siteInfo from "@/shared/siteInfo";
import { EventCard } from "@/components/card/EventCard";
// import SubBanner from "@/components/subBanner/subBanner";

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

  const navigate = useNavigate();
  const [bulletIdx, setbulltIdx] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  // 베너 링크값 없으면 링크 없애는 코드
  const linkCheck = (link: string | undefined) => {
    if (link) {
      navigate(`${link}`)
    } else {
      navigate('')
    }
  }

  const cursorCheck = (link: string | undefined) => {
    if (link) {
      return 'pointer'
    } else {
      return ''
    }
  }

  return (
    <FlexChild className={clsx(styles.main_banner)}>
      <Swiper
        slidesPerView={'auto'}
        centeredSlides={true}
        spaceBetween={90}
        loop={true}
        observer={true}
        observeParents={true}
        // maxBackfaceHiddenSlides={4}
        // loopAdditionalSlides={3}
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        modules={[Autoplay]}
        speed={600}
        autoplay={{ delay: 4000 }}
        onSwiper={(swiper) => swiperRef.current = swiper}
        onSlideChange={(e) => setbulltIdx(e.realIndex)}
        className={styles.banner_box}
      >
        {banners?.map(
          (item: BannerDataFrame, i: number) =>
            item.thumbnail.pc && (
              <SwiperSlide key={i} className={clsx(`swiper_0${i}`, styles.slideItem)}>
                <div onClick={() => linkCheck(item.to)} className={styles.thumbnail} style={{
                  'backgroundImage': userData?.adult ? 
                  `url(${item.thumbnail.pc})`
                  : "url(/resources/images/19_only_banner.png)",
                  
                  cursor: cursorCheck(item.to),
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
            className={clsx(styles.bullet, bulletIdx === i ? styles.active : '')}
            onClick={() => swiperRef.current?.slideToLoop(i)}
          >
          </span>
        ))}
      </div>
    </FlexChild>
  );
}

// export function LinkBanner() {
//   const { storeData } = useStore();
//   const storeId = storeData?.id;

//   return (
//     <FlexChild width={"auto"}>
//       <div className={styles.link_Banner}>
//         {[0, 1, 2, 3].map((idx) => (
//           <SubBanner
//             key={idx}
//             index={idx}
//             storeId={storeId}
//             variant="pc"
//             width={"100%"}
//             height={"auto"}
//           />
//         ))}
//       </div>
//     </FlexChild>
//   );
// }

// export function LinkBanner() {
//   const link_banner = [
//     { link: "/", src: "/resources/images/dummy_img/link_banner_01.png" },
//     { link: "/", src: "/resources/images/dummy_img/link_banner_02.png" },
//     { link: "/", src: "/resources/images/dummy_img/link_banner_03.png" },
//     { link: "/", src: "/resources/images/dummy_img/link_banner_04.png" },
//   ];

//   const { userData } = useAuth();
//   const { storeData } = useStore();
//   const storeId = storeData?.id;
//   return (
//     <FlexChild width={"auto"}>
//       <div className={styles.link_Banner}>
//         {link_banner.map((item, i) => (
//           <Link href={item.link} key={i} className={styles.disabled}>
//             {userData?.adult ? (
//               <Image src={item.src} width={"100%"} height={"auto"} />
//             ) : (
//               // 성인인증 안될때 나오는 이미지
//               <Image
//                 src={"/resources/images/19_only_sub_banner_pc.png"}
//                 width={"100%"}
//                 height={"auto"}
//               />
//             )}
//           </Link>
//         ))}
//       </div>
//     </FlexChild>
//   );
// }

// export function SubBanner1() {
//   const { userData } = useAuth();

//   return (
//     <FlexChild width={"100%"}>
//       <Link href={"/"} className={styles.disabled}>
//         {userData?.adult ? (
//           <Image
//             src={"/resources/images/dummy_img/sub_banner_01.jpg"}
//             width={"100%"}
//             height={"auto"}
//           />
//         ) : (
//           // 성인인증 안될때 나오는 이미지
//           <Image
//             src={"/resources/images/19_only_sub_banner_pc.png"}
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
//     <FlexChild width={"100%"}>
//       <Link href={"/"} className={styles.disabled}>
//         {userData?.adult ? (
//           <Image
//             src={"/resources/images/dummy_img/sub_banner_02.jpg"}
//             width={"100%"}
//             height={"auto"}
//           />
//         ) : (
//           // 성인인증 안될때 나오는 이미지
//           <Image
//             src={"/resources/images/19_only_sub_banner_pc.png"}
//             width={"100%"}
//             height={"auto"}
//           />
//         )}
//       </Link>
//     </FlexChild>
//   );
// }

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

  // 카테고리 역순, 코스튬 제외 필터
  const categoriesSet =
    categoriesData.sort((c1, c2) => c1.index - c2.index).filter((ca) => ca.name !== '코스튬/의류');

  // 배열 안에 값을 5개씩 그룹화 해서 categoryDD에 다시 담는 과정
  // 이렇게 하는 이유: pc에서 갯수가 5칸 못 채우면 공백 생기는 걸 방지.
  const categoryDD = [];
  for (let i = 0; i < categoriesSet.length; i += 5) {
    categoryDD.push(categoriesSet.slice(i, i + 5));
  }


  // 코스튬/의류 카테고리만 추출
  const costumeData = categoriesData.find((ca) => ca.name === '코스튬/의류');


  function CategoryList({ group }: { group: Array<CategoryData> }) {
    return (
      <article className={styles.category_list}>
        {group.map((cat: CategoryData, i: number) => {
          return (
            <VerticalFlex className={styles.ca_item} key={i} justifyContent="space-between" alignItems="start">
              <VerticalFlex className={styles.text_box} alignItems="start">
                <h5>{cat.name}</h5>
                <Span className="Wanted">{cat.english_name}</Span>
              </VerticalFlex>
              <FlexChild className={styles.ca_img} justifyContent="end" alignItems="center">
                <Image src={cat.thumbnail} />
              </FlexChild>
              <Link className={styles.link_btn} href={`/categories/${cat.id}`}>자세히 보기</Link>
            </VerticalFlex>
          )
        })}
      </article>
    )
  }

  return (
    <>
      <nav className={styles.category_box}>
        {categoryDD.map((group, i) => {
          return (
            <CategoryList group={group} key={i} />
          )
        })}
      </nav>
      <Link href={`/products/showcase?category_id=${costumeData?.id}`} className={styles.exhibitionBox}>
        <Div className={styles.itemBox}>
          <VerticalFlex className={styles.text_box} alignItems="start">
            <P className={styles.text1}>특별한 의상을 찾으시나요?2</P>
            <FlexChild gap={10}>
              <h3>{costumeData?.name}</h3>
              <Span className={clsx(styles.eng_txt, 'Wanted')}>{costumeData?.english_name}</Span>
            </FlexChild>
            <P className={styles.text2}>
              파자마부터 메이드, 교복 등 취향에 맞는 <br />
              다양한 스타일을 만나보세요.
            </P>
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
export function HotDealList({
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
    maxPage,
    page,
    origin,
  } = useInfiniteData(
    id,
    (pageNumber) => ({
      ...initCondition,
      pageSize: 12,
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

  const showMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await Load(); // 데이터 로드
    } finally {
      setLoading(false); // 끝나면 로딩 해제
    }
  };

  // const showMore = () => {
  //   Load(); // 서버에서도 다음 페이지 로드
  // };

  return (
    <FlexChild hidden={!products || products?.length === 0}>
      <VerticalFlex>
        <HorizontalFlex
          className={clsx(styles.titleBox, styles.titleBox1)}
          justifyContent="start"
          alignItems="end"
          gap={30}
        >
          <div className={styles.title}>
            <h2 className="SacheonFont" style={{ marginBottom: "12px" }}>
              <Image
                src="/resources/images/header/HotDeal_icon.png"
                width={24}
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
        <>
          {products.length > 0 ? (
            <VerticalFlex gap={10}>
              <MasonryGrid gap={20} width={"100%"} breakpoints={6}>
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
      </VerticalFlex>
    </FlexChild>
  );
}

// 베스트
export function BestList({
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
    maxPage,
    page,
    mutate
  } = useInfiniteData(
    id,
    (pageNumber) => ({
      ...initCondition,
      pageSize: 12,
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

  const showMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await Load(); // 데이터 로드
    } finally {
      setLoading(false); // 끝나면 로딩 해제
    }
  };

  // const showMore = () => {
  //   Load(); // 서버에서도 다음 페이지 로드
  // };

  // console.log(products);

  return (
    <>
      {products.length > 0 ? (
        <VerticalFlex gap={10}>
          <MasonryGrid gap={20} width={"100%"} breakpoints={4}>
            {products.map((product: ProductData, i: number) => {
              return (
                <FlexChild className={styles.card_wrap} key={product.id}>
                  <FlexChild color="#000" className={clsx(styles.rank)}>
                    <Span>{i + 1}</Span>
                  </FlexChild>

                  <ProductCard
                    key={product.id}
                    product={product}
                    lineClamp={2}
                    width={'100%'}
                    mutate={mutate}
                  />
                </FlexChild>
              );
            })}
          </MasonryGrid>
          {/* {loading && <LoadingSpinner />}
          <ProductLoadBtn
            maxPage={maxPage}
            page={page}
            loading={loading}
            showMore={showMore}
          /> */}
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

// 리뷰 슬라이더
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
    <FlexChild className={styles.item_wrap} alignItems="stretch">
      <VerticalFlex className={styles.titleBox} gap={25} alignItems="start">
        <VerticalFlex gap={15} alignItems="start">
          <div className={styles.title}>
            <h2 className="Wanted">
              BEST
              <small>리뷰</small>
            </h2>
          </div>

          <P className={styles.text1}>
            베스트 리뷰에 선정되면  <br />
            30% 할인쿠폰 증정!
          </P>

          <FlexChild width={"auto"}>
            <Link className={styles.linkBtn} href={siteInfo.bo_review}>
              자세히 보기 <b>+</b>
            </Link>
          </FlexChild>
        </VerticalFlex>

        <FlexChild className={styles.pagination}>
          <div ref={prevRef} className={clsx(styles.naviBtn, styles.prevBtn)}>
            <Image
              src={"/resources/icons/arrow/slide_arrow.png"}
              width={10}
            ></Image>
          </div>
          <div ref={nextRef} className={clsx(styles.naviBtn, styles.nextBtn)}>
            <Image
              src={"/resources/icons/arrow/slide_arrow.png"}
              width={10}
            ></Image>
          </div>
        </FlexChild>
      </VerticalFlex>

      {ranked.length > 0 || loading ? (
        <FlexChild className={styles.ProductSlider}>
          <Swiper
            loop={false}
            slidesPerView={'auto'}
            speed={600}
            spaceBetween={10}
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 4000 }}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current
            }}
            // observer={true}
            // observeParents={true}
            updateOnWindowResize={false}
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
                    <SwiperSlide className={styles.slide_item} key={review.id ?? i}>
                      <ReviewImgCard
                        review={review}
                        lineClamp={lineClamp ?? 2}
                        type={'slide'}
                        width={'100%'}
                        height="auto"
                      />
                    </SwiperSlide>
                  ))}
          </Swiper>
        </FlexChild>
      ) : (
        <NoContent type="리뷰" />
      )}
    </FlexChild>
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
    <FlexChild className={styles.item_wrap} alignItems="stretch">
      <VerticalFlex className={styles.titleBox} gap={25} alignItems="start">
        <VerticalFlex gap={15} alignItems="start">
          <div className={styles.title}>
            <h2 className="Wanted">event</h2>
          </div>

          <P className={styles.text1}>
            다양한 이벤트들을 만나 보세요.
          </P>

          <FlexChild width={"auto"}>
            <Link className={styles.linkBtn} href={siteInfo.bo_event}>
              자세히 보기 <b>+</b>
            </Link>
          </FlexChild>
        </VerticalFlex>

        <FlexChild className={styles.pagination}>
          <div ref={prevRef} className={clsx(styles.naviBtn, styles.prevBtn)}>
            <Image
              src={"/resources/icons/arrow/slide_arrow.png"}
              width={10}
            ></Image>
          </div>
          <div ref={nextRef} className={clsx(styles.naviBtn, styles.nextBtn)}>
            <Image
              src={"/resources/icons/arrow/slide_arrow.png"}
              width={10}
            ></Image>
          </div>
        </FlexChild>
      </VerticalFlex>

      {notices.length > 0 || loading ? (
        <FlexChild className={styles.ProductSlider}>
          <Swiper
            loop={true}
            slidesPerView={'auto'}
            centeredSlides={false}
            speed={600}
            spaceBetween={20}
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 4000 }}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current
            }}
            // observer={true}
            // observeParents={true}
            updateOnWindowResize={false}
            // watchOverflow={false}
          >
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                <SwiperSlide key={`skeleton-${i}`}>
                  <LoadingCard />
                </SwiperSlide>
              ))
              : notices.map((item: NoticeData, i: number) => (
                  <SwiperSlide className={styles.slide_item} key={item.id ?? i}>
                    <EventCard item={item} width={398} workType={'slide'}/>
                  </SwiperSlide>
                ))}
          </Swiper>
        </FlexChild>
      ) : (
        <NoContent type="게시판" />
      )}
    </FlexChild>
  );
}
