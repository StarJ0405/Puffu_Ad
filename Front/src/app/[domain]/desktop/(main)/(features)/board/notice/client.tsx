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
export function BoardTitleBox() {
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
    <HorizontalFlex className={boardStyle.board_titleBox}>
      <FlexChild>
        {/* 여기 현재 path 주소에 맞게 이름 바뀌게 해야 함. */}
        <h3>공지사항</h3>
      </FlexChild>

      <FlexChild gap={10} className={boardStyle.search_box}>
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
          검색
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
            {/* 게시판 셀 너비 조정 */}
            <colgroup>
              <col style={{ width: "10%", maxWidth: "130px" }} />
              <col style={{ width: "55%" }} />
              <col style={{ width: "10%", maxWidth: "130px" }} />
              {/* <col style={{ width: "15%" }} /> */}
              <col style={{ width: "10%", maxWidth: "130px" }} />
            </colgroup>

            {/* 게시판리스트 헤더 */}
            <thead>
              <tr className={boardStyle.table_header}>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th hidden>조회</th>
                <th>날짜</th>
              </tr>
            </thead>

            {/* 게시판 내용 */}
            <tbody>
              {notices.length > 0 ? (
                notices.map((notice: NoticeData, index: number) => (
                  <tr key={notice.id}>
                    {/* 번호 */}
                    <td>{(origin.pageSize || 0) * page + index}</td>

                    {/* 제목 */}
                    <td>
                      <FlexChild
                        gap={5}
                        alignItems="center"
                        height={"100%"}
                        className={boardStyle.td_title}
                        width={"fit-content"}
                        cursor="pointer"
                        onClick={() =>
                          navigate(`/board/notice/${notice.id}`)
                        }
                      >
                        <P
                          lineClamp={1}
                          overflow="hidden"
                          display="--webkit-box"
                        >
                          {notice.title}
                        </P>
                        <Image
                          src={"/resources/icons/board/new_icon.png"}
                          width={16}
                        />
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
                    </td>

                    {/* 작성자 */}
                    {/* 공지사항은 관리자가 쓰니까 이름 그대로 나오고, 1:1문의에서는 이름 일부 **로 가려주기 */}
                    <td>
                      <P
                        lineClamp={2}
                        overflow="hidden"
                        display="--webkit-box"
                        weight={500}
                      >
                        관리자
                      </P>
                    </td>

                    {/* 조회수 */}
                    <td hidden>
                      <Image src="/resources/icons/board/views_icon.png" width={14}/>
                      <Span weight={400} paddingLeft={3}>{notice.views || 0}</Span>
                    </td>


                    {/* 날짜 */}
                    {/* 공지사항은 년월일까지 표시, 1:1문의는 분시초도 표시. */}
                    <td>
                      <Span weight={400}>
                        {dateToString(notice.created_at)}
                      </Span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
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
