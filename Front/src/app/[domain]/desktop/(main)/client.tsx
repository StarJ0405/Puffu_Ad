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
import { useRef } from "react";
import styles from "./page.module.css";

import HorizontalFlex from "@/components/flex/HorizontalFlex";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import useData from "@/shared/hooks/data/useData";
import useInfiniteData from "@/shared/hooks/data/useInfiniteData";
import { requester } from "@/shared/Requester";
import { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";

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
  // log(banners); 베너 정보
  const swiperRef = useRef<SwiperType | null>(null);
  // const [banners, setBanners] = useState<BannerData[]>([]);

  // useEffect(() => {
  //   requester.getBanners((result: BannerData[]) => {
  
  //     setBanners(result);
  //   });
  // }, []);

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
    <FlexChild className={clsx("page_container", styles.main_banner)}>
      <Swiper
        loop={true}
        slidesPerView={1}
        speed={600}
        spaceBetween={40}
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
        {[...banners]?.reverse().map((item: BannerDataFrame, i: number) => {
          // reverse는 임시
          return (
            <SwiperSlide key={i} className={`swiper_0${i}`}>
              {item.to ? (
                <Link href={item.to}>
                  <Image
                    src={
                      userData?.adult
                        ? item.thumbnail.pc
                        : "/resources/images/19_only.png"
                    }
                    width={"100%"}
                  />
                </Link>
              ) : (
                <Image
                  src={
                    userData?.adult
                      ? item.thumbnail.pc
                      : "/resources/images/19_only.png"
                  }
                  width={"100%"}
                />
              )}
            </SwiperSlide>
          );
        })}
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

  return (
    <FlexChild width={"auto"}>
      <div className={styles.link_Banner}>
        {link_banner.map((item, i) => (
          <Link href={item.link} key={i}>
            <Image src={item.src} width={"100%"} height={"auto"} />
          </Link>
        ))}
      </div>
    </FlexChild>
  );
}

export function SubBanner() {
  return (
    <FlexChild width={"100%"}>
      <Link href={"/"}>
        <Image
          src={"/resources/images/dummy_img/sub_banner_01.png"}
          width={"100%"}
          height={"auto"}
        />
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
                <Image src={cat.thumbnail} width={"auto"} height={120} />
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
    maxPage,
    page,
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
  const showMore = () => {
    Load(); // 서버에서도 다음 페이지 로드
  };

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
              <Button
                className={styles.list_more_btn}
                hidden={maxPage < 1 || page >= maxPage}
              >
                <FlexChild gap={10} onClick={showMore}>
                  <Span>상품 더보기</Span>
                  <Image
                    src={"/resources/icons/arrow/arrow_bottom_icon.png"}
                    width={10}
                  />
                </FlexChild>
              </Button>
            </VerticalFlex>
          ) : (
            <NoContent type="상품" />
          )}
        </>
      </VerticalFlex>
    </FlexChild>
  );
}

