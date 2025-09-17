"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import ListPagination from "@/components/listPagination/ListPagination";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import Link from "next/link";
import boardStyle from "../boardGrobal.module.css";
import { SelectBox } from "../client";
import useNavigate from "@/shared/hooks/useNavigate";

// const pathname = usePathname();

// function linkTabActive() {
//    if(pathname === 'notice') {
//       return style.active;
//    }
// }

// 게시판 리스트 -----------------------------------------------
export function BoardTitleBox() {
  return (
    <HorizontalFlex className={boardStyle.board_titleBox}>
      <FlexChild>
        {/* 여기 현재 path 주소에 맞게 이름 바뀌게 해야 함. */}
        <h3>공지사항</h3>
      </FlexChild>

      <SelectBox />
    </HorizontalFlex>
  );
}

export function BoardTable() {
  // 조회수는 세자리마다 , 처리.
  // date는 어차피 뽑으면 년월일시분초 다 나뉠테니 그때 조정하면 됨.
  const boardData = [
    {
      number: "1",
      title: "게시판 내용",
      member: "푸푸토이",
      views: "12323",
      date: "2025-09-04",
    },
    {
      number: "2",
      title: "게시판 내용",
      member: "푸푸토이",
      views: "12323",
      date: "2025-09-04",
    },
    {
      number: "3",
      title: "게시판 내용",
      member: "푸푸토이",
      views: "12323",
      date: "2025-09-04",
    },
    {
      number: "4",
      title: "게시판 내용",
      member: "푸푸토이",
      views: "12323",
      date: "2025-09-04",
    },
    {
      number: "5",
      title: "게시판 내용",
      member: "푸푸토이",
      views: "12323",
      date: "2025-09-04",
    },
    {
      number: "6",
      title: "게시판 내용",
      member: "푸푸토이",
      views: "12323",
      date: "2025-09-04",
    },
    {
      number: "7",
      title: "게시판 내용",
      member: "푸푸토이",
      views: "12323",
      date: "2025-09-04",
    },
    {
      number: "8",
      title: "게시판 내용",
      member: "푸푸토이",
      views: "12323",
      date: "2025-09-04",
    },
    {
      number: "9",
      title: "게시판 내용",
      member: "푸푸토이",
      views: "12323",
      date: "2025-09-04",
    },
    {
      number: "10",
      title: "게시판 내용",
      member: "푸푸토이",
      views: "12323",
      date: "2025-09-04",
    },
  ];

  const navigate = useNavigate();

  return (
    <VerticalFlex>
      <FlexChild>
        <table className={boardStyle.list_table}>
          {/* 게시판 셀 너비 조정 */}
          <colgroup>
            <col style={{ width: "10%", maxWidth: "130px" }} />
            <col style={{ width: "55%" }} />
            <col style={{ width: "10%", maxWidth: "130px" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "10%", maxWidth: "130px" }} />
          </colgroup>

          {/* 게시판리스트 헤더 */}
          <thead>
            <tr className={boardStyle.table_header}>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>조회</th>
              <th>날짜</th>
            </tr>
          </thead>

          {/* 게시판 내용 */}
          <tbody>
            {boardData.map((list, i) => (
              <tr key={i}>
                {/* 번호 */}
                <td>{list.number}</td>

                {/* 제목 */}
                <td>
                  <FlexChild
                    gap={5}
                    alignItems="center"
                    height={"100%"}
                    className={boardStyle.td_title}
                    width={"fit-content"}
                    onClick={() => navigate("/board/notice/")}
                  >
                    <P lineClamp={1} overflow="hidden" display="--webkit-box">
                      {list.title}
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
                    {list.member}
                  </P>
                </td>

                {/* 조회수 */}
                <td>
                  <Span weight={400}>{list.views}</Span>
                </td>

                {/* 날짜 */}
                {/* 공지사항은 년월일까지 표시, 1:1문의는 분시초도 표시. */}
                <td>
                  <Span weight={400}>{list.date}</Span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {boardData.length > 0 ? null : <NoContent type={"게시판"} />}
      </FlexChild>
      <FlexChild className={boardStyle.list_bottom_box}>
        {/* <ListPagination /> */}
      </FlexChild>
    </VerticalFlex>
  );
}

// 게시판 리스트 end -----------------------------------------------
