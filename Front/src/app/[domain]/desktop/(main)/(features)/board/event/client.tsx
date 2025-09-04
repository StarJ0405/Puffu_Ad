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
import NoContent from "@/components/noContent/noContent";
import { usePathname } from "next/navigation";
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
import style from "./page.module.css";
import boardStyle from "../boardGrobal.module.css";
import Input from "@/components/inputs/Input";
import ListPagination from "@/components/listPagination/ListPagination";
import Link from "next/link";



// 게시판 리스트 -----------------------------------------------
export function BoardTitleBox() {
   return (
      <HorizontalFlex className={boardStyle.board_titleBox}>
         <FlexChild>
            {/* 여기 현재 path 주소에 맞게 이름 바뀌게 해야 함. */}
            <h3>1:1문의</h3>
         </FlexChild>

         <FlexChild gap={10} className={boardStyle.search_box}>
            <FlexChild width={'auto'}>
               <SelectBox />
            </FlexChild>

            <Input type={'search'} placeHolder={'검색 내용을 입력해 주세요.'}></Input>
            <Link href={'/board/notice/noticeWrite'}>
               <Button className={boardStyle.searchBtn}>검색</Button>
            </Link>
         </FlexChild>
      </HorizontalFlex>
   )
}


export function SelectBox() {

   const [selectedMessageOption, setSelectedMessageOption] = useState("");

   return (
      <>
         {/* 처음 기본 선택지 제목이어야 함. */}
         <Select
            classNames={{
               header: boardStyle.search_select_body,
            }}
            options={[
               { value: "제목", display: "제목" },
               { value: "내용", display: "내용" },
               { value: "작성자", display: "작성자" },
            ]}
            // placeholder={'선택 안함'}
            value={selectedMessageOption}
         />
      </>
   )
}

export function GalleryTable() {

   
   const event = [
      
      {
         thumbnail: '/resources/images/dummy_img/event_01.png', 
         title: '무더운 여름 잊게 해줄 대박 세일!', 
         subTitle: '여름 할인 상품 확인하세요!', 
         durationStart: '2025.07.01 00:00',
         durationEnd: '2025.10.31 23:59'
      },

      {
         thumbnail: '/resources/images/dummy_img/event_02.png', 
         title: '무더운 여름 잊게 해줄 대박 세일!', 
         subTitle: '여름 할인 상품 확인하세요!', 
         durationStart: '2025.07.01 00:00',
         durationEnd: '2025.10.31 23:59'
      },

      {
         thumbnail: '/resources/images/dummy_img/event_03.png', 
         title: '무더운 여름 잊게 해줄 대박 세일!', 
         subTitle: '여름 할인 상품 확인하세요!', 
         durationStart: '2025.07.01 00:00',
         durationEnd: '2025.08.31 23:59'
      },

      {
         thumbnail: '/resources/images/dummy_img/event_04.png', 
         title: '무더운 여름 잊게 해줄 대박 세일!', 
         subTitle: '여름 할인 상품 확인하세요!', 
         durationStart: '2025.07.01 00:00',
         durationEnd: '2025.10.31 23:59'
      },

      {
         thumbnail: '/resources/images/dummy_img/event_05.png', 
         title: '무더운 여름 잊게 해줄 대박 세일!', 
         subTitle: '여름 할인 상품 확인하세요!', 
         durationStart: '2025.07.01 00:00',
         durationEnd: '2025.10.31 23:59'
      },
   ]

   return (
      <VerticalFlex>
         <HorizontalFlex className={style.event_tab}>
            <FlexChild className={clsx(style.tab_btn, style.active)}>
               <P>전체보기</P>
            </FlexChild>

            <FlexChild className={style.tab_btn}>
               <P>진행중인 이벤트</P>
            </FlexChild>

            <FlexChild className={style.tab_btn}>
               <P>종료된 이벤트</P>
            </FlexChild>
         </HorizontalFlex>

         <FlexChild>
            {event.length > 0 ? (
            <div className={style.gallery_grid_container}>
               {
                  event.map((item, i)=> (
                     <VerticalFlex key={i}>
                        <FlexChild className={style.thumb_frame}>
                           <Image src={item.thumbnail} width={'100%'} height={'auto'} />
                           {
                              item.durationEnd && ( 
                                 // 현재 날짜가 이벤트 종료기간을 지났을때 이 이미지가 나타나기
                                 // 실시간으로 시간 1초라도 기간 지나면 바로 업데이트해서 나타나게 해야 할지.
                                 //클릭해서 내용은 볼 수 있음
                                 <Image 
                                    className={style.durationEnd_img} 
                                    src={'/resources/images/event_out.png'} 
                                    width={'100%'}
                                    height={'auto'} 
                                 />
                              )
                           }
                        </FlexChild>
                       
                       <VerticalFlex>
                           <FlexChild>
                              <P>{item.title}</P>
                           </FlexChild>

                           <FlexChild>
                              <P>{item.subTitle}</P>
                           </FlexChild>

                           <FlexChild>
                              <P>{item.durationStart}</P>
                              <Span>~</Span>
                              <P>{item.durationEnd}</P>
                           </FlexChild>
                       </VerticalFlex>
                     </VerticalFlex>
                  ))
               }
            </div>
            ) : (
               <NoContent />
            )}
         </FlexChild>
            

               
         <FlexChild className={boardStyle.list_bottom_box}>
            <ListPagination />

            {/* 누르면 글쓰기로 연결 관리자만 보이게 하기 */}
            <Button className={boardStyle.write_btn}>글쓰기</Button>
         </FlexChild>
      </VerticalFlex>
   )
}


// 게시판 리스트 end -----------------------------------------------