"use client";

import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import StarRate from "@/components/star/StarRate";
import Table, { Column } from "@/components/table/Table";
import Toggle from "@/components/toggle/switch/ToggleSwitch";
import { RowInterface } from "@/modals/context/ContextMenuModal";
import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import { toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./page.module.css";

const paintBullets = (swiper: SwiperType) => {
  const bullets = swiper.pagination?.el?.querySelectorAll(
    ".swiper-pagination-bullet"
  );
  if (!bullets) return;
  bullets.forEach((el) => {
    const bullet = el as HTMLElement;
    bullet.style.setProperty("background-color", "#fff", "important");
    bullet.style.setProperty("opacity", "0.3", "important");
    bullet.style.setProperty("transform", "scale(1)");
    bullet.style.setProperty("margin", "0 4px", "important");
    bullet.style.setProperty("left", "0", "important");
    bullet.style.setProperty("top", "2px", "important");
  });
  const active = swiper.pagination?.el?.querySelector(
    ".swiper-pagination-bullet-active"
  ) as HTMLElement | null;
  if (active) {
    active.style.setProperty("opacity", "1", "important");
    active.style.setProperty("background-color", "#fff", "important");
    active.style.setProperty("transform", "scale(1.66)");
  }
};
export default function ({
  initCondition,
  initData,
  initBest,
  initBestCondition,
}: {
  initCondition: any;
  initData: Pageable;
  initBest: Pageable;
  initBestCondition: any;
}) {
  const { best, mutate, origin } = useData(
    "best",
    initBestCondition,
    (condition) => adminRequester.getReviews(condition),
    {
      onReprocessing: (data: Pageable) => data?.content || [],
      fallbackData: initBest,
    }
  );
  const [columns, setColumns] = useState<Column[]>([
    {
      label: "No.",
      code: "idx",
      styling: {
        common: {
          style: {
            width: 100,
            minWidth: 100,
          },
        },
      },
    },
    {
      label: "작성자",
      styling: {
        common: {
          style: {
            width: 120,
            minWidth: 120,
          },
        },
      },
      Cell: ({ row }) => row?.user?.name,
    },
    {
      label: "상품",
      Cell: ({ row }) => row?.item?.title,
    },
    {
      label: "평점",
      Cell: ({ row }) => <StarRate score={row.star_rate} width={83} readOnly />,
    },
    {
      label: "포토리뷰",
      Cell: ({ row }) => row.images?.length > 0,
    },
  ]);
  const [total, setTotal] = useState(initData.NumberOfTotalElements);
  const [status, setStatus] = useState<string>("all");
  const [mode, setMode] = useState<boolean>(false);
  const table = useRef<any>(null);
  const input = useRef<any>(null);
  const onSearchClick = () => {
    const data: any = {};
    const q = input.current.getValue();
    if (q) data.q = q;
    if (mode) data.photo = true;
    else if (status !== "all") data.photo = status === "active" ? true : false;
    table.current.setCondition(data);
  };
  const onResetClick = () => {
    input.current.empty();
    table.current.reset();
    setStatus("all");
  };
  const ContextMenu = ({ x, y, row }: { x: number; y: number; row?: any }) => {
    const rows: RowInterface[] = [
      {
        label: "새로고침",
        key: "Ctrl+R",
        hotKey: "r",
        onClick: () => {
          table.current.research();
          toast({ message: "목록을 갱신했습니다." });
        },
      },
    ];
    if (row) {
      rows.push({
        label: "상세보기",
        hotKey: "i",
        onClick: () => {
          NiceModal.show("reviewDetail", { review: row });
        },
      });
    }
    return { x, y, rows };
  };
  const onDetailClick = (e: React.MouseEvent, row: any) => {
    e.preventDefault();
    e.stopPropagation();
    NiceModal.show("reviewDetail", { review: row });
  };
  useEffect(() => {
    if (mode) {
      setColumns([
        {
          label: "No.",
          code: "idx",
          styling: {
            common: {
              style: {
                width: 100,
                minWidth: 100,
              },
            },
          },
        },
        {
          label: "베스트",
          Cell: ({ row }) => (
            <Image
              cursor="pointer"
              src={
                row.best
                  ? "/resources/images/checkbox_on.png"
                  : "/resources/images/checkbox_off.png"
              }
              size={30}
              onClick={(e) => {
                e.stopPropagation();
                if (row?.images?.length)
                  adminRequester.updateReviews(
                    row.id,
                    { best: !row.best },
                    () => {
                      mutate();
                      table.current.research();
                    }
                  );
              }}
            />
          ),
          styling: {
            common: {
              style: {
                width: 100,
                minWidth: 100,
              },
            },
          },
        },
        {
          label: "내용",
          Cell: ({ row }) => (
            <VerticalFlex gap={10}>
              <P
                whiteSpace="break-spaces"
                padding={10}
                border={"1px solid #d0d0d0"}
              >
                {row.content}
              </P>
              <FlexChild className={styles.viewer_swiper} id="view_swiper">
                <Swiper
                  loop
                  slidesPerView={1}
                  speed={600}
                  spaceBetween={10}
                  modules={[Pagination, Autoplay, Navigation]}
                  pagination={{ dynamicBullets: true, clickable: true }}
                  navigation={{
                    prevEl: `#view_swiper .${styles.prevBtn}`,
                    nextEl: `#view_swiper .${styles.nextBtn}`,
                  }}
                  autoplay={false}
                  onAfterInit={paintBullets}
                  onSlideChange={paintBullets}
                  onPaginationUpdate={paintBullets}
                  onClick={(_, e) => {
                    e.stopPropagation();
                  }}
                >
                  {row.images.map((src: string) => (
                    <SwiperSlide key={src} className={styles.swiper_slide}>
                      <FlexChild
                        height={"100%"}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Image
                          src={src}
                          maxWidth={"100%"}
                          maxHeight={"100%"}
                          objectFit="contain"
                        />
                      </FlexChild>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </FlexChild>
            </VerticalFlex>
          ),
        },
        {
          label: "정보",
          Cell: ({ row }) => (
            <FlexChild>
              <VerticalFlex gap={20}>
                <FlexChild gap={10}>
                  <Image src={row.item.thumbnail} size={50} />
                  <VerticalFlex>
                    <P whiteSpace="break-spaces">{row?.item?.title}</P>

                    <StarRate score={row.star_rate} width={83} readOnly />
                  </VerticalFlex>
                </FlexChild>
                <FlexChild>
                  <P>{row.user?.name}</P>
                </FlexChild>
              </VerticalFlex>
            </FlexChild>
          ),
          styling: {
            common: {
              style: {
                minWidth: 160,
                width: 160,
              },
            },
          },
        },
      ]);
      onSearchClick();
    } else {
      setColumns([
        {
          label: "No.",
          code: "idx",
          styling: {
            common: {
              style: {
                width: 100,
                minWidth: 100,
              },
            },
          },
        },
        {
          label: "작성자",
          styling: {
            common: {
              style: {
                width: 120,
                minWidth: 120,
              },
            },
          },
          Cell: ({ row }) => row?.user?.name,
        },
        {
          label: "상품",
          Cell: ({ row }) => row?.item?.title,
        },
        {
          label: "평점",
          Cell: ({ row }) => (
            <StarRate score={row.star_rate} width={83} readOnly />
          ),
        },
        {
          label: "포토리뷰",
          Cell: ({ row }) => row.images?.length > 0,
        },
      ]);
      onSearchClick();
    }
  }, [mode]);
  return (
    <VerticalFlex>
      <FlexChild hidden={mode}>
        <div className={styles.search_ontainer}>
          <VerticalFlex>
            <FlexChild>
              <VerticalFlex>
                <FlexChild borderBottom={"1px solid #e9e9e9"}>
                  <HorizontalFlex gap={20} justifyContent={"flex-start"}>
                    <FlexChild
                      width={"10%"}
                      backgroundColor={"var(--admin-table-bg-color)"}
                    >
                      <div className={styles.titleWrap}>
                        <Center>
                          <P size={16} weight={"bold"}>
                            리뷰 종류
                          </P>
                        </Center>
                      </div>
                    </FlexChild>
                    <FlexChild>
                      <RadioGroup
                        name="status"
                        value={status}
                        onValueChange={setStatus}
                      >
                        <HorizontalFlex gap={12} justifyContent="flex-start">
                          <FlexChild
                            width={"max-content"}
                            gap={6}
                            cursor="pointer"
                            onClick={() =>
                              document.getElementById("all")?.click()
                            }
                          >
                            <RadioChild id="all" />
                            <P>전체</P>
                          </FlexChild>
                          <FlexChild
                            width={"max-content"}
                            gap={6}
                            cursor="pointer"
                            onClick={() =>
                              document.getElementById("active")?.click()
                            }
                          >
                            <RadioChild id="active" />
                            <P>포토리뷰</P>
                          </FlexChild>
                          <FlexChild
                            width={"max-content"}
                            gap={6}
                            cursor="pointer"
                            onClick={() =>
                              document.getElementById("inactive")?.click()
                            }
                          >
                            <RadioChild id="inactive" />
                            <P>글리뷰</P>
                          </FlexChild>
                        </HorizontalFlex>
                      </RadioGroup>
                    </FlexChild>
                  </HorizontalFlex>
                </FlexChild>
              </VerticalFlex>
            </FlexChild>
            <FlexChild>
              <VerticalFlex>
                <FlexChild borderBottom={"1px solid #e9e9e9"}>
                  <HorizontalFlex gap={20} justifyContent={"flex-start"}>
                    <FlexChild
                      width={"10%"}
                      backgroundColor={"var(--admin-table-bg-color)"}
                    >
                      <div className={styles.titleWrap}>
                        <Center>
                          <P size={16} weight={"bold"}>
                            통합검색
                          </P>
                        </Center>
                      </div>
                    </FlexChild>
                    <FlexChild>
                      <Input
                        width={300}
                        style={{ padding: "6px 12px" }}
                        ref={input}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onSearchClick();
                        }}
                      />
                    </FlexChild>
                  </HorizontalFlex>
                </FlexChild>
              </VerticalFlex>
            </FlexChild>
            <FlexChild backgroundColor={"#f5f6fb"} padding={"20px 0"}>
              <HorizontalFlex gap={20}>
                <FlexChild justifyContent={"flex-end"}>
                  <Button
                    styleType="admin"
                    className={styles.button}
                    onClick={onSearchClick}
                  >
                    <P size={16}>조건검색</P>
                  </Button>
                </FlexChild>
                <FlexChild>
                  <Button
                    styleType="white"
                    className={styles.button}
                    onClick={onResetClick}
                  >
                    <P size={16}>초기화</P>
                  </Button>
                </FlexChild>
              </HorizontalFlex>
            </FlexChild>
          </VerticalFlex>
        </div>
      </FlexChild>
      <FlexChild hidden={!mode}>
        <VerticalFlex className={styles.fix}>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.header} width={100}>
                <P>순서</P>
              </FlexChild>
              <FlexChild className={styles.header}>
                <P>고정글</P>
              </FlexChild>
              <FlexChild className={styles.header} width={100}>
                <P>작성자</P>
              </FlexChild>
              <FlexChild className={styles.header} width={100}>
                <P>관리</P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>

          {best.length === 0 ? (
            <P>고정 목록 없음</P>
          ) : (
            best.map((review: ReviewData) => (
              <FlexChild
                key={review.id}
                className={styles.row}
                cursor="pointer"
                onClick={() => NiceModal.show("reviewDetail", { review })}
              >
                <HorizontalFlex>
                  <FlexChild className={styles.column} width={100}>
                    <HorizontalFlex justifyContent="center" gap={5}>
                      <Image
                        src={"/resources/images/minus.png"}
                        size={12}
                        cursor={"pointer"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (review.index > 0)
                            adminRequester.updateReviews(
                              review.id,
                              {
                                index: review.index - 1,
                              },
                              () => mutate()
                            );
                        }}
                      />
                      <P>{review.index}</P>
                      <Image
                        src={"/resources/images/plus.png"}
                        size={12}
                        cursor={"pointer"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (review.index < best?.length - 1)
                            adminRequester.updateReviews(
                              review.id,
                              {
                                index: review.index + 1,
                              },
                              () => mutate()
                            );
                        }}
                      />
                    </HorizontalFlex>
                  </FlexChild>
                  <FlexChild className={styles.column}>
                    <P>{review.content}</P>
                  </FlexChild>
                  <FlexChild className={styles.column} width={100}>
                    <P>{review?.user?.name}</P>
                  </FlexChild>
                  <FlexChild
                    className={styles.column}
                    width={100}
                    cursor="pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      NiceModal.show("confirm", {
                        message: "고정을 해제하시겠습니까?",
                        confirmText: "해제",
                        cancelText: "취소",
                        onConfirm: () => {
                          adminRequester.updateReviews(
                            review.id,
                            {
                              best: false,
                            },
                            () => {
                              mutate();
                              table.current.research();
                            }
                          );
                        },
                      });
                    }}
                  >
                    <P color="red" textHover>
                      해제
                    </P>
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
            ))
          )}
        </VerticalFlex>
      </FlexChild>
      <FlexChild padding={"15px 5px"}>
        <HorizontalFlex justifyContent="flex-start">
          <FlexChild width={"max-content"}>
            <P fontSize={18} weight={600}>
              검색 결과 : {total}건
            </P>
          </FlexChild>
          <FlexChild paddingLeft={20} gap={5}>
            <P>평가모드</P>
            <Toggle status={mode} onChange={(status) => setMode(status)} />
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild>
        <Table
          ref={table}
          onRowClick={(e, row) => onDetailClick(e, row)}
          name="reviews"
          columns={columns}
          initCondition={initCondition}
          initLimit={20}
          initData={initData}
          indexing={false}
          selectable={!mode}
          onSearch={(condition) => {
            return adminRequester.getReviews(condition);
          }}
          onMaxPage={(data) => {
            return Number(data?.totalPages);
          }}
          onReprocessing={(data) => data?.content}
          onChange={({ origin }) => setTotal(origin.NumberOfTotalElements)}
          ContextMenu={ContextMenu}
        />
      </FlexChild>
    </VerticalFlex>
  );
}
