"use client"
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Input from "@/components/inputs/Input";
import Select from "@/components/select/Select";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import boardHeader from './boardHeader.module.css';
import boardStyle from './boardGrobal.module.css'


// function linkTabActive() {
//    if(pathname === 'notice') {
//       return styles.active;
//    }
// }


// pathname으로 url 오면 active 처리

export function BoardNavi() {

   const pathname = usePathname();

   const tabUrls = [
      {link: '/board/notice', name: '공지사항'},
      {link: '/board/inquiry', name: '1:1문의'},
      {link: '/board/event', name: '이벤트'},
   ]

   return (
      <HorizontalFlex className={boardHeader.board_navi}>

         {
            tabUrls.map((item, i)=> (
               <FlexChild key={i} className={clsx(boardHeader.item, (pathname.startsWith(item.link) && boardHeader.active))}>
                  <Link href={item.link}>{item.name}</Link>
               </FlexChild>
            ))
         }
      </HorizontalFlex>
   )
}

export function SelectBox() {

   return (
      <>
         <FlexChild gap={10} className={boardStyle.search_box}>
            <FlexChild width={'auto'}>
               <Select
                  classNames={{
                  header: 'web_select',
                  placeholder: 'web_select_placholder',
                  line: 'web_select_line',
                  arrow: 'web_select_arrow',
                  search: 'web_select_search',
                  }}
                  width={80}
                  options={[
                  { value: "제목", display: "제목" },
                  { value: "내용", display: "내용" },
                  { value: "작성자", display: "작성자" },
                  ]}
                  placeholder={'선택'}
                  // value={selectedMessageOption}
               />
            </FlexChild>

            <Input
               type={"search"}
            />
            <Button className={boardStyle.searchBtn}>검색</Button>
         </FlexChild>
      </>
   )
}
