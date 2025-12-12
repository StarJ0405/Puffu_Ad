"use client";
import Button from "@/components/buttons/Button";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import InputTextArea from "@/components/inputs/InputTextArea";
import ListPagination from "@/components/listPagination/ListPagination";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import ConfirmModal from "@/modals/confirm/ConfirmModal";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { requester } from "@/shared/Requester";
import { toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import styles from "./inquiry.module.css";

interface InquiryProps {
  qaList: QAData[];
  page: number;
  totalPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  fetchQAs: (pageNumber: number) => void;
}

export default function Inquiry({
  qaList,
  page,
  totalPage,
  setPage,
  fetchQAs,
}: InquiryProps) {
  const params = useParams();
  const router = useRouter();
  const detail_id = params.detail_id as string;
  const domain = params.domain as string;
  const { userData } = useAuth();

  const [qaType, setQaType] = useState<string>("");
  const [content, setContent] = useState("");
  const [isHidden, setIsHidden] = useState(false);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handlePageChange = (newPage: number) => {
    const p = Math.max(0, Math.trunc(newPage));
    setPage(p);
    setOpenIndex(null);
  };

  const getQaTypeKorean = (type: string) => {
    switch (type) {
      case "product":
        return "상품관련";
      case "inventory":
        return "재고";
      case "etc":
        return "기타";
      default:
        return "기타";
    }
  };

  const handleSubmit = async () => {
    if (!userData) {
      const result = await NiceModal.show(ConfirmModal, {
        title: "로그인이 필요합니다.",
        content: "로그인 페이지로 이동하시겠습니까?",
        confirmText: "로그인하기",
        cancelText: "취소",
      });
      if (result) {
        router.push(`/${domain}/login`);
      }
      return;
    }
    if (!qaType) {
      toast({ message: "문의 유형을 선택해주세요." });
      return;
    }
    if (!content.trim()) {
      toast({ message: "문의 내용을 입력해주세요." });
      return;
    }

    const payload: QADataFrame = {
      category: qaType as QADataFrame["type"],
      type: 'etc',
      title: `${getQaTypeKorean(qaType)} 관련 문의입니다.`,
      content,
      hidden: isHidden,
      product_id: detail_id as string,
      user_id: userData.id,
    };

    const res = await requester.createQA(payload);
    if (res?.message === "success") {
      toast({ message: "문의가 등록되었습니다." });
      setContent("");
      setQaType("");
      setIsHidden(false);
      setPage(0); // ✅ 상태도 0으로 동기화
      fetchQAs(0); // ✅ 0-based 첫 페이지 재조회
    } else {
      toast({ message: "문의 등록에 실패했습니다." });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const maskName = (name?: string) => {
    if (!name) return "비회원";
    if (name.length <= 2) {
      return name.substring(0, 1) + "*";
    }
    return (
      name.substring(0, 1) +
      "*".repeat(name.length - 2) +
      name.substring(name.length - 1)
    );
  };

  return (
    <VerticalFlex className={styles.inquiry_wrap}>
      <VerticalFlex className={styles.inquiry_board}>
        {/* 문의글 작성란 */}
        <VerticalFlex className={styles.inquiry_write} gap={10}>
          <FlexChild className={styles.select_item}>
            <Select
              classNames={{
                header: "web_select",
                placeholder: "web_select_placholder",
                line: "web_select_line",
                arrow: "web_select_arrow",
                search: "web_select_search",
              }}
              width={"100%"}
              options={[
                { value: "product", display: "상품관련 문의" },
                { value: "inventory", display: "재고 문의" },
                { value: "etc", display: "기타 문의" },
              ]}
              placeholder={"문의 유형을 선택하세요."}
              value={qaType}
              onChange={(value) => setQaType(value as QADataFrame["type"])}
            />
          </FlexChild>

          <VerticalFlex className={styles.inquiry_content} gap={16}>
            <InputTextArea
              width={"100%"}
              className={styles.content_textArea}
              placeHolder="문의글을 작성해 주세요."
              value={content}
              onChange={(value) => setContent(value as string)}
            />
            <CheckboxGroup name="private_Check">
              <label>
                <FlexChild className={styles.Private_checkBox}>
                  <CheckboxChild
                    id={"private_Check"}
                    checked={isHidden}
                    onChange={() => setIsHidden(!isHidden)}
                  />
                  <P weight={500}>비공개로 작성</P>
                </FlexChild>
              </label>
            </CheckboxGroup>
          </VerticalFlex>

          <FlexChild justifyContent="center" marginTop={10}>
            <Button className="post_btn" onClick={handleSubmit}>
              문의하기
            </Button>
          </FlexChild>
        </VerticalFlex>

        <VerticalFlex className={styles.inquiry_list}>
          <FlexChild className={styles.list_title}>
            <P className={styles.title}>전체 문의목록</P>
          </FlexChild>

          {qaList.length > 0 ? (
            qaList.map((inquiry, i) => {
              const canView =
                !inquiry.hidden ||
                userData?.role === "admin" ||
                userData?.id === inquiry.user_id;
              return (
                <VerticalFlex
                  key={inquiry.id ?? i}
                  className={styles.inquiry_item}
                >
                  <VerticalFlex className={styles.user_question}>
                    <HorizontalFlex
                      alignItems="center"
                      className={styles.item_title}
                    >
                      <P>{canView ? inquiry.title : "비공개 문의입니다."}</P>
                      {canView && (
                        <Button
                          className={clsx(styles.toggle_btn, {
                            [styles.active]: openIndex === i,
                          })}
                          onClick={() =>
                            setOpenIndex((prev) => (prev === i ? null : i))
                          }
                        >
                          <Image
                            src={`/resources/icons/down_arrow.png`}
                            width={16}
                          />
                        </Button>
                      )}
                    </HorizontalFlex>

                    <FlexChild className={styles.data_group}>
                      <FlexChild className={styles.response_check} 
                        backgroundColor={inquiry.answer ? "#fff" : "var(--main-color1)"}
                      >
                        <Span color={inquiry.answer ? "var(--main-color1)" : "#ffffff"}>
                          {inquiry.answer ? "답변완료" : "답변대기"}
                        </Span>
                      </FlexChild>

                      <P className={styles.item_name}>
                        {canView ? maskName(inquiry.user?.name) : "비공개"}
                      </P>

                      <P className={styles.item_date}>
                        {formatDate(inquiry.created_at as string)}
                      </P>
                    </FlexChild>
                  </VerticalFlex>

                  {canView && (
                    <AnimatePresence mode="wait">
                      {openIndex === i && (
                        <motion.div
                          id="motion"
                          key={openIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <VerticalFlex>
                            <FlexChild className={styles.item_content}>
                              <P>
                                {canView
                                  ? inquiry.content
                                  : "비공개 문의입니다."}
                              </P>
                            </FlexChild>

                            {inquiry.answer && openIndex === i && (
                              <VerticalFlex className={styles.admin_answer}>
                                <FlexChild className={styles.answer_title}>
                                  <P color="var(--main-color1)">관리자 답변</P>
                                </FlexChild>

                                <FlexChild className={styles.item_content}>
                                  <P>{inquiry.answer}</P>
                                </FlexChild>
                              </VerticalFlex>
                            )}
                          </VerticalFlex>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </VerticalFlex>
              );
            })
          ) : (
            <FlexChild padding={"30px 0"}>
              <NoContent type="문의" />
            </FlexChild>
          )}

          <FlexChild justifyContent="center" paddingTop={20}>
            <ListPagination
              page={page}
              maxPage={totalPage}
              onChange={handlePageChange}
            />
          </FlexChild>
        </VerticalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
