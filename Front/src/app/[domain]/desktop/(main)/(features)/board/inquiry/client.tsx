"use client";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { requester } from "@/shared/Requester";
import Link from "next/link";
import { useEffect, useState } from "react";
import boardStyle from "../boardGrobal.module.css";

import { toast } from "@/shared/utils/Functions";
import { useRouter } from "next/navigation";

interface QADataWithUser extends QAData {
  user?: UserData;
}

// 게시판 리스트 -----------------------------------------------
export function BoardTitleBox() {
  return (
    <HorizontalFlex className={boardStyle.board_titleBox}>
      <FlexChild>
        {/* 여기 현재 path 주소에 맞게 이름 바뀌게 해야 함. */}
        <h3>1:1문의</h3>
      </FlexChild>

      {/* <SelectBox /> */}
    </HorizontalFlex>
  );
}

export function BoardTable() {
  const [qaList, setQaList] = useState<QADataWithUser[]>([]);
  const { userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchQAs = async () => {
      const res = await requester.getTotalQAs({
        relations: ["user"],
      });
      if (res?.content) {
        setQaList(res.content);
      }
    };
    fetchQAs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const getQaTypeKorean = (type: string) => {
    switch (type) {
      case "exchange":
        return "교환";
      case "refund":
        return "환불";
      case "etc":
      default:
        return "기타";
    }
  };

  const handleTitleClick = (item: QADataWithUser) => {
    if (userData?.role !== "admin" || userData?.id !== item.user?.id) {
      toast({ message: "비밀글은 작성자만 확인할 수 있습니다." });
      return;
    }
    router.push(`/board/inquiry/${item.id}`);
  };

  return (
    <VerticalFlex>
      <FlexChild>
        {qaList.length > 0 ? (
          <table className={boardStyle.list_table}>
            {/* 게시판 셀 너비 조정 */}
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "35%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>

            {/* 게시판리스트 헤더 */}
            <thead>
              <tr className={boardStyle.table_header}>
                <th>번호</th>
                <th>분류</th>
                <th>제목</th>
                <th>작성자</th>
                <th>문의상태</th>
                <th>날짜</th>
              </tr>
            </thead>

            {/* 게시판 내용 */}
            <tbody>
              {qaList.map((list, i) => (
                <tr key={i}>
                  {/* 번호 */}
                  <td>{qaList.length - i}</td>

                  {/* 분류 */}
                  <td>{getQaTypeKorean(list.type)}</td>

                  {/* 제목 */}
                  <td>
                    <Div
                      onClick={() => handleTitleClick(list)}
                      className={boardStyle.td_title}
                    >
                      <FlexChild
                        gap={5}
                        alignItems="center"
                        height={"100%"}
                        cursor="pointer"
                        width={"fit-content"}
                      >
                        {list.hidden && (
                          <Image
                            src={"/resources/icons/board/lock_icon.png"}
                            width={16}
                          />
                        )}
                        <P
                          lineClamp={1}
                          overflow="hidden"
                          display="--webkit-box"
                        >
                          {list.title}
                        </P>
                      </FlexChild>
                    </Div>
                  </td>

                  {/* 작성자 */}
                  <td>
                    <P
                      lineClamp={2}
                      overflow="hidden"
                      display="--webkit-box"
                      weight={500}
                    >
                      {list.user?.name || "비회원"}
                    </P>
                  </td>

                  {/* 문의상태 */}
                  <td>
                    <Span
                      weight={400}
                      color={`${list.answer ? "#fff" : "#FF4343"}`}
                    >
                      {list.answer ? "답변완료" : "답변대기"}
                    </Span>
                  </td>

                  {/* 날짜 */}
                  <td>
                    <Span weight={400}>
                      {formatDate(list.created_at as string)}
                    </Span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoContent type={"게시판"}></NoContent>
        )}
      </FlexChild>
      <FlexChild className={boardStyle.list_bottom_box}>
        {/* <ListPagination /> */}

        {/* 누르면 글쓰기로 연결 회원만 글쓰기 가능! 비회원은 안 보이게 하던지, 클릭하면 비회원이면 로그인 페이지로 보내기 */}
        <Link href={"/board/inquiry/write"} className={boardStyle.write_btn}>
          글쓰기
        </Link>
      </FlexChild>
    </VerticalFlex>
  );
}

// 게시판 리스트 end -----------------------------------------------

// 게시판 쓰기 -----------------------------------------------

// 게시판 쓰기 end -----------------------------------------------
