"use client";
import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
import Div from "@/components/div/Div";
import Dummy from "@/components/dummy/Dummy";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import Inline from "@/components/inline/Inline";
import P from "@/components/P/P";
import { Column } from "@/components/table/Table";
import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import NiceModal from "@ebay/nice-modal-react";
import { JSX } from "react";
import styles from "./page.module.css";

export function ProductStatus({ Status }: { Status: any }) {
  const { productList: data } = useData(
    "productList",
    { _type: "status" },
    (condition) => adminRequester.getProducts(condition),
    {
      onReprocessing: (data) => data?.content,
      fallbackData: Status,
    }
  );
  return (
    <Div width={"100%"} maxWidth={1380} height={"auto"}>
      <div className={styles.wrap}>
        {data && (
          <HorizontalFlex>
            <FlexChild justifyContent={"center"} padding={"30px 0 20px"}>
              <HorizontalFlex>
                <FlexChild>
                  <VerticalFlex>
                    <FlexChild marginBottom={10}>
                      <Center>
                        <Image
                          src={"/resources/images/allProduct_white.png"}
                          width={40}
                        />
                      </Center>
                    </FlexChild>
                    <FlexChild marginBottom={5}>
                      <Center>
                        <P size={18} weight={500} color={"#ffffff"}>
                          전체 상품
                        </P>
                      </Center>
                    </FlexChild>
                    <FlexChild>
                      <Center>
                        <Inline alignItems={"center"}>
                          <P
                            cursor="pointer"
                            weight={"bold"}
                            size={25}
                            color={"#30D56F"}
                          >
                            {data?.list}
                          </P>
                          <P size={18} color={"#ffffff"} weight={600}>
                            개
                          </P>
                        </Inline>
                      </Center>
                    </FlexChild>
                  </VerticalFlex>
                </FlexChild>
              </HorizontalFlex>
            </FlexChild>
            <FlexChild justifyContent={"center"} padding={"30px 0 20px"}>
              <HorizontalFlex>
                <FlexChild>
                  <VerticalFlex>
                    <FlexChild marginBottom={10}>
                      <Center>
                        <Image
                          src={"/resources/images/productsOnSale_white.png"}
                          width={40}
                        />
                      </Center>
                    </FlexChild>
                    <FlexChild marginBottom={5}>
                      <Center>
                        <P size={18} weight={500} color={"#ffffff"}>
                          판매중
                        </P>
                      </Center>
                    </FlexChild>
                    <FlexChild>
                      <Center>
                        <Inline alignItems={"center"}>
                          <P
                            cursor="pointer"
                            weight={"bold"}
                            size={25}
                            color={"#30D56F"}
                          >
                            {data?.sale}
                          </P>
                          <P size={18} color={"#ffffff"} weight={600}>
                            개
                          </P>
                        </Inline>
                      </Center>
                    </FlexChild>
                  </VerticalFlex>
                </FlexChild>
              </HorizontalFlex>
            </FlexChild>
            <FlexChild justifyContent={"center"} padding={"30px 0 20px"}>
              <HorizontalFlex>
                <FlexChild>
                  <VerticalFlex>
                    <FlexChild marginBottom={10}>
                      <Center>
                        <Image
                          src={"/resources/images/soldOutProduct_white.png"}
                          width={40}
                        />
                      </Center>
                    </FlexChild>
                    <FlexChild marginBottom={5}>
                      <Center>
                        <P size={18} weight={500} color={"#ffffff"}>
                          품절
                        </P>
                      </Center>
                    </FlexChild>
                    <FlexChild>
                      <Center>
                        <Inline alignItems={"center"}>
                          <P
                            cursor="pointer"
                            weight={"bold"}
                            size={25}
                            color={"#30D56F"}
                          >
                            {data?.min}
                          </P>
                          <P size={18} color={"#ffffff"} weight={600}>
                            개
                          </P>
                        </Inline>
                      </Center>
                    </FlexChild>
                  </VerticalFlex>
                </FlexChild>
              </HorizontalFlex>
            </FlexChild>
            <FlexChild justifyContent={"center"} padding={"30px 0 20px"}>
              <HorizontalFlex>
                <FlexChild>
                  <VerticalFlex>
                    <FlexChild marginBottom={10}>
                      <Center>
                        <Image
                          src={"/resources/images/productNotShown_white.png"}
                          width={40}
                        />
                      </Center>
                    </FlexChild>
                    <FlexChild marginBottom={5}>
                      <Center>
                        <P size={18} weight={500} color={"#ffffff"}>
                          미전시
                        </P>
                      </Center>
                    </FlexChild>
                    <FlexChild>
                      <Center>
                        <Inline alignItems={"center"}>
                          <P
                            cursor="pointer"
                            weight={"bold"}
                            size={25}
                            color={"#30D56F"}
                          >
                            {data?.hide}
                          </P>
                          <P size={18} color={"#ffffff"} weight={600}>
                            개
                          </P>
                        </Inline>
                      </Center>
                    </FlexChild>
                  </VerticalFlex>
                </FlexChild>
              </HorizontalFlex>
            </FlexChild>
            {/* <FlexChild justifyContent={"center"} padding={"30px 0 20px"}>
              <HorizontalFlex>
                <FlexChild>
                  <VerticalFlex>
                    <FlexChild marginBottom={10}>
                      <Center>
                        <Image
                          src={"/resources/images/mainItemsOnShow_white.png"}
                          width={40}
                        />
                      </Center>
                    </FlexChild>
                    <FlexChild marginBottom={5}>
                      <Center>
                        <P size={18} weight={500} color={"#ffffff"}>
                          메인상품
                        </P>
                      </Center>
                    </FlexChild>
                    <FlexChild>
                      <Center>
                        <Inline alignItems={"center"}>
                          <P
                            cursor="pointer"
                            weight={"bold"}
                            size={25}
                            color={"#30D56F"}
                          >
                            {data?.main}
                          </P>
                          <P size={18} color={"#ffffff"} weight={600}>
                            개
                          </P>
                        </Inline>
                      </Center>
                    </FlexChild>
                  </VerticalFlex>
                </FlexChild>
              </HorizontalFlex>
            </FlexChild> */}
          </HorizontalFlex>
        )}
      </div>
    </Div>
  );
}

