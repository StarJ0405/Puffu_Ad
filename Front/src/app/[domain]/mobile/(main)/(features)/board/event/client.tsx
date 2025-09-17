"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import ListPagination from "@/components/listPagination/ListPagination";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import Link from "next/link";
import boardStyle from "../boardGrobal.module.css";
import styles from "./event.module.css";
import { useParams } from "next/navigation";
import useNavigate from "@/shared/hooks/useNavigate";

// 게시판 리스트 -----------------------------------------------
<<<<<<< HEAD
// export function BoardTitleBox() {
//   return (
//     <HorizontalFlex className={clsx(boardStyle.board_titleBox, styles.event_titleBox)}>
//       <FlexChild>
//         <h3>이벤트</h3>
//       </FlexChild>
//     </HorizontalFlex>
//   );
// }
=======
export function BoardTitleBox() {
  return (
    <HorizontalFlex
      className={clsx(boardStyle.board_titleBox, styles.event_titleBox)}
    >
      <FlexChild>
        {/* 여기 현재 path 주소에 맞게 이름 바뀌게 해야 함. */}
        <h3>이벤트</h3>
      </FlexChild>
    </HorizontalFlex>
  );
}
>>>>>>> 9675c82a913cf366dda28c6710abf591cd41f2a3

export function GalleryTable() {
  const event = [
    {
      thumbnail: "/resources/images/dummy_img/event_01.png",
      title: "세계 고양이의 날 기념 할인",
      subTitle: "여름 할인 상품 확인하세요!",
      durationStart: "2025.07.01 00:00",
      durationEnd: "2025.10.31 23:59",
    },

    {
      thumbnail: "/resources/images/dummy_img/event_02.png",
      title: "무더운 여름 잊게 해줄 대박 세일!",
      subTitle: "여름 할인 상품 확인하세요!",
      durationStart: "2025.07.01 00:00",
      durationEnd: "2025.10.31 23:59",
    },

    {
      thumbnail: "/resources/images/dummy_img/event_03.png",
      title: "2024년 설날 10% 할인쿠폰",
      subTitle: "설날 특별할인을 만나보세요.",
      durationStart: "2025.07.01 00:00",
      durationEnd: "2025.08.31 23:59",
    },

    {
      thumbnail: "/resources/images/dummy_img/event_04.png",
      title: "푸푸토이 땡쿤데이",
      subTitle: "매월 단 2일만 돌아오는 땡 잡은 날",
      durationStart: "2025.07.01 00:00",
      durationEnd: "2025.10.31 23:59",
    },

    {
      thumbnail: "/resources/images/dummy_img/event_05.png",
      title: "우머나이저 7일간 20%할인!",
      subTitle: "우머나이저 기획전 오픈 기념 할인 이벤트",
      durationStart: "2025.07.01 00:00",
      durationEnd: "2025.10.31 23:59",
    },
  ];

  const navigate = useNavigate();

  return (
    <VerticalFlex>
      {/* <HorizontalFlex className={styles.event_tab}>
        <FlexChild className={clsx(styles.tab_btn, styles.active)}>
          <P>전체보기</P>
        </FlexChild>

        <FlexChild className={styles.tab_btn}>
          <P>진행중인 이벤트</P>
        </FlexChild>

        <FlexChild className={styles.tab_btn}>
          <P>종료된 이벤트</P>
        </FlexChild>
      </HorizontalFlex> */}

      <FlexChild>
        {event.length > 0 ? (
          <div
            className={styles.gallery_grid_container}
            style={{ "--column": "4" } as React.CSSProperties} // 너비에 몇개 늘어놓을 건지 갯수
          >
            {event.map((item, i) => (
              <GalleryItem key={i} item={item} />
            ))}
          </div>
        ) : (
          <NoContent type={"게시판"} />
        )}
      </FlexChild>

      <FlexChild className={boardStyle.list_bottom_box}>
        {/* <ListPagination /> */}
      </FlexChild>
    </VerticalFlex>
  );
}

type EventItem = {
  // 고칠때 지워도 무방함
  thumbnail: string;
  title: string;
  subTitle: string;
  durationStart: string;
  durationEnd: string;
};

// 갤러리 아이템
export function GalleryItem({ item }: { item: EventItem }) {
  const { detail_id } = useParams();
  const navigate = useNavigate();

  return (
    <VerticalFlex gap={17} className={styles.gallery_item}>
      <FlexChild
        className={styles.thumb_frame}
        onClick={() => navigate(`/board/event/${detail_id}`)}
      >
        {/* <Link href={'/board/detail/event_01'}> */}
        <Image src={item.thumbnail} width={"100%"} height={"auto"} />
        {/* {item.durationEnd && (
             // 현재 날짜가 이벤트 종료기간을 지났을때 이 이미지가 나타나기
             // 실시간으로 시간 1초라도 기간 지나면 바로 업데이트해서 나타나게 해야 할지.
             //클릭해서 내용은 볼 수 있음
             <Image
               className={styles.durationEnd_img}
               src={"/resources/images/event_out.png"}
               width={"100%"}
               height={"auto"}
             />
           )} */}
        {/* </Link> */}
      </FlexChild>

      <VerticalFlex className={styles.item_content}>
        <FlexChild className={styles.title}>
          {/* <Link href={'/board/detail/event_01'}> */}
          <P>{detail_id ?? item.title}</P>
          {/* </Link> */}
        </FlexChild>

        <FlexChild className={styles.subTitle}>
          <P>{item.subTitle}</P>
        </FlexChild>

        <FlexChild className={styles.duration}>
          <P>{item.durationStart}</P>
          <Span>~</Span>
          <P>{item.durationEnd}</P>
        </FlexChild>
      </VerticalFlex>
    </VerticalFlex>
  );
}

// 게시판 리스트 end -----------------------------------------------
