"use client";
import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { textFormat } from "@/shared/regExp";
import { scrollTo, toast, validateInputs } from "@/shared/utils/Functions";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

export default function ({ initStores }: { initStores: StoreData[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [store, setStore] = useState<string>("");
  const { stores } = useData(
    "stores",
    { select: ["id", "name", "currency_unit"] },
    (condition) => adminRequester.getStores(condition),
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initStores,
    }
  );
  const inputs = useRef<any[]>([]);

  const handleSave = async () => {
    if (!store) return scrollTo("store", "스토어를 설정해주세요.");

    const name = inputs.current[0].getValue();
    if (!name) return scrollTo("name", "구독 상품명을 입력해주세요.");
    const price = inputs.current[1].getValue();
    if (!price) return scrollTo("price", "판매가를 입력해주세요");

    setIsLoading(true);

    validateInputs(inputs.current)
      .then(({ isValid }: { isValid: boolean }) => {
        if (!isValid) return setIsLoading(false);
        const data: SubscribeDataFrame = {
          store_id: store,
          name,
          price,
          percent: inputs.current[2].getValue(),
          value: inputs.current[3].getValue(),
        };
        adminRequester.createSubscribe(data, () =>
          navigate("/product/subscribe/management")
        );
      })
      .catch(() => {
        toast({ message: "오류가 발생했습니다." });
        setIsLoading(false);
      });
  };
  useEffect(() => {
    if (stores?.length === 1) setStore(stores?.[0]?.id);
  }, [stores]);

  return (
    <Container padding={"20px 20px 60px 20px"}>
      <div className={styles.queryWrap}>
        <FlexChild>
          <div className={styles.container}>
            <VerticalFlex>
              <FlexChild>
                <div className={styles.label}>
                  <Center width={"100%"} textAlign={"left"}>
                    <P size={25} weight={600}>
                      구독 정보입력
                    </P>
                  </Center>
                </div>
              </FlexChild>
              <FlexChild>
                <div className={styles.contentWrap}>
                  <VerticalFlex>
                    <FlexChild hidden={stores?.length === 1}>
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                      >
                        <FlexChild
                          width={"130px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            스토어 설정
                          </P>
                        </FlexChild>
                        <FlexChild paddingRight={15}>
                          <Select
                            id="store"
                            scrollMarginTop={150}
                            options={stores.map((store: StoreData) => ({
                              display: store.name,
                              value: store.id,
                            }))}
                            value={store}
                            onChange={(value) => setStore(value as string)}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild
                      border={"1px solid #EFEFEF"}
                      borderRight={"none"}
                      borderLeft={"none"}
                    >
                      <HorizontalFlex gap={20}>
                        <FlexChild
                          width={"130px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            구독 상품명
                          </P>
                        </FlexChild>
                        <FlexChild paddingRight={15}>
                          <Input
                            scrollMarginTop={150}
                            id="name"
                            ref={(el) => {
                              inputs.current[0] = el;
                            }}
                            name={"구독_상품명"}
                            placeHolder={"구독 상품명을 입력하세요."}
                            regExp={[textFormat]}
                            width={250}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild>
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                        justifyContent={"flex-start"}
                      >
                        <FlexChild
                          width={"130px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            판매가
                          </P>
                        </FlexChild>
                        <FlexChild width={200}>
                          <InputNumber
                            ref={(el) => {
                              inputs.current[1] = el;
                            }}
                            name={"판매가"}
                            min={0}
                            max={99999999999999}
                            step={1000}
                            width={250 - 80}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild>
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                        justifyContent={"flex-start"}
                      >
                        <FlexChild
                          width={"130px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            할인율
                          </P>
                        </FlexChild>
                        <FlexChild width={200}>
                          <InputNumber
                            ref={(el) => {
                              inputs.current[2] = el;
                            }}
                            name={"할인율"}
                            min={0}
                            max={100}
                            width={250 - 80}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild>
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                        justifyContent={"flex-start"}
                      >
                        <FlexChild
                          width={"130px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            월간 쿠폰 금액
                          </P>
                        </FlexChild>
                        <FlexChild width={200}>
                          <InputNumber
                            ref={(el) => {
                              inputs.current[3] = el;
                            }}
                            name={"월간_쿠폰_금액"}
                            min={0}
                            max={99999999999999}
                            step={1000}
                            width={250 - 80}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                  </VerticalFlex>
                </div>
              </FlexChild>
            </VerticalFlex>
          </div>
        </FlexChild>

        <FlexChild position="fixed" bottom={10} left={0} right={0}>
          <HorizontalFlex gap={40} height={50}>
            <HorizontalFlex justifyContent={"center"} gap={10}>
              <FlexChild width={"max-content"}>
                <Button
                  styleType="admin"
                  padding={"15px 74px"}
                  borderRadius={5}
                  fontSize={18}
                  fontWeight={700}
                  isLoading={isLoading}
                  onClick={handleSave}
                >
                  등록하기
                </Button>
              </FlexChild>
            </HorizontalFlex>
          </HorizontalFlex>
        </FlexChild>
      </div>
    </Container>
  );
}
