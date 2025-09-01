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
import {ProductSlider} from './client';
import {MainCatgeory} from '../Category/mainCategory'
import style from './page.module.css'


export default async function () {

  const link_banner = [
    {link: '/', src: '/resources/images/dummy_img/link_banner_01.png'},
    {link: '/', src: '/resources/images/dummy_img/link_banner_02.png'},
    {link: '/', src: '/resources/images/dummy_img/link_banner_03.png'},
    {link: '/', src: '/resources/images/dummy_img/link_banner_04.png'}
  ]

  return (
    <>
      <MainBanner />

      <VerticalFlex marginTop={'35px'} marginBottom={'100px'} gap={80} className="desktop_container">
        <VerticalFlex className={style.category_sec}>
          <VerticalFlex className={style.ca_title}>
            <Image 
              src='/resources/images/desktop/category_main_icon.png'
              width={65}
              height={'auto'}
            />
            <P className="SacheonFont">카테고리 메뉴</P>
          </VerticalFlex>

          <MainCatgeory /> {/* 카테고리 */}
        </VerticalFlex>

        <FlexChild width={'auto'}>
          <div className={style.link_Banner}>
            {
              link_banner.map((item, i) => (
                <Link href={item.link} key={i}>
                  <Image 
                    src={item.src}
                    width={'100%'}
                    height={'auto'}
                  />
                </Link>
              ))
            }
          </div>
        </FlexChild>

        <FlexChild>
          <VerticalFlex>
            <HorizontalFlex className={clsx(style.titleBox, style.titleBox1)} justifyContent="start" alignItems="end" gap={50}>
              <div className={style.title}>
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
                <Link className={style.linkBtn} href={'/Sale'}>더보기</Link>
              </FlexChild>
            </HorizontalFlex>

            <ProductSlider id={'sale'} lineClamp={1} />

          </VerticalFlex>
        </FlexChild>


        <FlexChild>
          <VerticalFlex>
            <HorizontalFlex className={style.titleBox} justifyContent="start" alignItems="end" gap={50}>
              <div className={style.title}>
                <h2 className="SacheonFont">
                  <Span>따끈따끈</Span> 신상품
                </h2>
              </div>

              <FlexChild width={'auto'}>
                <Link className={style.linkBtn} href={'/Sale'}>더보기</Link>
              </FlexChild>
            </HorizontalFlex>

            <ProductSlider id={'new'} />

          </VerticalFlex>
        </FlexChild>

        <FlexChild>
          <VerticalFlex>
            <HorizontalFlex className={clsx(style.titleBox, style.titleBox3)} justifyContent="start" alignItems="end" gap={50}>
              <div className={style.title}>
                <h2 className="SacheonFont">
                  <Image 
                    src='/resources/images/toy_logo_icon.png'
                    width={107}
                    height={'auto'}
                  />
                  <P><Span>Pick!</Span> 추천 상품</P>
                </h2>
              </div>

              <FlexChild width={'auto'}>
                <Link className={style.linkBtn} href={'/Sale'}>더보기</Link>
              </FlexChild>
            </HorizontalFlex>

            <ProductSlider id={'pick'} />

          </VerticalFlex>
        </FlexChild>
       

        <FlexChild marginTop={20}>
          <VerticalFlex>
            <FlexChild className={style.titleBox} justifyContent="center">
              <div className={style.title}>
                <h2 className="SacheonFont">전체 상품</h2>
              </div>
            </FlexChild>

            <ProductList /> {/* 메인, 상세 리스트 */}
          </VerticalFlex>
        </FlexChild>
      </VerticalFlex>
    </>
  )
}
