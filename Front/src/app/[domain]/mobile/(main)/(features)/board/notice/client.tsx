"use client";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import ListPagination from "@/components/listPagination/ListPagination";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import usePageData from "@/shared/hooks/data/usePageData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import boardStyle from "../boardGrobal.module.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Input from "@/components/inputs/Input";
import Button from "@/components/buttons/Button";

// const pathname = usePathname();

// function linkTabActive() {
//    if(pathname === 'notice') {
//       return style.active;
//    }
// }

// 게시판 리스트 -----------------------------------------------
export function SearchBox() {
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  const handleSearch = () => {
    if (q.trim()) {
      navigate(`/board/notice?q=${q}`);
    } else {
      navigate(`/board/notice`);
    }
  };
  return (
    <HorizontalFlex className={boardStyle.board_searchBox}>
      <FlexChild className={boardStyle.search_box}>
        <Input
          type={"search"}
          value={q}
          onChange={(e) => setQ(e as string)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          placeHolder={"검색 내용을 입력해 주세요."}
        ></Input>
        <Button onClick={handleSearch} className={boardStyle.searchBtn}>
          <Image src="/resources/icons/search_gray.png" width={20} />
        </Button>
      </FlexChild>
    </HorizontalFlex>
  );
}

export function BoardTable({
  initCondition,
  initNotices,
}: {
  initCondition: any;
  initNotices: Pageable;
}) {
  const { notices, page, maxPage, origin, setPage } = usePageData(
    "notices",
    (pageNumber) => ({
      ...initCondition,
      pageNumber,
    }),
    (condition) => requester.getNotices(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initNotices,
    }
  );

  useEffect(() => {
    setPage(0);
  }, [initCondition.q]);

  const navigate = useNavigate();
  const dateToString = (date: string | Date) => {
    date = new Date(date);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getMonth()).padStart(2, "0")}`;
  };
  return (
    <VerticalFlex>
      <FlexChild>
        <table className={boardStyle.list_table}>
          {/* 게시판 내용 */}
          <tbody>
            {notices.length > 0 ? (
              notices.map((notice: NoticeData, index: number) => (
                <tr key={notice.id}>
                  {/* 제목 */}
                  <td>
                    <VerticalFlex className={boardStyle.td_item}>
                      <FlexChild
                        gap={5}
                        alignItems="center"
                        height={"100%"}
                        className={boardStyle.td_title}
                        width={"fit-content"}
                        cursor="pointer"
                        onClick={() => navigate(`/board/notice/${notice.id}`)}
                      >
                        {/* <P>{(origin.pageSize || 0) * page + index}</P> */}
                        <P
                          lineClamp={1}
                          overflow="hidden"
                          display="--webkit-box"
                        >
                          {notice.title}
                        </P>
                        {/* <Image

                        src={"/resources/icons/board/new_icon.png"}
                        width={16}
                      /> */}
                        {/* 12시간 내 등록된 게시물만 나타나기 */}
                        {/* <Span
                        size={13}
                        color=""
                        className={boardStyle.comment_count}
                      >
                        +2
                      </Span> */}
                        {/* 현재 게시물 내에 있는 댓글 수 표시 */}
                      </FlexChild>

                      <FlexChild className={boardStyle.sub_data}>
                        <FlexChild>
                          <P
                            lineClamp={2}
                            overflow="hidden"
                            display="--webkit-box"
                            weight={500}
                          >
                            관리자
                          </P>
                        </FlexChild>

                        <FlexChild>
                          <Span weight={400}>
                            {dateToString(notice.created_at)}
                          </Span>
                        </FlexChild>

                        <FlexChild hidden>
                          <Image src="/resources/icons/board/views_icon.png" width={14}/>
                          <Span weight={400} paddingLeft={3}>{notice.views || 0}</Span>
                        </FlexChild>
                      </FlexChild>
                    </VerticalFlex>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={1}>
                  <NoContent type={"게시판"} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* {notices?.length > 0 ? null : <NoContent type={"게시판"} />} */}
      </FlexChild>
      <FlexChild className={boardStyle.list_bottom_box}>
        <ListPagination page={page} maxPage={maxPage} onChange={setPage} />
      </FlexChild>
    </VerticalFlex>
  );
}

// 게시판 리스트 end -----------------------------------------------
