"use client";
import ProductCard from "@/components/card/ProductCard";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import FlexGrid from "@/components/flex/FlexGrid";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import {
  useCart,
  useCategories,
  useStore,
} from "@/providers/StoreProvider/StorePorivderClient";
import useData from "@/shared/hooks/data/useData";
import useInfiniteData from "@/shared/hooks/data/useInfiniteData";
import useClientEffect from "@/shared/hooks/useClientEffect";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import { Cookies } from "@/shared/utils/Data";
import { getCookieOption, throttle } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper as ReactSwiper, SwiperSlide } from "swiper/react";
import styles from "./page.module.css";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import LoadingSpinner from "@/components/loading/LoadingSpinner";

export function Name() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { userData } = useAuth();
  const { storeData } = useStore();
  const { cartData } = useCart();
  const navigate = useNavigate();
  const handleScroll = useCallback((e: any) => {
    setIsScrolled(e.target.scrollTop > 7);
  }, []);

  useEffect(() => {
    const main = document.getElementById("scroll");

    // 스로틀링된 스크롤 핸들러
    const throttledHandleScroll = throttle(handleScroll, 50); // 100ms마다 한 번 실행

    // 컴포넌트 마운트 시 이벤트 리스너 추가
    main?.addEventListener("scroll", throttledHandleScroll);
    main?.addEventListener("scrollend", throttledHandleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거 (클린업 함수)
    return () => {
      main?.removeEventListener("scroll", throttledHandleScroll);
      main?.removeEventListener("scrollend", throttledHandleScroll);
    };
  }, [handleScroll]); // handleScroll 함수가 변경될 때마다 useEffect 재실행 (여기서는 한 번만 실행될 것임)

  return (
    <FlexChild
      className={clsx(styles.mainHeader, { [styles.scrolled]: isScrolled })}
    >
      <HorizontalFlex fontWeight={700}>
        <FlexChild>
          <P>
            <Span fontSize={18}>{storeData?.name}</Span>{" "}
            <Span fontSize={14}>by PUFFU</Span>
          </P>
        </FlexChild>
        <FlexChild width={"max-content"} gap={17}>
          <Image
            src={
              isScrolled
                ? "/resources/icons/search_black.png"
                : "/resources/icons/search.png"
            }
            size={16}
          />
          <Div
            position="relative"
            onClick={() => {
              if (userData) {
                navigate("/cart");
              } else {
                NiceModal.show("confirm", {
                  confirmText: "로그인하기",
                  cancelText: "취소",
                  message: "로그인이 필요합니다.",
                  onConfirm: () => {
                    navigate("/login");
                  },
                });
              }
            }}
          >
            <Div
              hidden={!cartData || cartData?.items?.length === 0}
              top={0}
              right={0}
              position="absolute"
              backgroundColor={"var(--main-color)"}
              width={16}
              height={16}
              borderRadius={"100%"}
              textAlign="center"
              translate={"45% -45%"}
              color="#fff"
              border={"1px solid #fff"}
              display="flex"
              justifyContent="center"
              alignItems="center"
              fontStyle="semibold"
            >
              <P size={12} weight={600} textAlign="center">
                {cartData?.items?.length}
              </P>
            </Div>
            <Image
              src={
                isScrolled
                  ? "/resources/icons/cart_black.png"
                  : "/resources/icons/cart.png"
              }
              size={16}
            />
          </Div>
        </FlexChild>
      </HorizontalFlex>
    </FlexChild>
  );
}
export function Banner() {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const { banners } = useData(
    "banners",
    {},
    (condition) =>
      Array.from({ length: 10 }).map((_, index) => ({
        id: String(index),
        url: "https://i.imgur.com/3ItHWXi.png",
        link: index % 2 === 1 ? "https://naver.com" : "/login",
      })),
    {
      fallbackData: Array.from({ length: 10 }).map((_, index) => ({
        id: String(index),
        url: "https://i.imgur.com/3ItHWXi.png",
        link: index % 2 === 1 ? "https://naver.com" : "/login",
      })),
    }
  );
  const paginationRef = useRef<any>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (swiperInstance && paginationRef.current) {
      // Swiper 인스턴스가 있고, paginationRef.current가 준비되었을 때만 실행
      swiperInstance.params.pagination.el = paginationRef.current;
      swiperInstance.pagination.init(); // 페이징 초기화
      swiperInstance.pagination.render(); // 페이징 렌더링
      swiperInstance.pagination.update(); // 페이징 업데이트
    }
  }, [swiperInstance, paginationRef.current]);
  return (
    <>
      <ReactSwiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        }}
        onSwiper={setSwiperInstance}
        initialSlide={0}
        direction="horizontal"
        modules={[Autoplay, Pagination]}
        pagination={{
          el: paginationRef.current,
          type: "fraction",
          clickable: true,
        }}
        onBeforeInit={(swiper) => {
          const pagination: any = swiper?.params?.pagination;
          pagination.el = paginationRef.current;
        }}
      >
        {banners.map((banner: any) => (
          <SwiperSlide key={banner?.id}>
            <Image
              width={"100%"}
              src={banner.url}
              cursor={banner.link ? "pointer" : undefined}
              onClick={() => {
                if (banner.link) navigate(banner.link);
              }}
            />
          </SwiperSlide>
        ))}
      </ReactSwiper>
      <div ref={paginationRef} className={styles.customPagination} />
    </>
  );
}
export function Categorry() {
  const { categoriesData } = useCategories();
  const Slot = ({
    thumbnail,
    name,
  }: {
    thumbnail?: string | React.ReactNode;
    name: string;
  }) => {
    return (
      <FlexChild
        justifyContent="center"
        width={"calc((100vw - 50px ) / 4.25 )"}
        padding={"12px 16px"}
        alignItems="flex-start"
      >
        <VerticalFlex gap={9}>
          {typeof thumbnail === "string" ? (
            <Image src={thumbnail} width={"100%"} height={"auto"} />
          ) : (
            thumbnail
          )}
          <P
            fontWeight={600}
            fontSize={12}
            textAlign="center"
            wordBreak="keep-all"
            whiteSpace="wrap"
          >
            {name}
          </P>
        </VerticalFlex>
      </FlexChild>
    );
  };
  return (
    <FlexGrid
      columns={6}
      rows={Math.max(categoriesData.length / 6, 1)}
      height={"max-content"}
      overflowX="scroll"
      overflowY="hidden"
      hideScrollbar
    >
      <Slot
        thumbnail={
          <Icon
            containerWidth={"100%"}
            type="svg"
            name="event"
            fill="var(--main-color)"
            width={"auto"}
            height={"auto"}
          />
        }
        name="이벤트"
      />
      {categoriesData.map((category: CategoryData) => (
        <Slot
          key={category.id}
          thumbnail={category.thumbnail}
          name={category.name}
        />
      ))}
    </FlexGrid>
  );
}

