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
import styles from "./page.module.css";
import Input from "@/components/inputs/Input";
import InputNumber from "@/components/inputs/InputNumber";
import ListPagination from "@/components/listPagination/ListPagination";

type Option = {
  name: string;
  quantity: number;
  price: string;
};

export function OptionItem({item} : {item : Option}) {

   return (
      <HorizontalFlex>
         <InputNumber />
         <FlexChild className={styles.txt_item}>
            <P>{item.name}</P>
            <Span>{item.quantity}개</Span>
            <Span>+ {item.price}원</Span>
         </FlexChild>
      </HorizontalFlex>
   )
}

export function BuyButtonGroup() {
   return(
      <HorizontalFlex className={styles.buyButton_box}>
         <FlexChild width={'auto'}>
            <Button className={styles.heart_btn}>
               <Image src={'/resources/icons/main/product_heart_icon.png'} width={30} />
               {/* <Image src={'/resources/icons/main/product_heart_icon_active.png'} width={30} /> */}
            </Button>
         </FlexChild>

         <FlexChild>
            <Button className={styles.cart_btn}>
               <P>장바구니</P>
            </Button>
         </FlexChild>

         <FlexChild>
            <Button className={styles.buy_btn}>
               <P>바로 구매</P>
            </Button>
         </FlexChild>
      </HorizontalFlex>
   )
}

export function ContentView() {

   const reviewTest = [ // 리뷰 게시글 테스트용
      {
         name: 'test', 
         rating: 5, 
         date: '2025-08-07', 
         content: '옷 예쁘네요. 우리 존재 화이팅', 
         photos: [],
      },
      {
         name: 'test', 
         rating: 3, 
         date: '2025-08-07', 
         content: '옷 예쁘네요. 우리 존재 화이팅', 
         photos: [],
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
      },
      {
         name: 'test', 
         rating: 2, 
         date: '2025-08-07', 
         content: '옷 예쁘네요. 우리 존재 화이팅', 
         photos: [
            '/resources/images/dummy_img/review_img_01.png',
         ],
      },
   ]


   return (
      <>
         { // 상세정보
            1 < 0 && (
               <VerticalFlex>
                  <FlexChild>
                     <Image src={'/resources/images/dummy_img/description_img.png'} width={'100%'} />
                  </FlexChild>
               </VerticalFlex>
            )
         }

         { // 사용후기
            1 > 0 && (
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

                        <HorizontalFlex className={styles.select_box}>
                           <FlexChild className={styles.select_item}>
                              <Span>평점</Span>
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
                              <Span>외형/디자인</Span>
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
                              <Span>마감/내구성</Span>
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
                              <Span>유지관리</Span>
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

                        <VerticalFlex className={styles.review_content}>
                           <textarea placeholder="다른 고객님에게도 도움이 되도록 솔직한 평가를 남겨주세요." ></textarea>
                           <Span>0/30</Span>
                        </VerticalFlex>

                        <FlexChild className="file_upload">
                           <Image src={'/resources/icons/board/file_upload_btn.png'} width={53} />
                           <P size={16} color="#fff">이미지 첨부</P>
                           <P size={13} color="#797979">※ 이미지는 최대 4개까지 등록이 가능해요.</P>
                        </FlexChild>

                        <Button className="post_btn">
                           <P>리뷰 등록</P>
                        </Button>
                     </VerticalFlex>

                     <VerticalFlex className={styles.review_list}>

                        {
                           reviewTest.map((review, i)=> (
                              <VerticalFlex key={i}>
                                 <HorizontalFlex>
                                    <FlexChild>
                                       <Image src={`/resources/icons/board/review_start_${review.rating}.png`} width={100} />
                                       <P>{review.name}</P> {/* 닉네임 뒷글자 *** 표시 */}
                                    </FlexChild>

                                    <FlexChild>
                                       <P>{review.date}</P>
                                    </FlexChild>
                                 </HorizontalFlex>

                                 <FlexChild className={styles.content}>
                                    {
                                       review.photos.length > 0 && (
                                          <FlexChild width={160}>
                                             <Image src={review.photos[0]} width={'100%'} height={'auto'} />
                                             <Div>
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
                                    <P>{review.content}</P>
                                 </FlexChild>
                              </VerticalFlex>
                           ))
                        }
                     </VerticalFlex>

                     <ListPagination />
                  </VerticalFlex>
               </VerticalFlex>
            )
         }
      </>
      // <Description />
   )
}