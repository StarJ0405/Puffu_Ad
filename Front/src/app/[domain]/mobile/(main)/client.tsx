"use client";
import Button from "@/components/buttons/Button";
import ReviewImgCard from "@/components/card/reviewImgCard";
import ProductCard from "@/components/card/ProductCard";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import Span from "@/components/span/Span";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import styles from "./page.module.css";

import NoContent from "@/components/noContent/noContent";
import useInfiniteData from "@/shared/hooks/data/useInfiniteData";
import { requester } from "@/shared/Requester";
import { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import useData from "@/shared/hooks/data/useData";
import { Swiper, SwiperSlide } from "swiper/react";


export function MainBanner({ initBanners }: { initBanners: Pageable }) {

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

  // console.log('배너', banners);

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
        {[...banners]?.reverse().map((item, i) => {
          return (
            <SwiperSlide key={i} className={`swiper_0${i}`}>
              <Link href={item.thumbnail.mobile}>
                <Image src={item.thumbnail.mobile} width={'100%'} />
              </Link>
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

type ReviewItem = {
  thumbnail: string;
  content: string;
  name: string;
  date: string;
  product: {
    thumb: string;
    title: string;
    rating: string;
    reviewcount: string;
  };
};

export function ProductSlider({
  id,
  lineClamp,
}: {
  id: string;
  lineClamp?: number;
}) {
  const reviewTest: ReviewItem[] = [
    {
      thumbnail: "/resources/images/dummy_img/review_img_01.png",
      content: "벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.",
      name: "김한별",
      date: "2025-08-01",
      product: {
        thumb: "/resources/images/dummy_img/review_img_01.png",
        title: "적나라 생츄어리",
        rating: "4.8",
        reviewcount: "4,567",
      },
    },
    {
      thumbnail: "/resources/images/dummy_img/review_img_01.png",
      content: "벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.",
      name: "김한별",
      date: "2025-08-01",
      product: {
        thumb: "/resources/images/dummy_img/review_img_01.png",
        title: "적나라 생츄어리",
        rating: "4.8",
        reviewcount: "4,567",
      },
    },
    {
      thumbnail: "/resources/images/dummy_img/review_img_01.png",
      content: "벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.",
      name: "김한별",
      date: "2025-08-01",
      product: {
        thumb: "/resources/images/dummy_img/review_img_01.png",
        title: "적나라 생츄어리",
        rating: "4.8",
        reviewcount: "4,567",
      },
    },
    {
      thumbnail: "/resources/images/dummy_img/review_img_01.png",
      content: "벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.",
      name: "김한별",
      date: "2025-08-01",
      product: {
        thumb: "/resources/images/dummy_img/review_img_01.png",
        title: "적나라 생츄어리",
        rating: "4.8",
        reviewcount: "4,567",
      },
    },
    {
      thumbnail: "/resources/images/dummy_img/review_img_01.png",
      content: "벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.",
      name: "김한별",
      date: "2025-08-01",
      product: {
        thumb: "/resources/images/dummy_img/review_img_01.png",
        title: "적나라 생츄어리",
        rating: "4.8",
        reviewcount: "4,567",
      },
    },
    {
      thumbnail: "/resources/images/dummy_img/review_img_01.png",
      content: "벌써 2번째 구매네요. 항상 잘 쓰고 있습니다.",
      name: "김한별",
      date: "2025-08-01",
      product: {
        thumb: "/resources/images/dummy_img/review_img_01.png",
        title: "적나라 생츄어리",
        rating: "4.8",
        reviewcount: "4,567",
      },
    },
  ];

  return (
    <>
      {reviewTest.length > 0 ? (
        <FlexChild id={id} className={styles.ProductSlider}>
          <Swiper
            loop={true}
            slidesPerView={1.5}
            speed={600}
            spaceBetween={15}
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 4000 }}
          >
            {reviewTest.map((review, i) => {
              return (
                <SwiperSlide key={i}>
                  <ReviewImgCard width={'auto'} review={review} lineClamp={lineClamp ?? 2} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </FlexChild>
      ) : (
        <NoContent type="상품" />
      )}
    </>
  );
}



// 상품 리스트
export function NewProducts({ initProducts }: { initProducts: Pageable }) {
  const { newProducts, Load,origin } = useInfiniteData(
    "newProducts",
    (pageNumber) => ({
      pageSize: 30,
      pageNumber,
    }),
    (condition) => requester.getProducts(condition),
    (data) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData:[initProducts]
    }
  );

  return <ProductList id="new" products={newProducts} Load={Load} />;
}

export function ProductList({
  id,
  lineClamp,
  products,
  Load,
}: {
  id: string;
  lineClamp?: number;
  products: ProductData[];
  Load: () => void;
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
          <MasonryGrid gap={15} width={'100%'}>
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
          {products.slice(0, visibleCount).map((product: ProductData, i) => {
            return (
              <ProductCard
                key={product.id}
                product={product}
                lineClamp={2}
                width={'auto'}
              />
            );
          })}
          </MasonryGrid>
          <Button className={styles.list_more_btn} onClick={showMore}>
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
