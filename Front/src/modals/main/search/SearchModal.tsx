import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import ProductCard from "@/components/card/dummyProductCard";
import P from "@/components/P/P";
import ModalBase from "@/modals/ModalBase";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { useStore } from "@/providers/StoreProvider/StorePorivderClient";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import { Storage } from "@/shared/utils/Data";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef, useState } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper as ReactSwiper, SwiperSlide } from "swiper/react";
import styles from "./SearchModal.module.css";

const SearchModal = NiceModal.create(() => {
  const [withHeader, withFooter] = [false, false];
  const withCloseButton = false;
  const clickOutsideToClose = true;
  const title = "";
  const buttonText = "close";
  const modal = useRef<any>(null);
  const { storeData } = useStore();
  const { userData } = useAuth();
  const [recents, setRecents] = useState<string[]>([]);
  const navigate = useNavigate();
  const start_date = new Date();
  start_date.setHours(0, 0, 0, 0);
  start_date.setMonth(start_date.getMonth() - 1);
  const [search, setSearch] = useState<string>("");
  const { recommends } = useData(
    "recommends",
    { store_id: storeData?.id, start_date },
    (condition) => requester.getKeywords(condition),
    {
      onReprocessing: (data) => data?.content,
    }
  );
  const onClose = () => {
    modal.current.close();
  };

  useEffect(() => {
    if (storeData) {
      const keywords = window.localStorage.getItem(
        `${Storage.KEYWORDS}_${storeData.id}`
      );
      setRecents(keywords ? JSON.parse(keywords) : []);
    }
  }, [storeData]);
  const onSearch = () => {
    if (!storeData) return;
    let value: string = search;
    if (!value) return;
    value = value.trim();
    if (value === "") return;
    if (userData)
      requester.addKeyword({
        store_id: storeData.id,
        keyword: value,
      });
    window.localStorage.setItem(
      `${Storage.KEYWORDS}_${storeData.id}`,
      JSON.stringify(Array.from(new Set([value, ...recents])).slice(0, 10))
    );
    // 이동
    modal.current.close();
    navigate(`/search?q=${value}`);
  };
  return (
    <ModalBase
      zIndex={10055}
      ref={modal}
      width={"100vw"}
      height={"100dvh"}
      withHeader={withHeader}
      withFooter={withFooter}
      withCloseButton={withCloseButton}
      clickOutsideToClose={clickOutsideToClose}
      title={title}
      buttonText={buttonText}
    >
      <FlexChild backgroundColor={"#FFF"}>
        <VerticalFlex>
          <FlexChild
            gap={15}
            className={styles.searchHeader}
            paddingBottom={20}
          >
            <Image
              src="/resources/images/left_arrow.png"
              width={20}
              onClick={() => {
                modal.current.close();
              }}
            />
            <Div className={styles.inputWrapper}>
              <Input
                value={search}
                onChange={(value) => setSearch(value as string)}
                width={"100%"}
                className={styles.input}
                placeHolder="원하시는 상품을 검색해보세요"
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearch();
                }}
              />
              <Image
                hidden={!search}
                src="/resources/icons/closeCircle.png"
                size={14}
                className={styles.close}
                onClick={() => setSearch("")}
              />
              <Image
                src={"/resources/icons/search_gray.png"}
                size={16}
                className={styles.search}
                onClick={() => onSearch()}
              />
            </Div>
          </FlexChild>

          <FlexChild
            alignItems="flex-end"
            padding={"9px 15px 12px 15px"}
            hidden={recents?.length === 0}
          >
            <P className={styles.title}>최근 검색어</P>
            <P
              className={styles.allDelete}
              marginLeft={"auto"}
              onClick={() => {
                setRecents([]);
                window.localStorage.removeItem(
                  `${Storage.KEYWORDS}_${storeData?.id}`
                );
              }}
            >
              전체삭제
            </P>
          </FlexChild>
          <FlexChild
            padding={"0px 15px 30px 15px"}
            gap={10}
            flexWrap="wrap"
            hidden={recents?.length === 0}
          >
            {recents.map((recent) => (
              <FlexChild
                key={recent}
                className={styles.recent}
                gap={10}
                onClick={() => {
                  modal.current.close();
                  navigate(`/search?q=${recent}`);
                }}
              >
                <P>{recent}</P>
                <Image
                  src="/resources/icons/closeBtn.png"
                  size={8}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const filter = recents.filter(
                      (_recent) => _recent !== recent
                    );
                    setRecents(filter);
                    window.localStorage.setItem(
                      `${Storage.KEYWORDS}_${storeData?.id}`,
                      JSON.stringify(filter)
                    );
                  }}
                />
              </FlexChild>
            ))}
          </FlexChild>

          <FlexChild
            padding={"9px 15px 12px 15px"}
            hidden={recommends?.length === 0}
          >
            <P className={styles.title}>추천 키워드</P>
          </FlexChild>
          <FlexChild
            padding={"0px 15px"}
            gap={10}
            flexWrap="wrap"
            hidden={recommends?.length === 0}
          >
            {(recommends || [])
              .sort((r1: Recommend, r2: Recommend) => {
                if (r1.popular !== r2.popular) return r2.popular - r1.popular;
                else
                  return (
                    new Date(r2.created_at).getTime() -
                    new Date(r1.created_at).getTime()
                  );
              })
              .map((recommend: Recommend) => (
                <FlexChild
                  key={recommend.keyword}
                  className={styles.recommend}
                  onClick={() => {
                    modal.current.close();
                    navigate(`/search?q=${recommend.keyword}`);
                  }}
                >
                  <P>{recommend.keyword}</P>
                </FlexChild>
              ))}
          </FlexChild>
          <Div
            className={styles.space}
            marginTop={30}
            hidden={recents?.length === 0 && recommends?.length === 0}
          />
          <Recents onClose={onClose} />
        </VerticalFlex>
      </FlexChild>
    </ModalBase>
  );
});

function Recents({ onClose }: { onClose: () => void }) {
  const { storeData } = useStore();
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const navigate = useNavigate();
  const { recents } = useData(
    "recents",
    { pageSize: 10, store_id: storeData?.id },
    (condition) => requester.getProducts(condition),
    {
      onReprocessing: (data) => data?.content || [],
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
    <VerticalFlex className={styles.recentWrapper}>
      <FlexChild paddingBottom={8}>
        <P className={styles.recentTitle}>최근 본 상품</P>
      </FlexChild>
      <FlexChild>
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
          {recents?.map((product: ProductData) => (
            <SwiperSlide key={`new_${product?.id}`}>
              <ProductCard
                product={product}
                currency_unit={storeData?.currency_unit}
                onClick={() => {
                  onClose();
                  navigate(`/product/${product.id}`);
                }}
              />
            </SwiperSlide>
          ))}
        </ReactSwiper>
      </FlexChild>
    </VerticalFlex>
  );
}
export default SearchModal;
