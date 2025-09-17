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
import { useRef, useState } from "react";
import styles from "./page.module.css";

import HorizontalFlex from "@/components/flex/HorizontalFlex";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import useData from "@/shared/hooks/data/useData";
import useInfiniteData from "@/shared/hooks/data/useInfiniteData";
import { requester } from "@/shared/Requester";
import { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
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
    <FlexChild className={clsx(styles.main_banner)}>
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
        {[...banners]?.reverse().map((item: BannerData, i: number) => {
          return (
            <SwiperSlide key={i} className={`swiper_0${i}`}>
              {item.to ? (
                <Link href={item.to}>
                  <Image
                    src={
                      userData?.adult
                        ? item.thumbnail.mobile
                        : "/resources/images/19_only.png"
                    }
                    width={"100%"}
                  />
                </Link>
              ) : (
                <Image
                  src={
                    userData?.adult
                      ? item.thumbnail.mobile
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
    <VerticalFlex className={styles.link_Banner}>
      {link_banner.map((item, i) => (
        <Link href={item.link} key={i}>
          <Image src={item.src} width={"100%"} height={"auto"} />
        </Link>
      ))}
    </VerticalFlex>
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

  const showMore = () => {
    Load(); // 서버에서도 다음 페이지 로드
  };

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

// 베스트 상품
export function NewProducts({ initProducts }: { initProducts: Pageable }) {
  const { newProducts, Load, maxPage, page } = useInfiniteData(
    "newProducts",
    (pageNumber) => ({
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

  return (
    <FlexChild marginBottom={20}>
      <VerticalFlex>
        {/* <HorizontalFlex
          className={styles.titleBox}
          alignItems="end"
          gap={20}
        >
          <div className={styles.title}>
            <Image
              src="/resources/images/header/Logo.png"
              width={50}
              height={"auto"}
            />
            <h2 className="SacheonFont">
              <Span>PICK!</Span> 추천 상품
            </h2>
          </div>
          <FlexChild width={"auto"}>
            <Link className={styles.linkBtn} href={"/products/best"}>
              더보기
            </Link>
          </FlexChild>
        </HorizontalFlex> */}
        <HorizontalFlex className={styles.titleBox} alignItems="end" gap={20}>
          <div className={styles.title}>
            <Image src={'/resources/images/header/logo.png'} width={50} />
            <h2 className="SacheonFont">
              <Span position="relative" top={3}>BEST</Span> 상품!
            </h2>
          </div>

          <FlexChild width={"auto"}>
            <Link className={styles.linkBtn} href={"/products/new"}>
              더보기
            </Link>
          </FlexChild>
        </HorizontalFlex>
        <ProductList
          id="new"
          products={newProducts}
          Load={Load}
          hidden={maxPage < 1 || page >= maxPage}
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
}: {
  id: string;
  lineClamp?: number;
  products: ProductData[];
  Load: () => void;
  hidden?: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(6);

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
          <Button
            className={styles.list_more_btn}
            onClick={showMore}
            hidden={hidden}
          >
            <FlexChild gap={10}>
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
//             slidesPerView={1.5}
//             speed={600}
//             spaceBetween={15}
//             modules={[Autoplay, Navigation]}
//             autoplay={{ delay: 4000 }}
//           >
//             {reviewTest.map((review, i) => {
//               return (
//                 <SwiperSlide key={i}>
//                   <ReviewImgCard width={'auto'} review={review} lineClamp={lineClamp ?? 2} />
//                 </SwiperSlide>
//               );
//             })}
//           </Swiper>
//         </FlexChild>
//       ) : (
//         <NoContent type="상품" />
//       )}
//     </>
//   );
// }