export function OutOfStock({ Stock }: { Stock: any }) {
  const { outOfStock: data, origin }: { [x: string]: any[]; origin?: any } =
    useData(
      "outOfStock",
      {
        _type: "outOfStock",
        pageSize: 3,
        order: {
          stack: "asc",
        },
      },
      (condition) => adminRequester.getVariants(condition),
      {
        onReprocessing: (data) => data?.content?.content || [],
        fallbackData: Stock,
      }
    );
  const DummyProduct = (props: any) => {
    const { data } = props;
    return (
      <div className={styles.dummyWrap}>
        <VerticalFlex>
          <FlexChild justifyContent={"center"} marginBottom={10}>
            <Image
              src={
                data && data.thumbnail
                  ? data.thumbnail
                  : "resources/images/no-img.png"
              }
              alt={"thumbnail"}
              width={"clamp(130px, 72%, 170px)"}
              emptyRatio={`1 / 1`}
              border={`${
                data && data.thumbnail
                  ? "1px solid #fafafa"
                  : "1px solid #f43528"
              }`}
            />
          </FlexChild>
          <FlexChild>
            <Center>
              <Inline>
                <P
                  lineClamp={1}
                  textOverflow={"ellipsis"}
                  whiteSpace={"wrap"}
                  overflow={"hidden"}
                  size={14}
                >
                  {data?.product?.title}
                </P>
              </Inline>
            </Center>
          </FlexChild>
          <FlexChild marginBottom={5}>
            <Center>
              <Inline>
                <P
                  lineClamp={1}
                  textOverflow={"ellipsis"}
                  whiteSpace={"wrap"}
                  overflow={"hidden"}
                  size={14}
                  weight={500}
                >
                  {data?.title}
                </P>
              </Inline>
            </Center>
          </FlexChild>
          <FlexChild>
            <Center>
              <P size={16} color={"var(--admin-text-color)"} weight={500}>
                {data.inventory_quantity || 0}개
              </P>
            </Center>
          </FlexChild>
        </VerticalFlex>
      </div>
    );
  };
  return (
    <Div width={"100%"} height={342}>
      <div className={styles.wrap2}>
        <VerticalFlex gap={30} height="100%">
          <FlexChild height="min-content">
            <div className={styles.label}>
              <HorizontalFlex>
                <FlexChild width={"max-content"}>
                  <HorizontalFlex gap={10}>
                    <FlexChild width={"fit-content"}>
                      <Center>
                        <Icon name={"soldOut_white"} width={25} />
                      </Center>
                    </FlexChild>
                    <FlexChild>
                      <Center width={"100%"} textAlign={"left"}>
                        <P size={18} color={"white"} weight={600}>
                          품절 상품
                        </P>
                      </Center>
                    </FlexChild>
                  </HorizontalFlex>
                </FlexChild>
                <FlexChild
                  width={"max-content"}
                  hidden={origin?.content?.totalPages === 1}
                >
                  <VerticalFlex>
                    <FlexChild
                      onClick={() =>
                        NiceModal.show("table", {
                          name: "outOfStock",
                          width: "70vw",
                          height: "80vh",
                          columns: [
                            {
                              label: "썸네일",
                              Cell: ({ row }) => (
                                <Image
                                  src={
                                    row?.thumbnail || row?.product?.thumbnail
                                  }
                                  size={100}
                                />
                              ),
                            },
                            {
                              label: "상품/옵션명",
                              Cell: ({ row }) =>
                                `${row?.product?.title} ${row.title}`,
                            },
                            {
                              label: "재고수량",
                              code: "stack",
                            },
                            {
                              label: "전시여부",
                              code: "visible",
                            },
                            {
                              label: "판매여부",
                              code: "buyable",
                            },
                          ] as Column[],
                          onReprocessing: (data: any) =>
                            data?.content?.content || [],
                          initCondition: {
                            _type: "outOfStock",
                            order: {
                              stack: "asc",
                            },
                          },
                          onMaxPage: (data: any) => data?.content?.totalPages,
                          onSearch: (condition: any) =>
                            adminRequester.getVariants(condition),
                        })
                      }
                    >
                      <Button styleType="admin">
                        <P size={13} weight={500}>
                          + 더보기
                        </P>
                      </Button>
                    </FlexChild>
                  </VerticalFlex>
                </FlexChild>
              </HorizontalFlex>
            </div>
          </FlexChild>
          <FlexChild>
            <div style={{ height: "100%" }}>
              <HorizontalFlex gap={10} padding={"0 20px"} alignItems="start">
                {data &&
                  data.map((datum, index) => (
                    <FlexChild key={index}>
                      <DummyProduct
                        type={"취소"}
                        data={datum}
                        size={data.length}
                      />
                    </FlexChild>
                  ))}
                {data &&
                  data.length > 0 &&
                  data.length < 3 &&
                  [0, 1, 2]
                    .filter((f) => f >= data.length)
                    .map((index) => <FlexChild key={`dummy_${index}`} />)}
                {data.length === 0 && (
                  <HorizontalFlex justifyContent="center">
                    <P textAlign="center">없음</P>
                  </HorizontalFlex>
                )}
              </HorizontalFlex>
            </div>
          </FlexChild>
        </VerticalFlex>
      </div>
    </Div>
  );
}