export function NewProducts({
  initProducts,
  initCondition,
}: {
  initProducts: Pageable;
  initCondition: any;
}) {
  const { storeData } = useStore();
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const { newProducts } = useData(
    "newProducts",
    { ...initCondition, store_id: storeData?.id, pageSize: 10 },
    (condition) => requester.getProducts(condition),
    {
      fallbackData: initProducts,
      revalidateOnMount: true,
      onReprocessing: (data) => data?.content || [],
      refresh: {
        keepPreviousData: true,
      },
    }
  );

  const newPrevRef = useRef<any>(null);
  const newNextRef = useRef<any>(null);
  useEffect(() => {
    if (swiperInstance && newPrevRef.current) {
      swiperInstance.params.navigation.prevEl = newPrevRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.render();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance, newPrevRef.current]);

  useEffect(() => {
    if (swiperInstance && newPrevRef.current) {
      swiperInstance.params.navigation.nextEl = newNextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.render();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance, newNextRef.current]);
  return (
    <ReactSwiper
      spaceBetween={10}
      slidesPerView={2.8}
      loop={true}
      autoplay={{
        delay: 2000,
        pauseOnMouseEnter: true,
        disableOnInteraction: false,
      }}
      initialSlide={0}
      direction="horizontal"
      modules={[Autoplay, Navigation]}
      navigation={{
        prevEl: newPrevRef.current,
        nextEl: newNextRef.current,
      }}
      onBeforeInit={(swiper) => {
        const navigation: any = swiper?.params?.navigation;
        if (navigation) {
          navigation.prevEl = newPrevRef.current;
          navigation.nextEl = newNextRef.current;
        }
      }}
      onSwiper={setSwiperInstance}
    >
      {newProducts?.map((product: ProductData) => (
        <SwiperSlide key={`new_${product?.id}`}>
          <ProductCard
            product={product}
            currency_unit={storeData?.currency_unit}
          />
        </SwiperSlide>
      ))}
    </ReactSwiper>
  );
}

export function HotProducts({
  initProducts,
  initCondition,
}: {
  initProducts: Pageable;
  initCondition: any;
}) {
  const { storeData } = useStore();
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const { hotProducts } = useData(
    "hotProducts",
    { ...initCondition, store_id: storeData?.id, pageSize: 10 },
    (condition) => requester.getProducts(condition),
    {
      fallbackData: initProducts,
      revalidateOnMount: true,
      onReprocessing: (data) => data?.content || [],
      refresh: {
        keepPreviousData: true,
      },
    }
  );

  const hotPrevRef = useRef<any>(null);
  const hotNextRef = useRef<any>(null);
  useEffect(() => {
    if (swiperInstance && hotPrevRef.current) {
      swiperInstance.params.navigation.prevEl = hotPrevRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.render();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance, hotPrevRef.current]);

  useEffect(() => {
    if (swiperInstance && hotPrevRef.current) {
      swiperInstance.params.navigation.nextEl = hotNextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.render();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance, hotNextRef.current]);
  return (
    <ReactSwiper
      spaceBetween={10}
      slidesPerView={2.8}
      loop={true}
      autoplay={{
        delay: 2000,
        pauseOnMouseEnter: true,
        disableOnInteraction: false,
      }}
      initialSlide={0}
      direction="horizontal"
      modules={[Autoplay, Navigation]}
      navigation={{
        prevEl: hotPrevRef.current,
        nextEl: hotNextRef.current,
      }}
      onBeforeInit={(swiper) => {
        const navigation: any = swiper?.params?.navigation;
        if (navigation) {
          navigation.prevEl = hotPrevRef.current;
          navigation.nextEl = hotNextRef.current;
        }
      }}
      onSwiper={setSwiperInstance}
    >
      {hotProducts?.map((product: ProductData) => (
        <SwiperSlide key={`hot_${product?.id}`}>
          <ProductCard
            product={product}
            currency_unit={storeData?.currency_unit}
          />
        </SwiperSlide>
      ))}
    </ReactSwiper>
  );
}

export function WeekProducts({
  initProducts,
  initCondition,
}: {
  initProducts: Pageable;
  initCondition: any;
}) {
  const { storeData } = useStore();
  const navigate = useNavigate();
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const { weekProducts } = useData(
    "weekProducts",
    { ...initCondition, store_id: storeData?.id, pageSize: 20 },
    (condition) => requester.getProducts(condition),
    {
      fallbackData: initProducts,
      revalidateOnMount: true,
      onReprocessing: (data) => {
        const products = data?.content || [];
        if (products.length === 0) {
          return [];
        }
        const length = Math.ceil(products.length / 5);
        const result = Array.from({ length }).map((_, index) => {
          return [
            products?.[index * 5],
            products?.[index * 5 + 1],
            products?.[index * 5 + 2],
            products?.[index * 5 + 3],
            products?.[index * 5 + 4],
          ];
        });
        return result;
      },
      refresh: {
        keepPreviousData: true,
      },
    }
  );

  const weekPrevRef = useRef<any>(null);
  const weekNextRef = useRef<any>(null);
  useEffect(() => {
    if (swiperInstance && weekPrevRef.current) {
      swiperInstance.params.navigation.prevEl = weekPrevRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.render();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance, weekPrevRef.current]);

  useEffect(() => {
    if (swiperInstance && weekPrevRef.current) {
      swiperInstance.params.navigation.nextEl = weekNextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.render();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance, weekNextRef.current]);
  return (
    <ReactSwiper
      spaceBetween={20}
      slidesPerView={1.5}
      // loop={true}
      // autoplay={{
      //   delay: 2000,
      //   pauseOnMouseEnter: true,
      //   disableOnInteraction: false,
      // }}
      initialSlide={0}
      direction="horizontal"
      modules={[Autoplay, Navigation]}
      navigation={{
        prevEl: weekPrevRef.current,
        nextEl: weekNextRef.current,
      }}
      onBeforeInit={(swiper) => {
        const navigation: any = swiper?.params?.navigation;
        if (navigation) {
          navigation.prevEl = weekPrevRef.current;
          navigation.nextEl = weekNextRef.current;
        }
      }}
      onSwiper={setSwiperInstance}
    >
      {weekProducts?.map((productList: ProductData[], index: number) => (
        <SwiperSlide key={`week_${index}`}>
          <VerticalFlex gap={12}>
            {productList.map((product, idx) =>
              product ? (
                <FlexChild
                  key={`best_${product.id}_${index * 5 + idx}`}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <HorizontalFlex gap={10}>
                    <P padding={6}>{index * 5 + idx + 1}</P>
                    <Image src={product.thumbnail} size={51} />
                    <FlexChild>
                      <VerticalFlex
                        gap={1}
                        height={51}
                        justifyContent="space-between"
                      >
                        <FlexChild>
                          <P
                            weight={500}
                            fontSize={14}
                            lineClamp={2}
                            textOverflow="ellipsis"
                            overflow="hidden"
                          >
                            {product.title}
                          </P>
                        </FlexChild>
                        <FlexChild>
                          <VerticalFlex gap={1}>
                            <FlexChild>
                              <P
                                color="#AAA"
                                fontSize={10}
                                weight={500}
                                textDecoration={"line-through"}
                                hidden={product.discount_rate >= 1}
                              >
                                <Span>{product.price}</Span>
                                <Span>{storeData?.currency_unit}</Span>
                              </P>
                            </FlexChild>
                            <FlexChild>
                              <P>
                                <Span
                                  color="var(--main-color)"
                                  weight={600}
                                  fontSize={14}
                                  hidden={product.discount_rate >= 1}
                                  paddingRight={"0.5em"}
                                >
                                  {product.discount_rate}
                                </Span>
                                <Span fontSize={14} weight={600}>
                                  {product.discount_price}
                                </Span>
                                <Span fontSize={14} weight={600}>
                                  {storeData?.currency_unit}
                                </Span>
                              </P>
                            </FlexChild>
                          </VerticalFlex>
                        </FlexChild>
                      </VerticalFlex>
                    </FlexChild>
                  </HorizontalFlex>
                </FlexChild>
              ) : (
                <FlexChild key={`empty_${idx}`} />
              )
            )}
          </VerticalFlex>
        </SwiperSlide>
      ))}
    </ReactSwiper>
  );
}

export function ProductList({
  initPorudcts,
  initCondition,
}: {
  initPorudcts: Pageable;
  initCondition: any;
}) {
  const list = [
    {
      label: "추천순",
      value: {},
    },
    {
      label: "낮은가격순",
      value: {},
    },
    {
      label: "높은가격순",
      value: {},
    },
    {
      label: "판매량순",
      value: {},
    },
    {
      label: "신상품순",
      value: {},
    },
    {
      label: "리뷰많은순",
      value: {},
    },
  ];
  const observer = useRef<any>(null);
  const { storeData } = useStore();
  const [sort, setSort] = useState(list[0]);
  const [cookies, setCookie] = useCookies([Cookies.MAIN_PRODUCT_PAGE]);
  const { isReload, setIsReload } = useBrowserEvent();
  const { productList, page, maxPage, isLoading, Load, setPage } =
    useInfiniteData(
      "productList",
      (page) => {
        return {
          ...initCondition,
          pageSize: 10,
          pageNumber: page,
          store_id: storeData?.id,
          ...sort.value,
        };
      },
      (condition) => requester.getProducts(condition),
      (data) => data?.totalPages || 0,
      {
        fallbackData: [initPorudcts],
        refresh: {
          keepPreviousData: true,
        },
        onReprocessing: (data) => data?.content,
      }
    );
  useClientEffect(() => {
    setCookie(Cookies.MAIN_PRODUCT_PAGE, page, getCookieOption());
  }, [page]);
  useEffect(() => {
    if (isReload && cookies?.[Cookies.MAIN_PRODUCT_PAGE]) {
      const page = cookies[Cookies.MAIN_PRODUCT_PAGE];
      setIsReload(false);
      setPage(page);
    }
  }, [isReload, cookies]);
  return (
    <>
      <FlexChild>
        <FlexChild
          position="absolute"
          top={41}
          right={15}
          width={"max-content"}
          gap={7}
          onClick={() =>
            NiceModal.show("list", {
              list,
              selected: sort,
              onSelect: (item: any) => setSort(item),
            })
          }
        >
          <P size={14} weight={500} color="#888">
            {sort.label}
          </P>
          <Image
            src="/resources/images/down_arrow.png"
            width={8}
            height={"auto"}
          />
        </FlexChild>
        <MasonryGrid breakpoints={2} gap={"9px"}>
          {productList.map((product: ProductData) => (
            <ProductCard
              key={`list_${product?.id}`}
              width={"calc(50vw - 4.5px)"}
              product={product}
              currency_unit={storeData?.currency_unit}
              margin={"0 0 18px 0"}
            />
          ))}
        </MasonryGrid>
      </FlexChild>
      <Div
        position="absolute"
        bottom={11}
        left={"50%"}
        transform="translateX(-50%)"
        width={"max-content"}
        hidden={!isLoading}
      >
        <LoadingSpinner />
      </Div>
      <div
        style={{
          display: "flex",
          height: 1,
          width: "100vw",
        }}
        ref={useCallback(
          (node: any) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
              (entries) => {
                if (
                  entries[0].isIntersecting &&
                  page < maxPage - 1 &&
                  !isLoading
                ) {
                  Load();
                }
              },
              {
                root: null,
                rootMargin: "100px",
                threshold: 0.1,
              }
            );
            if (node) observer.current.observe(node);
          },
          [page, maxPage, isLoading]
        )}
      />
    </>
  );
}
