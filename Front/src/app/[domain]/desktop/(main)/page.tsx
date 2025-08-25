import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import style from './page.module.css'
import {MainBanner} from './client'


export default async function () {

  return (
    <>
      <MainBanner />

      <VerticalFlex marginTop={'35px'} gap={80}>
        <FlexChild width={'auto'}>
          <h3 className="SacheonFont">카테고리 메뉴</h3>

          
        </FlexChild>
       

        <FlexChild width={'auto'}>
          <VerticalFlex>
            <FlexChild className={style.title}>
              <h3 className="SacheonFont">전체 상품</h3>
            </FlexChild>


          </VerticalFlex>
        </FlexChild>
      </VerticalFlex>
    </>
  )
}