export function AlmostOutStockProduct({ Almost }: { Almost: any }) {
  const {
    almostOutOfStock: data,
    origin,
  }: { [x: string]: any[]; origin?: any } = useData(
    "almostOutOfStock",
    {
      _type: "almostOutOfStock",
      pageSize: 3,
      order: {
        stack: "asc",
      },
    },
    (condition) => adminRequester.getVariants(condition),
    {
      onReprocessing: (data) => data?.content?.content || [],
      fallbackData: Almost,
    }
  );
  const DummyProduct = (props: any) => {
    const { data } = props;
    return (
      <div className={styles.dummyWrap}>
        <VerticalFlex>
          <FlexChild justifyContent={"center"} marginBottom={10}>
            {/* <img
              style={{ width: "100%" }}
              src={data && data.thumbnail}
              alt={"thumbnail"}
            /> */}
            <Image
              src={
                data && data.thumbnail
                  ? data.thumbnail
                  : "resources/images/no-img.png"
              }
              alt={"thumbnail"}
              width={"clamp(130px, 72%, 170px)"}
              emptyRatio={`1 / 1`}
              border={`${
                data && data.thumbnail
                  ? "1px solid #fafafa"
                  : "1px solid #f43528"
              }`}
            />
          </FlexChild>
          <FlexChild>
            <Center>
              <Inline>
                <P
                  lineClamp={1}
                  textOverflow={"ellipsis"}
                  whiteSpace={"wrap"}
                  overflow={"hidden"}
                  size={14}
                >
                  {data?.product?.title}
                </P>
              </Inline>
            </Center>
          </FlexChild>
          <FlexChild>
            <Center>
              <Inline>
                <P
                  lineClamp={1}
                  textOverflow={"ellipsis"}
                  whiteSpace={"wrap"}
                  overflow={"hidden"}
                  size={14}
                  weight={500}
                >
                  {data?.title}
                </P>
              </Inline>
            </Center>
          </FlexChild>
          <FlexChild>
            <Center>
              <Inline>
                <P
                  size={16}
                  weight={500}
                  color={data.stack < 50 ? "var(--admin-color)" : "orange"}
                >
                  {data.stack || 0}
                </P>
                <P size={16} weight={500}>
                  {" / "}
                </P>
                <P size={16} weight={500}>
                  {100}개
                </P>
              </Inline>
            </Center>
          </FlexChild>
        </VerticalFlex>
      </div>
    );
  };
  return (
    <Div width={"100%"} height={342}>
      <div className={styles.wrap2}>
        <VerticalFlex gap={30} height="100%">
          <FlexChild height={"min-content"}>
            <div className={styles.label}>
              <HorizontalFlex>
                <FlexChild width={"max-content"}>
                  <HorizontalFlex gap={10}>
                    <FlexChild width={"fit-content"}>
                      <Center>
                        <Icon name={"soldOut_Almost_white"} width={25} />
                      </Center>
                    </FlexChild>
                    <FlexChild>
                      <Center width={"100%"} textAlign={"left"}>
                        <P size={18} color={"white"} weight={600}>
                          품절 임박 상품
                        </P>
                      </Center>
                    </FlexChild>
                  </HorizontalFlex>
                </FlexChild>
                <FlexChild
                  width={"max-content"}
                  hidden={origin?.content?.totalPages === 1}
                >
                  <VerticalFlex>
                    <FlexChild
                      onClick={() =>
                        NiceModal.show("table", {
                          name: "almostOutOfStock",
                          width: "70vw",
                          height: "80vh",
                          columns: [
                            {
                              label: "썸네일",
                              Cell: ({ row }) => (
                                <Image
                                  src={
                                    row?.thumbnail || row?.product?.thumbnail
                                  }
                                  size={100}
                                />
                              ),
                            },
                            {
                              label: "상품/옵션명",
                              Cell: ({ row }) =>
                                `${row?.product?.title} ${row.title}`,
                            },
                            {
                              label: "재고수량",
                              code: "stack",
                            },
                            {
                              label: "전시여부",
                              code: "visible",
                            },
                            {
                              label: "판매여부",
                              code: "buyable",
                            },
                          ] as Column[],
                          onReprocessing: (data: any) =>
                            data?.content?.content || [],
                          initCondition: {
                            _type: "almostOutOfStock",
                            order: {
                              stack: "asc",
                            },
                          },
                          onMaxPage: (data: any) => data?.content?.totalPages,
                          onSearch: (condition: any) =>
                            adminRequester.getVariants(condition),
                        })
                      }
                    >
                      <Button styleType="admin">
                        <P color={"#ffffff"} size={13} weight={500}>
                          + 더보기
                        </P>
                      </Button>
                    </FlexChild>
                  </VerticalFlex>
                </FlexChild>
              </HorizontalFlex>
            </div>
          </FlexChild>
          <FlexChild>
            <div style={{ height: "100%" }}>
              <HorizontalFlex gap={10} padding={"0 20px"} alignItems="start">
                {data &&
                  data.map((data, index) => (
                    <FlexChild key={index}>
                      <DummyProduct data={data} type={"취소"} />
                    </FlexChild>
                  ))}
                {data &&
                  data.length > 0 &&
                  data.length < 3 &&
                  [0, 1, 2]
                    .filter((f) => f >= data.length)
                    .map((index) => <FlexChild key={`dummy_${index}`} />)}
                {data.length === 0 && (
                  <HorizontalFlex justifyContent="center">
                    <P textAlign="center">없음</P>
                  </HorizontalFlex>
                )}
              </HorizontalFlex>
            </div>
          </FlexChild>
        </VerticalFlex>
      </div>
    </Div>
  );
}

export function ChoiceToggleMenu({
  title,
  content,
  icon,
  name,
  data,
}: {
  title: string;
  content: string;
  icon?: JSX.Element | string;
  name?: string;
  data?: any;
}) {
  return (
    <div
      className={styles.toggleMenu}
      onClick={() => {
        if (name) {
          NiceModal.show(name, data || {});
        }
      }}
    >
      <div className={styles.toggleWrap}>
        <HorizontalFlex>
          <FlexChild width={"max-content"}>
            <div className={styles.iconArea}>
              {typeof icon === "string" ? (
                <Image
                  src={icon}
                  size={60}
                  onClick={() => {
                    if (name) {
                      NiceModal.show(name);
                    }
                  }}
                />
              ) : (
                icon
              )}
            </div>
          </FlexChild>
          <FlexChild>
            <Center width={"100%"} textAlign="left" height={80}>
              <P weight={"bold"} size={18} color="#3c4b64">
                {title}
              </P>
              <Dummy height={15} />
              <P size={14}>{content}</P>
            </Center>
          </FlexChild>
        </HorizontalFlex>
      </div>
    </div>
  );
}
