"use client"
import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "@/components/card/ProductCard";
import Input from "@/components/inputs/Input";
import InputNumber from "@/components/inputs/InputNumber";
import ListPagination from "@/components/listPagination/ListPagination";
import styles from './review.module.css'
import InputTextArea from "@/components/inputs/InputTextArea";

export default function Review() {

   const reviewTest = [ // 리뷰 게시글 테스트용
      {
         name: 'test', 
         rating: 5, 
         date: '2025-08-07', 
         content: '옷 예쁘네요. 우리 존재 화이팅', 
         photos: [],
         feedBack: {
            design: '마음에 쏙 들어요',
            Sturdiness: '부실해요',
            Upkeep: '쉽게 관리 가능해요',
         },
      },
      {
         name: 'test', 
         rating: 3, 
         date: '2025-08-07', 
         content: `
            아무것도 데우지 않고 젤만 넣은다음 바로 사용함

            일단 오로치는 부드럽지만 압박감이 강함, 좁은것도 한몫하지만

            실리콘이 단단하게느껴진다고 해야되나 그게 꽉 잡아줘서 기믹이 더 잘느껴짐

            초입에 느껴지는 주름은 귀두를 긁어주면서 넣은걸 반겨줌



            넣다보면 리뷰상에 산딸기~ 라고 하는 튀어나온 구조물이 있는데

            귀두와 기둥이 움직이면 뭔가 막혀있는걸 밀고 들어가는 느낌, 기둥을 눌러서 압박해줌

            이게 빠르게 움직일땐 잘모르지만 천천히 움직여보면

            확연하게 느껴짐 막혀있는걸 한번 뚫고 움직이는 듯한 느낌

            크게 튀어나와있는 부분을 반대로 뒤집어도 반대편엔 작게 튀어나온 돌기가 있는데

            그냥 큰게 귀두 위로 가게하는게 정배인느낌



            중간부분은 박스에 나와있는 단면을 보면 알겠지만 좁다

            근데 재잴 특성상 단단함도 있어서 확연하게 조여줌

            주름이랑 압박감이 확연하게 느껴지고



            끝부분은 넓어진 공간에 귀두를 감싸는듯한 구조, 여기도 주름이 있음

            근데 좁다가 확 넓어지니까 별 느낌이 안나긴함

            두께가 두꺼운사람들은 느껴질지도

            대신 이만큼 넣으면 중간부에 튀어나온 구조물과 압박감이 기둥 전체에 느껴짐



            구조가 매우 복잡한 만큼 뒷처리도 힘듬

            단단해서 잘 안늘어나려고 하고 벌릴순 있지만 타이트해서 스텐봉 샤워기헤드 대신 쓸만한거

            하나사서 꼽은다음 물 트는게 가장 효과적으로 세척할 수 있을거같다
         `, 
         photos: [],
         feedBack: {
            design: '마음에 쏙 들어요',
            Sturdiness: '양품이에요',
            Upkeep: '보통이에요',
         },
      },
      {
         name: 'test', 
         rating: 4, 
         date: '2025-08-07', 
         content: '옷 예쁘네요. 우리 존재 화이팅', 
         photos: [
            '/resources/images/dummy_img/review_img_01.png',
            '/resources/images/dummy_img/product_04.jpg',
            '/resources/images/dummy_img/review_img_02.jpg',
         ],
         feedBack: {
            design: '마음에 쏙 들어요',
            Sturdiness: '양품이에요',
            Upkeep: '관리하기 어려울 것 같아요',
         },
      },
      {
         name: 'test', 
         rating: 2, 
         date: '2025-08-07', 
         content: '배송 빠릅니다. 유명하다 해서 주문해봤습니다. 감사합니다. 다음에 또 이용하겠습니다. 최신제조 상품같습니다.', 
         photos: [
            '/resources/images/dummy_img/review_img_01.png',
         ],
         feedBack: {
            design: '마음에 쏙 들어요',
            Sturdiness: '보통이에요',
            Upkeep: '보통이에요',
         },
      },
   ]

   return (
      <VerticalFlex className={styles.review_wrap}>
         <VerticalFlex className={styles.review_top}>
            <FlexChild width={'auto'} gap={10}>
               <Image src={'/resources/icons/board/review_start_rating.png'} width={35} />
               <P className={styles.rating}>
                  4.5
               </P>
               <P className={styles.total_rating}>
                  총 <Span color="#fff" weight={600}>34</Span>건 리뷰
               </P>
            </FlexChild>
            
            <Button className={styles.link_btn}>
               포토후기 이동
            </Button>
         </VerticalFlex>

         <VerticalFlex className={styles.review_board}>
            <VerticalFlex className={styles.review_write}>
               <HorizontalFlex className={styles.feedback_select}>
                  <FlexChild className={styles.select_item}>
                     <Span className={styles.label}>평점</Span>
                     <Select
                        classNames={{
                           search: styles.requester_input_body
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
                           search: styles.requester_input_body
                        }}
                        options={[
                           { value: "마음에 쏙 들어요.", display: "마음에 쏙 들어요." },
                           { value: "보통이에요.", display: "보통이에요." },
                           { value: "내 취향은 아니네요.", display: "내 취향은 아니네요." },
                        ]}
                        // placeholder={'선택 안함'}
                        // value={selectedMessageOption}
                     />
                  </FlexChild>

                  <FlexChild className={styles.select_item}>
                     <Span className={styles.label}>마감/내구성</Span>
                     <Select
                        classNames={{
                           search: styles.requester_input_body
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
                           search: styles.requester_input_body
                        }}
                        options={[
                           { value: "쉽게 관리 가능해요.", display: "쉽게 관리 가능해요." },
                           { value: "보통이에요.", display: "보통이에요." },
                           { value: "관리하기 어려울 것 같아요.", display: "관리하기 어려울 것 같아요." },
                        ]}
                        // placeholder={'선택 안함'}
                        // value={selectedMessageOption}
                     />
                  </FlexChild>
               </HorizontalFlex>

               <VerticalFlex className={clsx('textarea_box', styles.review_content)}>
                  <InputTextArea width={'100%'} style={{height: '150px'}} placeHolder="다른 고객님에게도 도움이 되도록 솔직한 평가를 남겨주세요." />
               </VerticalFlex>

               <FlexChild justifyContent="center" gap={10} cursor="pointer">
                  <FlexChild gap={10} width={'auto'}>
                     <Image src={'/resources/icons/board/file_upload_btn.png'} width={35} />
                     <P size={16} color="#fff">이미지 첨부</P>
                  </FlexChild>

                  <P size={13} color="#797979">※ 이미지는 최대 4개까지 등록이 가능해요.</P>                 
               </FlexChild>

               <Button className="post_btn" marginTop={25}>
                  <P>리뷰 등록</P>
               </Button>
            </VerticalFlex>

            <VerticalFlex className={styles.review_list} gap={35}>

               {
                  reviewTest.map((review, i)=> (
                     <VerticalFlex key={i} gap={20} className={styles.item}>
                        <HorizontalFlex className={styles.item_header}>
                           <FlexChild gap={15}>
                              <Image src={`/resources/icons/board/review_start_${review.rating}.png`} width={100} />
                              <P color="#d7d7d7" size={13}>{review.name}</P> {/* 닉네임 뒷글자 *** 표시 */}
                           </FlexChild>

                           <FlexChild>
                              <P color="#797979" size={13}>{review.date}</P>
                           </FlexChild>
                        </HorizontalFlex>

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

                        <VerticalFlex className={styles.content}>
                           {
                              review.photos.length > 0 && (
                                 <FlexChild width={180} className={styles.img_box} cursor="pointer">
                                    <Image src={review.photos[0]} width={'100%'} height={'auto'} />
                                    <Div className={styles.img_length}>
                                       {review.photos.length}
                                    </Div>
                                 </FlexChild>
                              )
                           }

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
                           <P size={14} color="#bfbfbf" lineHeight={1.6}>{review.content}</P>
                        </VerticalFlex>
                     </VerticalFlex>
                  ))
               }
            </VerticalFlex>

            <ListPagination />
         </VerticalFlex>
      </VerticalFlex>
   )

}