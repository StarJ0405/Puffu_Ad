import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import Container from "@/components/container/Container";
import Center from "@/components/center/Center";
import Input from "@/components/inputs/Input";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Link from "next/link";
import clsx from "clsx";
import style from './page.module.css'

import { SelectBox, AgreeInfo } from "./client";
import ChoiceChild from "@/components/choice/ChoiceChild";
import ChoiceGroup from "@/components/choice/ChoiceGroup";

export default async function () {

   const cart = [
      {
         title: '여성용) 핑크색 일본 st 로제 베일 가운',
         thumbnail: '/resources/images/dummy_img/product_07.png',
         brand: '푸푸토이',
         price: '20,000',
         option: [
            {title: '여성용) 핑크색 일본 컬러 레드', price: '0'},
            {title: '여성용) 핑크색 일본 1+1 증정', price: '1,000'},
         ],
         delivery: '/resources/icons/cart/cj_icon.png',
      },
      {
         title: '여성용) 핑크색 일본 st 로제 베일 가운',
         thumbnail: '/resources/images/dummy_img/product_07.png',
         brand: '푸푸토이',
         price: '20,000',
         option: [
            {title: '여성용) 핑크색 일본 컬러 레드', price: '0'},
            {title: '여성용) 핑크색 일본 1+1 증정', price: '1,000'},
         ],
         delivery: '/resources/icons/cart/cj_icon.png',
      }
   ]

   return (
      <section className="root">
         <Container className={clsx('desktop_container', style.container)} marginTop={50}>
            <h3 className={style.title}>장바구니</h3>

            <HorizontalFlex className={style.cart_wrap}>
               <VerticalFlex className={style.cart_data}>
                  <CheckboxGroup name="cart_list">
                     <VerticalFlex className={style.product_list}>
                        <article>
                           <P className={style.list_title}>담은 상품</P>
                              <FlexChild alignItems="center" gap={10} paddingBottom={40}>
                                 <CheckboxAll />
                                 <Span>전체선택</Span>
                              </FlexChild>
                        </article>

                        {// 담은 상품 목록
                           cart.map((item, i)=> (
                              <VerticalFlex className={style.cart_item} key={i} gap={20}>
                                 
                                 <HorizontalFlex justifyContent="start">
                                    <FlexChild width={'auto'} marginRight={15} alignSelf="start">
                                       <CheckboxChild className={style.checkbox} id={`cart_${i}`}/>
                                    </FlexChild>
                                    <FlexChild className={style.unit} width={'auto'}>
                                       <Image src={item.thumbnail} width={150} />
                                       <VerticalFlex className={style.unit_content} width={'auto'} alignItems="start">
                                          <Span className={style.unit_brand}>{item.brand}</Span>
                                          <P 
                                             className={style.unit_title}
                                             lineClamp={2}
                                             overflow="hidden"
                                             display="--webkit-box"
                                          >
                                             {item.title}
                                          </P>
                                          <FlexChild className={style.unit_price}>
                                             <Image src={item.delivery} width={22} />
                                             <P>{item.price} <Span>₩</Span></P>
                                          </FlexChild>
                                          <VerticalFlex className={style.optionList}>
                                             {
                                                item.option.map((opItem, i)=> (
                                                   <FlexChild key={i}>
                                                      <P>
                                                         {opItem.title}
                                                         <Span> + {opItem.price}원</Span>
                                                      </P> 
                                                   </FlexChild>
                                                ))
                                             }
                                          </VerticalFlex>
                                       </VerticalFlex>
                                    </FlexChild>
                                 </HorizontalFlex>

                                 {/* 갯수 추가 */}
                                 <HorizontalFlex className={style.totalPrice} justifyContent="end">
                                    <FlexChild width={'auto'}>
                                       <InputNumber
                                       //   value={item.quantity}
                                       //   onChange={handleQuantityChange}
                                       //   disabled={loading}
                                          min={1}
                                          max={99}
                                          hideArrow={false}
                                          width={"40px"}
                                          style={{
                                             fontSize: "14px",
                                             color: "#353535",
                                          }}
                                       />
                                    </FlexChild>
                                    <P>{item.price} <Span>₩</Span></P>
                                 </HorizontalFlex>
                              </VerticalFlex>
                           ))
                        }
                     </VerticalFlex>
                  </CheckboxGroup>

                  {/* <FlexChild className={style.delivery_root}>
                     <VerticalFlex alignItems="start">
                        <article>
                           <P className={style.list_title}>배송방법</P>
                        </article>

                        <HorizontalFlex marginTop={15}>
                           <FlexChild className={style.delivery_btn}>
                              <Image src="/resources/icons/cart/delivery_icon.png" width={36} />
                              <Span>배송</Span>
                           </FlexChild>
                        </HorizontalFlex>
                     </VerticalFlex>
                  </FlexChild> */}

                  <FlexChild className={style.delivery_info}>
                     <VerticalFlex alignItems="start">
                        <article>
                           <P className={style.list_title}>배송 정보</P>
                           <Button className={style.delivery_list_btn}>배송지 목록</Button>
                        </article>

                        <VerticalFlex className={style.info_list}>
                           <HorizontalFlex className={style.info_item}>
                              <Span>이름</Span>
                              <P>테스트</P>
                           </HorizontalFlex>

                           <HorizontalFlex className={style.info_item}>
                              <Span>배송주소</Span>
                              <P>(35353) 서구 도안동로 234 대전 303동 1302호</P>
                           </HorizontalFlex>

                           <HorizontalFlex className={style.info_item}>
                              <Span>연락처</Span>
                              <P>01012345678</P>
                           </HorizontalFlex>

                           <VerticalFlex className={clsx(style.info_item, style.info_select_box)}>
                              <Span>배송 요청사항 선택</Span>
                              
                              <SelectBox />
                           </VerticalFlex>
                        </VerticalFlex>
                     </VerticalFlex>
                  </FlexChild>

                  <FlexChild className={style.payment_root}>
                     <VerticalFlex alignItems="start">
                        <article>
                           <P className={style.list_title}>결제수단</P>
                           <P className={style.list_txt}>결제수단을 선택해 주세요.</P>
                        </article>

                        <ChoiceGroup name={'payment_root'}>
                           <VerticalFlex className={style.payment_deak}>
                                 <FlexChild className={clsx(style.payment_card)}>
                                    <FlexChild width={'auto'}>
                                       <ChoiceChild id={'credit_card'} />
                                    </FlexChild>
                                    <Span>신용카드 결제</Span>
                                 </FlexChild>
                           </VerticalFlex>
                        </ChoiceGroup>
                     </VerticalFlex>
                  </FlexChild>
                  
                  
                  <FlexChild className={style.agree_info}>
                     <AgreeInfo />
                  </FlexChild>
               </VerticalFlex>

               <FlexChild className={style.payment_block}>
                  <VerticalFlex>
                     <VerticalFlex alignItems="start">
                        <article>
                           <P className={style.list_title}>결제 금액</P>
                        </article>
   
                        <VerticalFlex className={style.info_list}>
                           <HorizontalFlex className={style.info_item}>
                              <Span>상품 금액</Span>
      
                              <P>28,000 <Span>₩</Span></P>
                           </HorizontalFlex>
      
                           <HorizontalFlex className={style.info_item}>
                              <Span>배송비</Span>
                              
                              <P>0 <Span>₩</Span></P>
                           </HorizontalFlex>
      
                           <HorizontalFlex className={style.info_item}>
                              <Span>합계</Span>
                              
                              <P color={'var(--main-color1)'}>28,000 <Span color="#fff">₩</Span></P>
                           </HorizontalFlex>
                        </VerticalFlex>
                     </VerticalFlex>

                     <FlexChild className={style.total_pay_txt}>
                        <Span>총 결제 금액</Span>
                        <P color={'var(--main-color1)'}>28,000 <Span color="#fff">₩</Span></P>
                     </FlexChild>

                     <FlexChild marginTop={30}>
                        {/* 결제 정보 전부 체크되기 전에는 disabled class 처리하고 경고문 띄우기  */}
                        <Button className={clsx(style.payment_btn, style.disabled)}>
                           <Span>결제하기</Span>
                        </Button>
                     </FlexChild>
                  </VerticalFlex>
               </FlexChild>
            </HorizontalFlex>
         </Container>
      </section>
   )


}