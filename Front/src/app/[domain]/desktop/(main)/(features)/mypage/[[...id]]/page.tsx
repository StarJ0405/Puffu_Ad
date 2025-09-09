import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { Params } from "next/dist/server/request/params";
import Container from "@/components/container/Container";
import styles from './page.module.css'
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Image from '@/components/Image/Image'
import P from '@/components/P/P'
import Button from "@/components/buttons/Button";
import Link from "next/link";
import Span from "@/components/span/Span";

export default async function ({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  console.log(id);

  const myshopMenu = [
    {name: '내 주문 내역', link: '/'},
    {name: '최근 본 상품', link: '/'},
    {name: '관심리스트', link: '/'},
  ]

  const myInfoMenu = [
    {name: '배송지 관리', link: '/'},
    {name: '1:1 문의내역', link: '/'},
    {name: '리뷰 관리', link: '/'},
    {name: '회원탈퇴', link: '/'},
  ]

  return (
    <section className="root desctop_container">
      <Container>
        <HorizontalFlex className={styles.mypage_wrap} gap={30}>

          {/* 왼쪽 메뉴 */}
          <VerticalFlex>
            <VerticalFlex className={styles.profile}>
              <VerticalFlex>
                <FlexChild className={styles.thumbnail}>
                  <Image src={'/resources/images/dummy_img/product_01.png'} width={80} />
                </FlexChild>
                <FlexChild>
                  <P>콘푸로스트123</P>
                </FlexChild>
              </VerticalFlex>
  
              <FlexChild>
                <Button className={styles.link_btn}>관심 리스트</Button>
              </FlexChild>
            </VerticalFlex>
  
            <FlexChild>
              <VerticalFlex className={styles.outer_menu}>
                <P>쇼핑정보</P>
  
                <ul className={styles.inner_menu}>
                  {
                    myshopMenu.map((item, i)=> (
                      <li key={i}>
                        <Link href={item.link}>
                          <Span>{item.name}</Span>
                          <Image src={'/resources/icons/arrow/slide_arrow.png'} width={13} />
                        </Link>
                      </li>
                    ))
                  }
                </ul>
              </VerticalFlex>
  
              <VerticalFlex className={styles.outer_menu}>
                <P>내 정보 관리</P>
  
                <ul className={styles.inner_menu}>
                  <li>
                    <Link href={'/'}>
                      <Span>개인정보 수정</Span>
                      <Image src={'/resources/icons/arrow/slide_arrow.png'} width={13} />
                    </Link>
                  </li>
                  {
                    myshopMenu.map((item, i)=> (
                      <li key={i}>
                        <Link href={item.link}>
                          <Span>{item.name}</Span>
                          <Image src={'/resources/icons/arrow/slide_arrow.png'} width={13} />
                        </Link>
                      </li>
                    ))
                  }
                  <li>
                    <Link href={'/'}>
                      <Span>로그아웃</Span>
                      <Image src={'/resources/icons/arrow/slide_arrow.png'} width={13} />
                    </Link>
                  </li>
                </ul>
              </VerticalFlex>
            </FlexChild>
          </VerticalFlex>

          {/* 오른쪽 내용 */}
          <VerticalFlex>
            <FlexChild className={styles.delivery_box}>
              <FlexChild>
                <P>주문 배송 현황</P>
              </FlexChild>
            </FlexChild>

            <FlexChild className={styles.delivery_box}>
              <FlexChild>
                <P>리뷰 관리</P>
              </FlexChild>
            </FlexChild>

            <FlexChild className={styles.delivery_box}>
              <FlexChild>
                <P>문의 내역</P>
              </FlexChild>
            </FlexChild>

            <FlexChild className={styles.delivery_box}>
              <FlexChild>
                <P>최근 본 상품</P>
              </FlexChild>
            </FlexChild>
          </VerticalFlex>
        </HorizontalFlex>
      </Container>
    </section>
  )
}