// 신상품, 등등
export function ProductList({
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
  const showMore = () => {
    Load(); // 서버에서도 다음 페이지 로드
  };

  

  return (
    <>
      {products.length > 0 ? (
        <VerticalFlex gap={10}>
          <MasonryGrid gap={20} breakpoints={6}>
            {/* {products.map((product, i) => {
              return (
                <TestProductCard
                  product={product}
                  lineClamp={2}
                  key={i}
                  width={200}
                />
              );
            })} */}
            {/* </MasonryGrid> */}
            {/* <ProductCard
            product={{
              id: "123",
              title: "테스트 상품",
              thumbnail: "/test.png",
              price: 10000,
              discount_price: 8000,
              discount_rate: 0.8,
              store: "테스트 스토어",
              brand: "브랜드명",
              category: "카테고리",
              variants: [],
            }}
            currency_unit="₩"
          /> */}
            {products.map((product: ProductData, i: number) => {
              return (
                <ProductCard
                  key={product.id}
                  product={
                    {
                      id: product.id,
                      title: product.title,
                      thumbnail: product.thumbnail,
                      price: product.price,
                      discount_price: product.discount_price,
                      discount_rate: product.discount_rate,
                      store_name: product.brand.name,
                      variants: product.variants,
                    } as any
                  }
                  lineClamp={2}
                  width={200}
                />
              );
            })}
          </MasonryGrid>
          <Button
            className={styles.list_more_btn}
            hidden={maxPage < 1 || page >= maxPage}
          >
            <FlexChild gap={10} onClick={showMore}>
              <Span>상품 더보기</Span>
              <Image
                src={"/resources/icons/arrow/arrow_bottom_icon.png"}
                width={10}
              />
            </FlexChild>
          </Button>
        </VerticalFlex>
      ) : (
        <NoContent type="상품" />
      )}
    </>
  );
}

// type ReviewItem = {
//   thumbnail: string;
//   content: string;
//   name: string;
//   date: string;
//   product: {
//     thumb: string;
//     title: string;
//     rating: string;
//     reviewcount: string;
//   };
// };

// // 리뷰 슬라이더
// export function ProductSlider({
//   id,
//   lineClamp,
// }: {
//   id: string;
//   lineClamp?: number;
// }) {
//   const reviewTest: ReviewItem[] = [
//     {
//       thumbnail: "/resources/images/dummy_img/review_img_01.png",
//       content: "벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.",
//       name: "김한별",
//       date: "2025-08-01",
//       product: {
//         thumb: "/resources/images/dummy_img/review_img_01.png",
//         title: "적나라 생츄어리",
//         rating: "4.8",
//         reviewcount: "4,567",
//       },
//     },
//     {
//       thumbnail: "/resources/images/dummy_img/review_img_01.png",
//       content: "벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.",
//       name: "김한별",
//       date: "2025-08-01",
//       product: {
//         thumb: "/resources/images/dummy_img/review_img_01.png",
//         title: "적나라 생츄어리",
//         rating: "4.8",
//         reviewcount: "4,567",
//       },
//     },
//     {
//       thumbnail: "/resources/images/dummy_img/review_img_01.png",
//       content: "벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.",
//       name: "김한별",
//       date: "2025-08-01",
//       product: {
//         thumb: "/resources/images/dummy_img/review_img_01.png",
//         title: "적나라 생츄어리",
//         rating: "4.8",
//         reviewcount: "4,567",
//       },
//     },
//     {
//       thumbnail: "/resources/images/dummy_img/review_img_01.png",
//       content: "벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.",
//       name: "김한별",
//       date: "2025-08-01",
//       product: {
//         thumb: "/resources/images/dummy_img/review_img_01.png",
//         title: "적나라 생츄어리",
//         rating: "4.8",
//         reviewcount: "4,567",
//       },
//     },
//     {
//       thumbnail: "/resources/images/dummy_img/review_img_01.png",
//       content: "벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.",
//       name: "김한별",
//       date: "2025-08-01",
//       product: {
//         thumb: "/resources/images/dummy_img/review_img_01.png",
//         title: "적나라 생츄어리",
//         rating: "4.8",
//         reviewcount: "4,567",
//       },
//     },
//     {
//       thumbnail: "/resources/images/dummy_img/review_img_01.png",
//       content: "벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.",
//       name: "김한별",
//       date: "2025-08-01",
//       product: {
//         thumb: "/resources/images/dummy_img/review_img_01.png",
//         title: "적나라 생츄어리",
//         rating: "4.8",
//         reviewcount: "4,567",
//       },
//     },
//   ];

//   return (
//     <>
//       {reviewTest.length > 0 ? (
//         <FlexChild id={id} className={styles.ProductSlider}>
//           <Swiper
//             loop={true}
//             slidesPerView={5}
//             speed={600}
//             spaceBetween={20}
//             modules={[Autoplay, Navigation]}
//             autoplay={{ delay: 4000 }}
//             navigation={{
//               prevEl: `#${id} .${styles.prevBtn}`,
//               nextEl: `#${id} .${styles.nextBtn}`,
//             }}
//           >
//             {reviewTest.map((review, i) => {
//               return (
//                 <SwiperSlide key={i}>
//                   <ReviewImgCard review={review} lineClamp={lineClamp ?? 2} />
//                 </SwiperSlide>
//               );
//             })}
//           </Swiper>

//           <div className={clsx(styles.naviBtn, styles.prevBtn)}>
//             <Image
//               src={"/resources/icons/arrow/slide_arrow.png"}
//               width={10}
//             ></Image>
//           </div>
//           <div className={clsx(styles.naviBtn, styles.nextBtn)}>
//             <Image
//               src={"/resources/icons/arrow/slide_arrow.png"}
//               width={10}
//             ></Image>
//           </div>
//         </FlexChild>
//       ) : (
//         <NoContent type="상품" />
//       )}
//     </>
//   );
// }
