"use client";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import usePageData from "@/shared/hooks/data/usePageData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import { useState } from "react";
import boardStyle from "../boardGrobal.module.css";
import styles from "./event.module.css";

// 게시판 리스트 -----------------------------------------------
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

export function GalleryTable({
  initCondition,
  initNotices,
}: {
  initCondition: any;
  initNotices: Pageable;
}) {
  const [active, setActive] = useState<"all" | "before" | "continue" | "end">(
    "all"
  );
  const { notices, page, maxPage, origin } = usePageData(
    "notices",
    (pageNumber) => ({
      ...initCondition,
      pageNumber,
      active,
    }),
    (condition) => requester.getNotices(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initNotices,
    }
  );

  return (
    <VerticalFlex>
      <HorizontalFlex className={styles.event_tab}>
        <FlexChild
          className={clsx(styles.tab_btn, {
            [styles.active]: active === "all",
          })}
          onClick={() => setActive("all")}
        >
          <P>전체보기</P>
        </FlexChild>
        <FlexChild
          className={clsx(styles.tab_btn, {
            [styles.active]: active === "before",
          })}
          onClick={() => setActive("before")}
        >
          <P>예정된 이벤트</P>
        </FlexChild>
        <FlexChild
          className={clsx(styles.tab_btn, {
            [styles.active]: active === "continue",
          })}
          onClick={() => setActive("continue")}
        >
          <P>진행중인 이벤트</P>
        </FlexChild>

        <FlexChild
          className={clsx(styles.tab_btn, {
            [styles.active]: active === "end",
          })}
          onClick={() => setActive("end")}
        >
          <P>종료된 이벤트</P>
        </FlexChild>
      </HorizontalFlex>

      <FlexChild>
        {notices.length > 0 ? (
          <div className={styles.gallery_container}>
            {notices.map((item: NoticeData, i: number) => (
              <GalleryItem active={active} key={i} item={item} />
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

// 갤러리 아이템
export function GalleryItem({
  item,
  active,
}: {
  item: NoticeData;
  active: "all" | "before" | "continue" | "end";
}) {
  const navigate = useNavigate();
  const dateToString = (date: string | Date | null | undefined) => {
    date = new Date(date || new Date());
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <VerticalFlex gap={17} className={styles.gallery_item}>
      <FlexChild
        className={styles.thumb_frame}
        cursor="pointer"
        onClick={() => navigate(`/board/event/${item.id}`)}
      >
        {/* <Link href={'/board/detail/event_01'}> */}
        {item.thumbnail ? (
          <Image src={item.thumbnail} width={"100%"} height={"auto"} />
        ) : (
          <Image
            src={"/resources/images/no-img.png"}
            width={"100%"}
            height={"auto"}
          />
        )}

        {item.deactives_at &&
          new Date(item.deactives_at).getTime() < Date.now() &&
          item.thumbnail && (
            <Image
              className={styles.event_out}
              src={"/resources/images/event_out.png"}
              width={"100%"}
              height={"auto"}
            />
          )}

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
        <FlexChild className={styles.title} onClick={() => navigate(`/board/event/${item.id}`)}>
          <P>{item.title}</P>
        </FlexChild>

        <FlexChild className={styles.duration}>
          <P>{dateToString(item.actives_at)}</P>
          <Span>~</Span>
          <P>{dateToString(item.deactives_at)}</P>
        </FlexChild>
      </VerticalFlex>
    </VerticalFlex>
  );
}

// 게시판 리스트 end -----------------------------------------------
