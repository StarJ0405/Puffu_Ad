import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import {MainBanner} from './client'
import {ProductList} from './client'
import Link from "next/link";
import clsx from "clsx";
import {MainCategory, LinkBanner, ProductSlider, MiniBanner} from './client';
import styles from './page.module.css';


export default async function () {

  return (
    <section className='root'>
      <MainBanner />

      <VerticalFlex marginTop={'35px'} marginBottom={'100px'} gap={80} className="desktop_container">
        <VerticalFlex className={styles.category_sec}>
          <VerticalFlex className={styles.ca_title}>
            <Image 
              src='/resources/images/category_main_icon.png'
              width={65}
              height={'auto'}
            />
            <P className="SacheonFont">카테고리 메뉴</P>
          </VerticalFlex>

          <MainCategory /> {/* 카테고리 */}
        </VerticalFlex>

        <LinkBanner /> {/* 링크 베너 props로 받은 값만큼만 베너 보여주기 */}

        <FlexChild>
          <VerticalFlex>
            <HorizontalFlex className={clsx(styles.titleBox, styles.titleBox1)} justifyContent="start" alignItems="end" gap={20}>
              <div className={styles.title}>
                <h2 className="SacheonFont" style={{marginBottom: '12px'}}>
                  <Image 
                    src='/resources/images/header/HotDeal_icon.png'
                    width={24}
                    height={'auto'}
                  />
                  데이 <Span color={'#FF4A4D'}>HOT</Span>딜
                </h2>
                <P width={'auto'}>매일 매일 갱신되는 Hot Deal 상품!</P>
              </div>

              <FlexChild width={'auto'}>
                <Link className={styles.linkBtn} href={'/Sale'}>더보기</Link>
              </FlexChild>
            </HorizontalFlex>

            {/* <ProductSlider id={'sale'} lineClamp={1} /> */}
            <ProductList id={'sale'} lineClamp={1} /> {/* 메인, 상세 리스트 */}

          </VerticalFlex>
        </FlexChild>

        <FlexChild>
          <VerticalFlex>
            <HorizontalFlex className={styles.titleBox} justifyContent="start" alignItems="end" gap={20}>
              <div className={styles.title}>
                <h2 className="SacheonFont">
                  <Span>따끈따끈</Span> 신상품
                </h2>
              </div>

              <FlexChild width={'auto'}>
                <Link className={styles.linkBtn} href={'/Sale'}>더보기</Link>
              </FlexChild>
            </HorizontalFlex>

            {/* <ProductSlider id={'new'} /> */}
            <ProductList id={'new'} /> {/* 메인, 상세 리스트 */}

          </VerticalFlex>
        </FlexChild>

        <MiniBanner /> {/* 링크 베너 props로 받은 값만큼만 베너 보여주기 */}

        <FlexChild>
          <VerticalFlex>
            <HorizontalFlex className={styles.titleBox} justifyContent="center" alignItems="end" gap={50}>
              <div className={styles.title}>
                <h2 className="SacheonFont">
                  포토 사용후기
                </h2>
              </div>
            </HorizontalFlex>

            <ProductSlider id={'new'} />

            <FlexChild marginTop={35} justifyContent="center">
              <Link href={'/photoReview'} className={styles.link_more_btn}>
                후기 더보기
              </Link>
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
      </VerticalFlex>
    </section>
  )
}
