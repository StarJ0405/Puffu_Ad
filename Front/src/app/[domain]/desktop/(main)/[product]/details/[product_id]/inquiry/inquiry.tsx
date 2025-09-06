import Button from "@/components/buttons/Button";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import ListPagination from "@/components/listPagination/ListPagination";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import styles from './page.module.css';


export function DetailInquiery() {

   const inquiryTest = [ // 리뷰 게시글 테스트용
      {
         name: 'test',
         title: '상품 관련 문의입니다.',
         date: '2025-08-07', 
         content: '사용해보니까 충전이 됐다 안됐다 하는데 교환 가능할까요', 
         response: '',
      },
      {
         name: 'test',
         title: '상품 관련 문의입니다.',
         date: '2025-08-07', 
         content: '사용해보니까 충전이 됐다 안됐다 하는데 교환 가능할까요', 
         response: `
            안녕하세요. 제품을 정면으로 세운 상태에서 그대로 한바퀴 돌리면 뒤에 있습니다. 
            그래도 모르시겠으면 커뮤니티에서 유저들과 소통해도 도움이 되실 듯 합니다. 감사합니다.
         `,
      },
      {
         name: 'test',
         title: '상품 관련 문의입니다.',
         date: '2025-08-07', 
         content: '사용해보니까 충전이 됐다 안됐다 하는데 교환 가능할까요', 
         response: '',
      },
   ]


   return (
      <VerticalFlex className={styles.inquiry_wrap}>
         <VerticalFlex className={styles.inquiry_board}>

            {/* 문의글 작성란 */}
            <VerticalFlex className={styles.inquiry_write}>
               <FlexChild className={styles.select_item}>
                  <Select
                     classNames={{
                        search: styles.requester_input_body
                     }}

                     options={[
                        { value: "상품 관련 문의", display: "상품 관련 문의" },
                        { value: "재고", display: "재고" },
                        { value: "교환 환불 배송", display: "교환 환불 배송" },
                        { value: "기타", display: "기타" },
                     ]}
                     // placeholder={'선택 안함'}
                     // value={selectedMessageOption}
                  />
               </FlexChild>

               <VerticalFlex className={styles.inquiry_content}>
                  <textarea placeholder="문의글을 적어주세요." ></textarea>
                  <HorizontalFlex className={styles.textarea_bottom}>
                     <CheckboxGroup name='private_Check'>
                        <CheckboxChild id={'private_Check'} />
                        <P>비공개로 작성</P>
                     </CheckboxGroup>
                     <Span>0/300</Span>
                  </HorizontalFlex>
               </VerticalFlex>

               <FlexChild>
                  <Button className={styles.submit_btn}>
                     문의하기
                  </Button>
               </FlexChild>
            </VerticalFlex>


            <VerticalFlex className={styles.inquiry_list}>
               <FlexChild className={styles.list_title}>
                  <P>전체 문의목록</P>
                  <P><Span>{inquiryTest.length}</Span>건</P>
               </FlexChild>
               {
                  inquiryTest.map((inquiry, i)=> (
                     <VerticalFlex key={i} className={styles.inquiry_item}>
                        <VerticalFlex className={styles.user_question}>
                           <HorizontalFlex>
                              <P className={styles.item_title}>{inquiry.title}</P> 
                              {/* 체크된 문의 분류에 따라 만들어진 제목으로 변경됨 */}
   
                              <Button className={styles.toggle_btn}>
                                 <Image src={`/resources/icons/arrow/arrow_bottom_icon.png`} width={11} />
                              </Button>
                           </HorizontalFlex>
   
                           <FlexChild className={styles.data_group}>
                              <FlexChild className={styles.response_check}>
                                 <Span
                                    color={inquiry.response && 'var(--main-color1)'}
                                 >
                                    {inquiry.response ? '답변완료' : '답변대기'}
                                 </Span>
                              </FlexChild>
   
                              <P className={styles.item_name}>
                                 {inquiry.name} {/* 닉네임 뒷글자 *** 표시 */}
                              </P>
   
                              <P className={styles.item_date}>
                                 {inquiry.date}
                              </P>
                           </FlexChild>
   
                           <FlexChild className={styles.item_content}>
                              <P>
                                 {inquiry.content}
                              </P>
                           </FlexChild>
                        </VerticalFlex>

                        <VerticalFlex className={styles.admin_answer}>
                           <FlexChild className={styles.answer_title}>
                              <P color="var(--main-color1)">관리자 답변</P>
                           </FlexChild>

                           <FlexChild className={styles.item_content}>
                              <P>
                                 {inquiry.response}
                              </P>
                           </FlexChild>
                        </VerticalFlex>
                     </VerticalFlex>
                  ))
               }

               <FlexChild>
                  <ListPagination />
               </FlexChild>
               
            </VerticalFlex>
         </VerticalFlex>
      </VerticalFlex>
   )

}