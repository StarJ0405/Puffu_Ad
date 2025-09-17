"use client";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import boardStyle from "../boardGrobal.module.css";

import { toast } from "@/shared/utils/Functions";
import { useRouter } from "next/navigation";
import { SelectBox } from "../client";
import NoContent from "@/components/noContent/noContent";

interface QADataWithUser extends QAData {
  user?: UserData;
}

// 게시판 리스트 -----------------------------------------------
export function SearchBox() {
  return (
    <HorizontalFlex className={boardStyle.board_searchBox}>
      {/* <FlexChild>
            <h3>1:1문의</h3>
         </FlexChild> */}

      <SelectBox />
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
      <FlexChild marginBottom={30} justifyContent="center">
        {/* 누르면 글쓰기로 연결 회원만 글쓰기 가능! 비회원은 안 보이게 하던지, 클릭하면 비회원이면 로그인 페이지로 보내기 */}
        <Link href={"/board/inquiry/write"} className={boardStyle.write_btn}>
          글쓰기
        </Link>
      </FlexChild>
      <FlexChild>
        {qaList.length > 0 ? (
        <table
          className={clsx(boardStyle.list_table, boardStyle.inquiry_table)}
        >
          {/* 게시판 셀 너비 조정 */}
          <colgroup>
            <col style={{ width: "75%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>

          {/* 게시판 내용 */}
          <tbody>
            {qaList.map((list, i) => (
              <tr key={i}>
                {/* 제목 */}
                <td>
                  <VerticalFlex
                    onClick={() => handleTitleClick(list)}
                    className={boardStyle.td_item}
                  >
                    <FlexChild
                      className={boardStyle.td_title}
                      gap={5}
                      alignItems="center"
                      height={"100%"}
                      cursor="pointer"
                    >
                      <FlexChild width={"auto"}>
                        <P>{getQaTypeKorean(list.type)} - </P>
                      </FlexChild>

                      <FlexChild gap={5} width={"100%"}>
                        <P
                          lineClamp={1}
                          overflow="hidden"
                          display="--webkit-box"
                        >
                          {list.title}
                        </P>
                        {list.hidden && (
                          <Image
                            src={"/resources/icons/board/lock_icon.png"}
                            width={16}
                          />
                        )}
                      </FlexChild>
                    </FlexChild>

                    <FlexChild className={boardStyle.sub_data}>
                      <FlexChild>{list.user?.name || "비회원"}</FlexChild>
                      <FlexChild>
                        <Span weight={400}>
                          {formatDate(list.created_at as string)}
                        </Span>
                      </FlexChild>
                    </FlexChild>
                  </VerticalFlex>
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
                {/* <td><Span weight={400}>{formatDate(list.created_at as string)}</Span></td> */}
              </tr>
            ))}
          </tbody>
        </table>
        ):(
          <NoContent type="게시판"></NoContent>
        )}
      </FlexChild>
      <FlexChild className={boardStyle.list_bottom_box}>
        {/* <ListPagination /> */}
      </FlexChild>
    </VerticalFlex>
  );
}

// 게시판 리스트 end -----------------------------------------------

// 게시판 쓰기 -----------------------------------------------

// 게시판 쓰기 end -----------------------------------------------
