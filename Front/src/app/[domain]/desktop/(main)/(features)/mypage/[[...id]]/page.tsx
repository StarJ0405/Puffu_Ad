import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { Params } from "next/dist/server/request/params";
import Container from "@/components/container/Container";
import styles from "./page.module.css";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import Link from "next/link";
import Span from "@/components/span/Span";
import clsx from "clsx";

import { MypageNavi } from "./client";
import NoContent from "@/components/noContent/noContent";

// import {RecentlyViewTable} from '../recentlyView/client'

export default async function ({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  console.log(id);

  return (
    <section className="root desctop_container">
      <Container paddingTop={50}>
        <HorizontalFlex className={styles.mypage_wrap} gap={30}>
          {/* 왼쪽 메뉴 */}
          <VerticalFlex gap={20} className={styles.left_bar}>
            <VerticalFlex className={clsx(styles.profile, styles.box_frame)}>
              <VerticalFlex gap={20}>
                <FlexChild width={"auto"} position="relative">
                  <FlexChild className={styles.thumbnail} width={"auto"}>
                    <Image
                      src={"/resources/images/dummy_img/product_01.png"}
                      width={80}
                    />
                  </FlexChild>

                  <FlexChild className={styles.setting_btn}>
                    <Image
                      src={"/resources/icons/mypage/setting_icon.png"}
                      width={16}
                    />
                  </FlexChild>
                </FlexChild>

                <FlexChild width={"auto"} className={styles.profile_name}>
                  <P>콘푸로스트123</P>
                </FlexChild>
              </VerticalFlex>

              <FlexChild className={styles.link_btn}>
                <Button>관심 리스트</Button>
              </FlexChild>
            </VerticalFlex>

            <MypageNavi />
          </VerticalFlex>

          {/* 오른쪽 내용 */}
          <VerticalFlex className={styles.right_bar}>
            <VerticalFlex
              className={clsx(styles.box_frame, styles.delivery_box)}
            >
              <FlexChild className={styles.box_header}>
                <P>주문 배송 현황</P>
              </FlexChild>

              <FlexChild className={styles.deli_itemBox}>
                <VerticalFlex className={styles.deli_item}>
                  <P>15</P>
                  <Span>상품 준비중</Span>
                </VerticalFlex>

                <VerticalFlex className={styles.deli_item}>
                  <P>21</P>
                  <Span>배송준비</Span>
                </VerticalFlex>

                <VerticalFlex className={styles.deli_item}>
                  <P>4</P>
                  <Span>배송중</Span>
                </VerticalFlex>

                <VerticalFlex className={styles.deli_item}>
                  <P>36</P>
                  <Span>배송완료</Span>
                </VerticalFlex>
              </FlexChild>

              <FlexChild className={styles.link_btn}>
                <Button>내 주문 확인</Button>
              </FlexChild>
            </VerticalFlex>

            <VerticalFlex
              className={clsx(styles.box_frame, styles.delivery_box)}
            >
              <FlexChild className={styles.box_header}>
                <P>리뷰 관리</P>
              </FlexChild>

              <NoContent type={"리뷰"} />
            </VerticalFlex>

            <VerticalFlex
              className={clsx(styles.box_frame, styles.delivery_box)}
            >
              <FlexChild className={styles.box_header}>
                <P>문의 내역</P>
              </FlexChild>

              <NoContent type={"문의"} />
            </VerticalFlex>

            <VerticalFlex
              className={clsx(styles.box_frame, styles.delivery_box)}
            >
              <FlexChild className={styles.box_header}>
                <P>최근 본 상품</P>
              </FlexChild>

              {/* <RecentlyViewTable /> */}
            </VerticalFlex>
          </VerticalFlex>
        </HorizontalFlex>
      </Container>
    </section>
  );
}
