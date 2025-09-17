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
import { SelectBox } from "../client";

// const pathname = usePathname();

// function linkTabActive() {
//    if(pathname === 'notice') {
//       return style.active;
//    }
// }

// 게시판 리스트 -----------------------------------------------
export function SearchBox() {
  return (
    <HorizontalFlex className={boardStyle.board_searchBox}>

      <SelectBox />
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
  const { notices, page, maxPage, origin } = usePageData(
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
            {notices.map((notice: NoticeData, index: number) => (
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
                      <P lineClamp={1} overflow="hidden" display="--webkit-box">
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
                        <Span weight={400}>{dateToString(notice.created_at)}</Span>
                      </FlexChild>
  
                      <FlexChild>
                        <Span weight={400}>{notice.views || 0}</Span>
                      </FlexChild>
  
                    </FlexChild>
                  </VerticalFlex>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {notices?.length > 0 ? null : <NoContent type={"게시판"} />}
      </FlexChild>
      <FlexChild className={boardStyle.list_bottom_box}>
        {/* <ListPagination /> */}
      </FlexChild>
    </VerticalFlex>
  );
}

// 게시판 리스트 end -----------------------------------------------
