import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import StarRate from "@/components/star/StarRate";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef } from "react";
import ModalBase from "../../ModalBase";
import styles from "./ReviewModal.module.css";
import { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import clsx from "clsx";

const ReviewModal = NiceModal.create(
  ({ review, onSuccess }: { review: ReviewData; onSuccess?: () => void }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "리뷰 상세";
    const buttonText = "close";
    const modal = useRef<any>(null);
    const swiperRef = useRef<SwiperType | null>(null);

    useEffect(() => {
      if (!review) {
        modal.current.close();
      }
    }, [review]);
    const paintBullets = (swiper: SwiperType) => {
      const bullets = swiper.pagination?.el?.querySelectorAll(
        ".swiper-pagination-bullet"
      );
      if (!bullets) return;
      bullets.forEach((el) => {
        const bullet = el as HTMLElement;
        bullet.style.setProperty("background-color", "#fff", "important");
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
      <ModalBase
        borderRadius={10}
        zIndex={10055}
        ref={modal}
        width={width}
        height={height}
        withHeader={withHeader}
        withFooter={withFooter}
        withCloseButton={withCloseButton}
        clickOutsideToClose={clickOutsideToClose}
        title={title}
        buttonText={buttonText}
      >
        <VerticalFlex
          padding={"10px 20px"}
          maxHeight={"80vh"}
          overflow="auto"
          overflowY="auto"
        >
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>리뷰상품</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <P>{review?.item?.title}</P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>작성자</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <P>{review?.user?.name}</P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>평점</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <StarRate width={83} score={review?.star_rate} readOnly />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>내용</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <P>{review?.content}</P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild hidden={review?.images?.length === 0}>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>포토({review?.images?.length})</P>
              </FlexChild>
              <FlexChild
                className={clsx(styles.content, styles.viewer_swiper)}
                id="view_swiper"
              >
                <Swiper
                  loop
                  slidesPerView={1}
                  speed={600}
                  spaceBetween={0}
                  modules={[Pagination, Autoplay, Navigation]}
                  pagination={{ dynamicBullets: true, clickable: true }}
                  navigation={{
                    prevEl: `#view_swiper .${styles.prevBtn}`,
                    nextEl: `#view_swiper .${styles.nextBtn}`,
                  }}
                  autoplay={false}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  onAfterInit={paintBullets}
                  onSlideChange={paintBullets}
                  onPaginationUpdate={paintBullets}
                >
                  {review.images?.map((src) => (
                    <SwiperSlide key={src} className={styles.swiper_slide}>
                      <FlexChild
                        height={"100%"}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Image
                          src={src}
                          maxWidth={"100%"}
                          maxHeight={"100%"}
                          objectFit="contain"
                        />
                      </FlexChild>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default ReviewModal;
