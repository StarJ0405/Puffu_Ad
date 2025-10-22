"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import styles from "./page.module.css";
import ListPagination from "@/components/listPagination/ListPagination";
import { useState, Fragment } from "react";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";

import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { toast } from "@/shared/utils/Functions";
import Div from "@/components/div/Div";

const getInquiryTypeKorean = (type: string) => {
  switch (type) {
    case "account":
      return "회원정보 관리";
    case "order":
      return "주문/결제";
    case "receipt":
      return "영수증/증빙서류";
    case "event":
      return "상품/이벤트";
    case "etc":
      return "기타";
    default:
      return "기타";
  }
};

const formatInquiries = (inquiriesData: any[]) => {
  const formatted = inquiriesData.map((inquiry) => {
    const inquiryDate = new Date(inquiry.created_at).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      id: inquiry.id,
      Type: getInquiryTypeKorean(inquiry.category || ""),
      title: inquiry.title,
      content: inquiry.content,
      images: inquiry.images || [],
      answer: inquiry.answer,
      member: inquiry.user?.name || "고객",
      answered: inquiry.answer ? "답변완료" : "답변대기",
      date: inquiryDate,
      is_secret: inquiry.hidden,
      user_id: inquiry.user_id,
    };
  });
  return formatted;
};

export function InquiryTable() {
  const { userData } = useAuth();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const initCondition: any = {
    pageSize: 10,
    relations: ["user"],
  };

  const {
    "qas-desktop-mypage": inquiries,
    page,
    maxPage,
    setPage,
  } = usePageData(
    "qas-desktop-mypage",
    (pageNumber) => ({
      ...initCondition,
      pageNumber,
    }),
    (condition) => requester.getQAs(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => {
        return formatInquiries(data?.content || []);
      },
    }
  );

  const handleRowClick = (item: any) => {
    if (
      item.is_secret &&
      userData?.role !== "admin" &&
      userData?.id !== item.user_id
    ) {
      toast({ message: "비밀글은 작성자만 확인할 수 있습니다." });
      return;
    }

    if (expandedId === item.id) {
      setExpandedId(null);
    } else {
      setExpandedId(item.id);
    }
  };

  return (
    <>
      <VerticalFlex>
        <FlexChild>
          <table className={styles.list_table}>
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "35%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead>
              <tr className={styles.table_header}>
                <th>번호</th>
                <th>분류</th>
                <th>제목</th>
                <th>작성자</th>
                <th>문의상태</th>
                <th>날짜</th>
              </tr>
            </thead>

            <tbody>
              {inquiries?.map((list: any, i: number) => (
                <Fragment key={list.id}>
                  <tr
                    onClick={() => handleRowClick(list)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* <td>{inquiries.length - i}</td> */}
                    <td>{(inquiries.length || 0) * page + i + 1}</td>
                    <td>{list.Type}</td>
                    <td>
                      <Div className={styles.td_title}>
                        <FlexChild
                          gap={5}
                          alignItems="center"
                          height={"100%"}
                          width={"fit-content"}
                        >
                          {list.is_secret && (
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
                    <td>
                      <Span
                        weight={400}
                        color={`${
                          list.answered === "답변완료" ? "#fff" : "#FF4343"
                        }`}
                      >
                        {list.answered}
                      </Span>
                    </td>
                    <td>
                      <Span weight={400}>{list.date}</Span>
                    </td>
                  </tr>
                  {expandedId === list.id && (
                    <tr>
                      <td colSpan={6}>
                        <VerticalFlex className={styles.details_container}>
                          <P
                            padding={"0 0 35px 0"}
                            width={"100%"}
                            textAlign="left"
                            className={styles.item_content}
                          >
                            {list.content}
                          </P>
                          {list.images?.length > 0 && (
                            <FlexChild
                              className={styles.image_gallery}
                              gap={10}
                            >
                              {list.images.map((img: string, index: number) => (
                                <Image
                                  key={index}
                                  src={img}
                                  width={80}
                                  height={80}
                                  className={styles.gallery_image}
                                />
                              ))}
                            </FlexChild>
                          )}
                          {list.answer && (
                            <div className={styles.item_answer}>
                              <FlexChild
                                alignItems="center"
                                gap={8}
                                className={styles.answer_header}
                              >
                                <P weight={600} color="#fff">
                                  관리자 답변
                                </P>
                              </FlexChild>
                              <P className={styles.answer_content}>
                                {list.answer}
                              </P>
                            </div>
                          )}
                        </VerticalFlex>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </FlexChild>
        <FlexChild>
          {inquiries?.length === 0 && <NoContent type="문의" />}
        </FlexChild>
        <FlexChild className={styles.list_bottom_box}>
          <ListPagination page={page} maxPage={maxPage} onChange={setPage} />
        </FlexChild>
      </VerticalFlex>
    </>
  );
}
