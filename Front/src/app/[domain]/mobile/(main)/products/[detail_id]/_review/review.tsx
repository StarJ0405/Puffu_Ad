"use client";
import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import InputTextArea from "@/components/inputs/InputTextArea";
import ListPagination from "@/components/listPagination/ListPagination";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import clsx from "clsx";
import styles from "./review.module.css";
import useNavigate from "@/shared/hooks/useNavigate";

export default function Review() {
  const navigate = useNavigate();

  const reviewTest = [
    // 리뷰 게시글 테스트용
    {
      name: "test",
      rating: 5,
      date: "2025-08-07",
      content: "옷 예쁘네요. 우리 존재 화이팅",
      photos: [],
      feedBack: {
        design: "마음에 쏙 들어요",
        Sturdiness: "부실해요",
        Upkeep: "쉽게 관리 가능해요",
      },
    },
    {
      name: "test",
      rating: 3,
      date: "2025-08-07",
      content: `
            구조가 매우 복잡한 만큼 뒷처리도 힘듬

            단단해서 잘 안늘어나려고 하고 벌릴순 있지만 타이트해서 스텐봉 샤워기헤드 대신 쓸만한거

            하나사서 꼽은다음 물 트는게 가장 효과적으로 세척할 수 있을거같다
         `,
      photos: [],
      feedBack: {
        design: "마음에 쏙 들어요",
        Sturdiness: "양품이에요",
        Upkeep: "보통이에요",
      },
    },
    {
      name: "test",
      rating: 4,
      date: "2025-08-07",
      content: "옷 예쁘네요. 우리 존재 화이팅",
      photos: [
        "/resources/images/dummy_img/review_img_01.png",
        "/resources/images/dummy_img/product_04.jpg",
        "/resources/images/dummy_img/review_img_02.jpg",
      ],
      feedBack: {
        design: "마음에 쏙 들어요",
        Sturdiness: "양품이에요",
        Upkeep: "관리하기 어려울 것 같아요",
      },
    },
    {
      name: "test",
      rating: 2,
      date: "2025-08-07",
      content:
        "배송 빠릅니다. 유명하다 해서 주문해봤습니다. 감사합니다. 다음에 또 이용하겠습니다. 최신제조 상품같습니다.",
      photos: ["/resources/images/dummy_img/review_img_01.png"],
      feedBack: {
        design: "마음에 쏙 들어요",
        Sturdiness: "보통이에요",
        Upkeep: "보통이에요",
      },
    },
  ];

  return (
    <VerticalFlex className={styles.review_wrap}>
      <VerticalFlex className={styles.review_top}>
        <FlexChild width={"auto"} gap={10}>
          <Image
            src={"/resources/icons/board/review_start_rating.png"}
            width={30}
          />
          <P className={styles.rating}>4.5</P>
          <P className={styles.total_rating}>
            총{" "}
            <Span color="#fff" weight={600}>
              34
            </Span>
            건 리뷰
          </P>
        </FlexChild>

        <Button
          className={styles.link_btn}
          onClick={() => navigate("/board/photoReview")}
        >
          포토후기 이동
        </Button>
      </VerticalFlex>

      <FlexChild justifyContent="center">
        <Button className={styles.review_btn}>리뷰 작성하기</Button>
      </FlexChild>

      <VerticalFlex className={styles.review_board}>
        <VerticalFlex className={styles.review_write}>
          <HorizontalFlex className={styles.feedback_select}>
            <FlexChild className={styles.select_item}>
              <Span className={styles.label}>평점</Span>
              <Select
                classNames={{
                  header: "web_select",
                  placeholder: "web_select_placholder",
                  line: "web_select_line",
                  arrow: "web_select_arrow",
                  search: "web_select_search",
                }}
                options={[
                  { value: "★★★★★(아주 만족)", display: "★★★★★(아주 만족)" },
                  { value: "★★★★(만족)", display: "★★★★(만족)" },
                  { value: "★★★(보통)", display: "★★★(보통)" },
                  { value: "★★(미흡)", display: "★★(미흡)" },
                  { value: "★(매우 미흡)", display: "★(매우 미흡)" },
                ]}
                // placeholder={'선택 안함'}
                // value={selectedMessageOption}
              />
            </FlexChild>

            <FlexChild className={styles.select_item}>
              <Span className={styles.label}>외형/디자인</Span>
              <Select
                classNames={{
                  header: "web_select",
                  placeholder: "web_select_placholder",
                  line: "web_select_line",
                  arrow: "web_select_arrow",
                  search: "web_select_search",
                }}
                options={[
                  { value: "마음에 쏙 들어요.", display: "마음에 쏙 들어요." },
                  { value: "보통이에요.", display: "보통이에요." },
                  {
                    value: "내 취향은 아니네요.",
                    display: "내 취향은 아니네요.",
                  },
                ]}
                // placeholder={'선택 안함'}
                // value={selectedMessageOption}
              />
            </FlexChild>

            <FlexChild className={styles.select_item}>
              <Span className={styles.label}>마감/내구성</Span>
              <Select
                classNames={{
                  header: "web_select",
                  placeholder: "web_select_placholder",
                  line: "web_select_line",
                  arrow: "web_select_arrow",
                  search: "web_select_search",
                }}
                options={[
                  { value: "양품이에요.", display: "양품이에요." },
                  { value: "보통이에요.", display: "보통이에요." },
                  { value: "부실해요.", display: "부실해요." },
                ]}
                // placeholder={'선택 안함'}
                // value={selectedMessageOption}
              />
            </FlexChild>

            <FlexChild className={styles.select_item}>
              <Span className={styles.label}>유지관리</Span>
              <Select
                classNames={{
                  header: "web_select",
                  placeholder: "web_select_placholder",
                  line: "web_select_line",
                  arrow: "web_select_arrow",
                  search: "web_select_search",
                }}
                options={[
                  {
                    value: "쉽게 관리 가능해요.",
                    display: "쉽게 관리 가능해요.",
                  },
                  { value: "보통이에요.", display: "보통이에요." },
                  {
                    value: "관리하기 어려울 것 같아요.",
                    display: "관리하기 어려울 것 같아요.",
                  },
                ]}
                // placeholder={'선택 안함'}
                // value={selectedMessageOption}
              />
            </FlexChild>
          </HorizontalFlex>

          <VerticalFlex className={clsx("textarea_box", styles.review_content)}>
            <InputTextArea
              width={"100%"}
              style={{ height: "150px" }}
              placeHolder="다른 고객님에게도 도움이 되도록 솔직한 평가를 남겨주세요."
            />
          </VerticalFlex>

          <FlexChild justifyContent="center" gap={10} cursor="pointer">
            <FlexChild gap={10} width={"auto"}>
              <Image
                src={"/resources/icons/board/file_upload_btn.png"}
                width={35}
              />
              <P size={16} color="#fff">
                이미지 첨부
              </P>
            </FlexChild>

            <P size={13} color="#797979">
              ※ 이미지는 최대 4개까지 등록이 가능해요.
            </P>
          </FlexChild>

          <Button className="post_btn" marginTop={25}>
            <P>리뷰 등록</P>
          </Button>
        </VerticalFlex>

        {/* 리스트 */}
        <VerticalFlex className={styles.review_list} gap={35}>
          {reviewTest.map((review, i) => (
            <HorizontalFlex key={i} gap={100} className={styles.item}>
              <VerticalFlex className={styles.item_header} gap={15}>
                <FlexChild>
                  <Image
                    src={`/resources/icons/board/review_start_${review.rating}.png`}
                    width={100}
                  />
                </FlexChild>

                <VerticalFlex gap={10}>
                  <FlexChild justifyContent="center">
                    <P color="#d7d7d7" size={18}>
                      {review.name}
                    </P>{" "}
                    {/* 닉네임 뒷글자 *** 표시 */}
                  </FlexChild>

                  <FlexChild justifyContent="center">
                    <P color="#797979" size={13}>
                      {review.date}
                    </P>
                  </FlexChild>
                </VerticalFlex>
              </VerticalFlex>

              <VerticalFlex gap={25}>
                <HorizontalFlex className={styles.feedback}>
                  <FlexChild className={styles.feed_item}>
                    <FlexChild className={styles.feed_title}>
                      <P>외형/디자인</P>
                    </FlexChild>

                    <FlexChild className={styles.feed_content}>
                      <P>{review.feedBack.design}</P>
                    </FlexChild>
                  </FlexChild>

                  <FlexChild className={styles.feed_item}>
                    <FlexChild className={styles.feed_title}>
                      <P>마감/내구성</P>
                    </FlexChild>

                    <FlexChild className={styles.feed_content}>
                      <P>{review.feedBack.Sturdiness}</P>
                    </FlexChild>
                  </FlexChild>

                  <FlexChild className={styles.feed_item}>
                    <FlexChild className={styles.feed_title}>
                      <P>유지관리</P>
                    </FlexChild>

                    <FlexChild className={styles.feed_content}>
                      <P>{review.feedBack.Upkeep}</P>
                    </FlexChild>
                  </FlexChild>
                </HorizontalFlex>

                <HorizontalFlex className={styles.content}>
                  {review.photos.length > 0 && (
                    <FlexChild
                      width={180}
                      className={styles.img_box}
                      cursor="pointer"
                    >
                      <Image
                        src={review.photos[0]}
                        width={"100%"}
                        height={"auto"}
                      />
                      <Div className={styles.img_length}>
                        {review.photos.length}
                      </Div>
                    </FlexChild>
                  )}

                  {/* 이미지 클릭하면 모달로 이미지 슬라이더 나타나서 크게 보여주기 */}
                  {/* {
                                 review.photos?.length > 0 && (
                                    review.photos?.map((img, j)=> (
                                       <FlexChild key={j} >
                                          <Image src={img} width={'100%'} height={'auto'} />
                                       </FlexChild>
                                    ))
                                 )
                              } */}
                  <P size={14} color="#fff" lineHeight={1.6}>
                    {review.content}
                  </P>
                </HorizontalFlex>
              </VerticalFlex>
            </HorizontalFlex>
          ))}
        </VerticalFlex>

        {/* <ListPagination /> */}
      </VerticalFlex>
    </VerticalFlex>
  );
}
