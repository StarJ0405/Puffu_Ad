"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import ListPagination from "@/components/listPagination/ListPagination";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { requester } from "@/shared/Requester";
import styles from "./page.module.css";
import usePageData from "@/shared/hooks/data/usePageData";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";

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
  // console.log("Step 2: formatInquiries input:", inquiriesData);
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
    };
  });
  // console.log("Step 3: formatInquiries output:", formatted);
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
    setPage,
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
        // console.log("Step 1: Raw response from API:", data);
        return formatInquiries(data?.content || []);
      },
    }
  );

  // console.log("Step 4: Final data for rendering (inquiries):", inquiries);

  const [answerToggle, setAnswerToggle] = useState<number | null>(null);

  return (
    <>
      <VerticalFlex>
        <FlexChild>
          <VerticalFlex className={styles.list_container}>
            {inquiries?.map((list: any, i: number) => (
              <VerticalFlex
                key={i}
                className={styles.inquiry_item}
                alignItems="start"
              >
                <FlexChild
                  justifyContent="space-between"
                  className={styles.item_header}
                >
                  <P color="#c7c7c7">{list.Type}</P>
                  <Span size={12} color="#888">
                    {list.date}
                  </Span>
                </FlexChild>

                <FlexChild
                  gap={5}
                  alignItems="center"
                  cursor="pointer"
                  className={styles.td_title}
                  justifyContent="start"
                  onClick={() =>
                    setAnswerToggle((prev) => (prev === i ? null : i))
                  }
                >
                  <FlexChild gap={5}>
                    {list.is_secret && (
                      <Image
                        src={"/resources/icons/board/lock_icon.png"}
                        width={12}
                      />
                    )}
                    <P lineClamp={1} overflow="hidden" display="--webkit-box">
                      {list.title}
                    </P>
                  </FlexChild>
                  {/* new icon logic needed */}
                  {/* <Image
                    src={"/resources/icons/board/new_icon.png"}
                    width={16}
                  /> */}

                  <FlexChild
                    width={"auto"}
                    className={clsx(
                      styles.toggle_btn,
                      answerToggle === i ? styles.btn_active : ""
                    )}
                  >
                    <Image
                      src={`/resources/icons/arrow/board_arrow_bottom_icon.png`}
                      width={12}
                    />
                  </FlexChild>
                </FlexChild>

                <FlexChild
                  justifyContent="space-between"
                  className={styles.item_footer}
                >
                  <P size={12} color="#888">
                    {list.member}
                  </P>
                  <Span
                    weight={400}
                    color={`${
                      list.answered === "답변완료" ? "#fff" : "#FF4343"
                    }`}
                  >
                    {list.answered}
                  </Span>
                </FlexChild>

                {/* 문의 내용 / 관리자 답변 */}
                <AnimatePresence mode={"wait"}>
                  {answerToggle === i && (
                    <motion.div
                      id="motion"
                      // key={active}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <VerticalFlex className={styles.content_wrapper}>
                        <VerticalFlex
                          className={styles.item_content}
                          alignItems="start"
                          gap={15}
                        >
                          <FlexChild minHeight={100} alignItems="start">
                            <P>{list.content}</P>
                          </FlexChild>

                          {list.images?.length > 0 && (
                            <VerticalFlex alignItems="start">
                              <P color="#797979" size={11}>
                                첨부 이미지
                              </P>
                              <FlexChild
                                className={styles.image_gallery}
                                gap={10}
                              >
                                {list.images.map(
                                  (img: string, index: number) => (
                                    <Image
                                      key={index}
                                      src={img}
                                      width={60}
                                      height={60}
                                      className={styles.gallery_image}
                                    />
                                  )
                                )}
                              </FlexChild>
                            </VerticalFlex>
                          )}
                        </VerticalFlex>

                        {list.answer && (
                          <VerticalFlex
                            className={styles.admin_answer}
                            alignItems="start"
                          >
                            <FlexChild
                              alignItems="center"
                              gap={8}
                              className={styles.answer_header}
                            >
                              <P weight={600} color="#fff">
                                관리자 To
                              </P>
                            </FlexChild>

                            <FlexChild
                              className={styles.answer_content}
                              alignItems="start"
                            >
                              <P>{list.answer}</P>
                            </FlexChild>
                          </VerticalFlex>
                        )}
                      </VerticalFlex>
                    </motion.div>
                  )}
                </AnimatePresence>
              </VerticalFlex>
            ))}
          {inquiries?.length > 0 ? null : <NoContent type="문의" />}
          </VerticalFlex>
        </FlexChild>
        <FlexChild className={styles.list_bottom_box}>
          <ListPagination page={page} maxPage={maxPage} onChange={setPage} />
        </FlexChild>
      </VerticalFlex>
    </>
  );
}
