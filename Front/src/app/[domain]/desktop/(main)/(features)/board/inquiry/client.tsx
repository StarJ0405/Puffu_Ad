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
import { useMemo } from "react";
import boardStyle from "../boardGrobal.module.css";
import ListPagination from "@/components/listPagination/ListPagination";
import { toast } from "@/shared/utils/Functions";
import { useRouter } from "next/navigation";
import usePageData from "@/shared/hooks/data/usePageData";

interface QADataWithUser extends QAData {
  user?: UserData;
}

export function BoardTitleBox() {
  return (
    <HorizontalFlex className={boardStyle.board_titleBox}>
      <FlexChild>
        <h3>1:1문의</h3>
      </FlexChild>
    </HorizontalFlex>
  );
}

export function BoardTable() {
  const { userData } = useAuth();
  const router = useRouter();

  const PAGE_SIZE = 10;
  const key = useMemo(() => "qa:list", []);

  const {
    [key]: pageData,
    page: page0,
    setPage: setPage0,
    maxPage: maxPage0,
  } = usePageData(
    key,
    (pageNumber) => ({
      pageSize: PAGE_SIZE,
      pageNumber, // 0-based
      relations: "user",
      order: { created_at: "DESC" },
    }),
    (cond) => requester.getTotalQAs(cond),
    (d: Pageable) => Math.max(0, Number(d?.totalPages ?? 0) + 1 ),
    {
      onReprocessing: (d: any) => {
        const content: QADataWithUser[] = Array.isArray(d) ? d : d?.content ?? [];
        const total = Number(
          (!Array.isArray(d) && d?.NumberOfTotalElements) ??
            (!Array.isArray(d) && d?.totalElements) ??
            content.length
        );
        return { content, total };
      },
      fallbackData: { content: [], total: 0, totalPages: 0 },
      revalidateOnMount: true,
    }
  );

  // 1-base 어댑터
  const page = page0;
  const maxPage = Math.max(1, (maxPage0 ?? 0));
  const setPage = (n: number) => setPage0(n);

  const list: QADataWithUser[] = pageData?.content ?? [];
  const total: number = Number(pageData?.total ?? 0);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const z = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`;
  };

  const getQaTypeKorean = (type: string) =>
    type === "account"
      ? "회원정보 관리"
      : type === "order"
      ? "주문/결제"
      : type === "receipt"
      ? "영수증/증빙서류"
      : type === "event"
      ? "상품/이벤트"
      : "기타";

  const handleTitleClick = (item: QADataWithUser) => {
    const isAdmin = String(userData?.role || "").toLowerCase() === "admin";
    const isOwner = String(userData?.id) === String(item.user?.id);
    if (!(isAdmin || isOwner)) {
      toast({ message: "1:1문의는 작성자만 확인할 수 있습니다." });
      return;
    }
    router.push(`/board/inquiry/${item.id}`);
  };

  return (
    <VerticalFlex>
      <FlexChild>
        {list.length > 0 ? (
          <table className={boardStyle.list_table}>
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "35%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
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
            <tbody>
              {list.map((row, i) => {
                const no = total - ((page - 1) * PAGE_SIZE + i) - 10;
                return (
                  <tr key={row.id}>
                    <td>{no > 0 ? no : "-"}</td>
                    <td>{getQaTypeKorean(row?.category || "")}</td>
                    <td>
                      <Div onClick={() => handleTitleClick(row)} className={boardStyle.td_title}>
                        <FlexChild
                          gap={5}
                          alignItems="center"
                          height={"100%"}
                          cursor="pointer"
                          width={"fit-content"}
                        >
                          {row.user?.id !== userData?.id && (
                            <Image src={"/resources/icons/board/lock_icon.png"} width={16} />
                          )}
                          <P lineClamp={1} overflow="hidden" display="--webkit-box">
                            {row.title}
                          </P>
                        </FlexChild>
                      </Div>
                    </td>
                    <td>
                      <P lineClamp={2} overflow="hidden" display="--webkit-box" weight={500}>
                        {row.user?.name || "비회원"}
                      </P>
                    </td>
                    <td>
                      <Span weight={400} color={row.answer ? "#fff" : "#FF4343"}>
                        {row.answer ? "답변완료" : "답변대기"}
                      </Span>
                    </td>
                    <td>
                      <Span weight={400}>{formatDate(row.created_at as string)}</Span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <NoContent type={"게시판"} />
        )}
      </FlexChild>

      <FlexChild className={boardStyle.list_bottom_box}>
        <ListPagination page={page} maxPage={maxPage} onChange={setPage} />
        <Link href={"/board/inquiry/write"} className={boardStyle.write_btn}>
          글쓰기
        </Link>
      </FlexChild>
    </VerticalFlex>
  );
}
