"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import styles from "./page.module.css";
import ListPagination from "@/components/listPagination/ListPagination";
import { useEffect, useState, useCallback } from "react";
import { requester } from "@/shared/Requester";


import clsx from "clsx";
import usePageData from "@/shared/hooks/data/usePageData";

const getInquiryTypeKorean = (type: string) => {
  switch (type) {
    case "exchange":
      return "교환/환불";
    case "product":
      return "상품문의";
    case "shipping":
      return "배송문의";
    case "etc":
      return "기타문의";
    default:
      return type;
  }
};

const formatInquiries = (inquiriesData: any[]) => {
  console.log("Step 2: formatInquiries input:", inquiriesData);
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
      Type: getInquiryTypeKorean(inquiry.type),
      title: inquiry.title,
      content: inquiry.content,
      images: inquiry.images || [],
      answer: inquiry.answer,
      member: inquiry.user?.name || "고객",
      answered: inquiry.answer ? "답변완료" : "답변대기",
      date: inquiryDate,
      is_secret: inquiry.hidden,
    };
  });
  console.log("Step 3: formatInquiries output:", formatted);
  return formatted;
};

export function InquiryClient() {
  const initCondition: any = {
    pageSize: 20,
    relations: ["user"],
  };

  const {
    qas: inquiries,
    page,
    maxPage,
    changePage,
  } = usePageData(
    "qas",
    (pageNumber) => ({
      ...initCondition,
      pageNumber,
    }),
    (condition) => requester.getQAs(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => {
        console.log("Step 1: Raw response from API:", data);
        return formatInquiries(data?.content || []);
      },
    }
  );

  console.log("Step 4: Final data for rendering (inquiries):", inquiries);

  return (
    <>
      <VerticalFlex>
        <FlexChild>
          <VerticalFlex className={styles.list_container}>
            {inquiries?.map((list: any, i: number) => (
              <VerticalFlex key={i} className={styles.inquiry_item}>
                <FlexChild
                  justifyContent="space-between"
                  className={styles.item_header}
                >
                  <P>{list.Type}</P>
                  <Span
                    weight={400}
                    color={`${
                      list.answered === "답변완료" ? "#fff" : "#FF4343"
                    }`}
                  >
                    {list.answered}
                  </Span>
                </FlexChild>

                <FlexChild
                  gap={5}
                  alignItems="center"
                  cursor="pointer"
                  className={styles.td_title}
                  width={"fit-content"}
                >
                  {list.is_secret && (
                    <Image
                      src={"/resources/icons/board/lock_icon.png"}
                      width={16}
                    />
                  )}
                  <P lineClamp={1} overflow="hidden" display="--webkit-box">
                    {list.title}
                  </P>
                  {/* new icon logic needed */}
                  {/* <Image
                    src={"/resources/icons/board/new_icon.png"}
                    width={16}
                  /> */}
                </FlexChild>

                <P className={styles.item_content}>{list.content}</P>

                {list.images?.length > 0 && (
                  <FlexChild className={styles.image_gallery} gap={10}>
                    {list.images.map((img: string, index: number) => (
                      <Image
                        key={index}
                        src={img}
                        width={60}
                        height={60}
                        className={styles.gallery_image}
                      />
                    ))}
                  </FlexChild>
                )}

                {list.answer && (
                  <div className={styles.item_answer}>
                    <FlexChild alignItems="center" gap={8} className={styles.answer_header}>
                      
                      <P weight={600} color="#fff">관리자 답변</P>
                    </FlexChild>
                    <P className={styles.answer_content}>{list.answer}</P>
                  </div>
                )}

                <FlexChild
                  justifyContent="space-between"
                  className={styles.item_footer}
                >
                  <P size={12} color="#888">
                    {list.member}
                  </P>
                  <Span size={12} color="#888">
                    {list.date}
                  </Span>
                </FlexChild>
              </VerticalFlex>
            ))}
          </VerticalFlex>
          {inquiries?.length > 0 ? null : <NoContent type="문의" />}
        </FlexChild>
        <FlexChild className={styles.list_bottom_box}>
           <ListPagination page={page} maxPage={maxPage} onChange={changePage} />
        </FlexChild>
      </VerticalFlex>
    </>
  );
}
