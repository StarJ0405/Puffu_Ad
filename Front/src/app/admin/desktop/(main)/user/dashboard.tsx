"use client";
import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import NiceModal from "@ebay/nice-modal-react";
import styles from "./page.module.css";
import Tooltip from "@/components/tooltip/Tooltip";
import { getCouponDate } from "../product/coupon/management/table";

export function MemberShip({ initGroups }: { initGroups: Pageable }) {
  const { groups, mutate } = useData(
    "groups",
    {
      relations: ["coupons"],
      coupons: {
        user_id: null,
      },
    },
    (condition) => adminRequester.getGroups(condition),
    {
      fallbackData: initGroups,
      onReprocessing: (data) => data?.content || [],
    }
  );
  return (
    <Div width={"100%"} height={342}>
      <div className={styles.wrap}>
        <VerticalFlex height="100%">
          <FlexChild height="min-content">
            <div className={styles.label}>
              <HorizontalFlex>
                <FlexChild width={"max-content"}>
                  <HorizontalFlex gap={10}>
                    <FlexChild width={"fit-content"}>
                      <Center>
                        <Image
                          src={"/resources/images/membership.png"}
                          width={25}
                        />
                      </Center>
                    </FlexChild>
                    <FlexChild>
                      <Center width={"100%"} textAlign={"left"}>
                        <P size={18} color={"white"} weight={600}>
                          맴버쉽
                        </P>
                      </Center>
                    </FlexChild>
                  </HorizontalFlex>
                </FlexChild>
                <FlexChild width={"max-content"}>
                  <VerticalFlex>
                    <FlexChild
                      onClick={() => {
                        NiceModal.show("groupDetail", {
                          onSuccess: () => mutate(),
                        });
                      }}
                    >
                      <Button className={styles.button}>
                        <P>추가</P>
                      </Button>
                    </FlexChild>
                  </VerticalFlex>
                </FlexChild>
              </HorizontalFlex>
            </div>
          </FlexChild>
          <FlexChild>
            <VerticalFlex
              gap={5}
              overflow="scroll"
              hideScrollbar
              maxHeight={287}
            >
              <FlexChild className={styles.header}>
                <HorizontalFlex flexGrow={1}>
                  {["등급명", "누적금액", "적립금", "쿠폰", " "].map(
                    (str, index) => (
                      <FlexChild
                        key={`${str}_${index}`}
                        justifyContent="center"
                      >
                        <P>{str}</P>
                      </FlexChild>
                    )
                  )}
                </HorizontalFlex>
              </FlexChild>
              {groups
                .sort((g1: GroupData, g2: GroupData) => g1.min - g2.min)
                .map((group: GroupData) => (
                  <FlexChild key={group.id} className={styles.row}>
                    <HorizontalFlex flexGrow={1}>
                      <FlexChild justifyContent="center">
                        <P>{group.name}</P>
                      </FlexChild>
                      <FlexChild justifyContent="center">
                        <P>
                          {group.min === 0 ? (
                            <Span>가입 즉시</Span>
                          ) : (
                            <>
                              <Span>{group.min}</Span>
                              <Span>원 이상</Span>
                            </>
                          )}
                        </P>
                      </FlexChild>
                      <FlexChild justifyContent="center">
                        <P>{group.percent}%</P>
                      </FlexChild>
                      <FlexChild justifyContent="center">
                        {group.coupons?.length ? (
                          <VerticalFlex>
                            {group.coupons.map((coupon) => (
                              <VerticalFlex key={coupon.id}>
                                <P>{coupon.name}</P>
                                <P>
                                  <Span>({getCouponDate(coupon)} / </Span>
                                  <Span>{coupon.value}</Span>
                                  <Span>
                                    {coupon.calc === "fix" ? "원" : "%"})
                                  </Span>
                                </P>
                              </VerticalFlex>
                            ))}
                          </VerticalFlex>
                        ) : (
                          <P>미설정</P>
                        )}
                      </FlexChild>
                      <FlexChild justifyContent="center" gap={3}>
                        <Button
                          className={styles.button}
                          onClick={() =>
                            NiceModal.show("groupDetail", {
                              group: group,
                              onSuccess: () => mutate(),
                            })
                          }
                        >
                          수정
                        </Button>
                        <Button
                          className={styles.button}
                          onClick={() =>
                            NiceModal.show("confirm", {
                              message: "삭제하시겠습니까?",
                              cancelText: "취소",
                              confirmText: "삭제",
                              onConfirm: () =>
                                adminRequester.deleteGroup(group.id, {}, () =>
                                  mutate()
                                ),
                            })
                          }
                        >
                          삭제
                        </Button>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                ))}
            </VerticalFlex>
          </FlexChild>
        </VerticalFlex>
      </div>
    </Div>
  );
}
