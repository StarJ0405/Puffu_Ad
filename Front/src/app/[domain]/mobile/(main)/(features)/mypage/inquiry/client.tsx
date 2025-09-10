"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import styles from "./page.module.css";
import ListPagination from "@/components/listPagination/ListPagination";


export function InquiryTable() {
  const inquiryTest = [
    
    {number: '1', Type: '배송', title: '게시판 내용', member: '푸푸토이', answered: '답변완료', date: '2025-09-04 13:48'},
    {number: '2', Type: '회원/정보관리', title: '게시판 내용', member: '푸푸토이', answered: '답변대기', date: '2025-09-04 13:48'},
    {number: '3', Type: '주문/결제', title: '게시판 내용', member: '푸푸토이', answered: '답변완료', date: '2025-09-04 13:48'},
    {number: '4', Type: '반품/환불/교환/AS', title: '게시판 내용', member: '푸푸토이', answered: '답변완료', date: '2025-09-04 13:48'},
    {number: '5', Type: '상품/이벤트', title: '게시판 내용', member: '푸푸토이', answered: '답변대기', date: '2025-09-04 13:48'},
    {number: '6', Type: '기타', title: '게시판 내용', member: '푸푸토이', answered: '답변대기', date: '2025-09-04 13:48'},
    {number: '7', Type: '주문/결제', title: '게시판 내용', member: '푸푸토이', answered: '답변완료', date: '2025-09-04 13:48'},
    {number: '8', Type: '배송', title: '게시판 내용', member: '푸푸토이', answered: '답변완료', date: '2025-09-04 13:48'},
    {number: '9', Type: '배송', title: '게시판 내용', member: '푸푸토이', answered: '답변완료', date: '2025-09-04 13:48'},
    {number: '10', Type: '배송', title: '게시판 내용', member: '푸푸토이', answered: '답변완료', date: '2025-09-04 13:48'},
  ]

  return (
    <>
      <VerticalFlex>
         <FlexChild>
            <table className={styles.list_table}>

               {/* 게시판 셀 너비 조정 */}
               <colgroup>
                  <col style={{width: '10%'}} />
                  <col style={{width: '15%'}} />
                  <col style={{width: '35%'}} />
                  <col style={{width: '15%'}} />
                  <col style={{width: '10%'}} />
                  <col style={{width: '15%'}} />
               </colgroup>
   
               {/* 게시판리스트 헤더 */}
               <thead>
                  <tr className={styles.table_header}>
                     <th>번호</th>
                     <th>분류</th>
                     <th>제목</th>
                     <th>작성자</th>
                     <th>문의상태</th>
                     <th>날짜</th>
                  </tr>
               </thead>
   
               {/* 게시판 내용 */}
               <tbody>
                  {
                     inquiryTest.map((list, i)=> (
                        <tr key={i}>
                           {/* 번호 */}
                           <td>{list.number}</td>

                           {/* 분류 */}
                           <td>{list.Type}</td>

                           {/* 제목 */}
                           <td>
                              <FlexChild gap={5} alignItems="center" height={'100%'} cursor="pointer" className={styles.td_title} width={'fit-content'}>
                                 <Image src={'/resources/icons/board/lock_icon.png'} width={16} />{/* 비밀번호 들어가면 활성화 */}
                                 <P lineClamp={1} overflow="hidden" display="--webkit-box" >{list.title}</P>
                                 <Image src={'/resources/icons/board/new_icon.png'} width={16} />{/* 12시간 내 등록된 게시물만 나타나기 */}
                              </FlexChild>
                           </td>

                           {/* 작성자 */}
                           {/* 공지사항은 관리자가 쓰니까 이름 그대로 나오고, 1:1문의에서는 이름 일부 **로 가려주기 */}
                           <td>
                              <P lineClamp={2} overflow="hidden" display="--webkit-box" weight={500}>
                                 {list.member}
                              </P>
                           </td>

                           {/* 문의상태 */}
                           <td>
                              {
                                 
                              }
                              <Span 
                                 weight={400}
                                 color={`${list.answered === '답변완료' ? '#fff' : '#FF4343'}`}
                              >
                                 {list.answered}
                              </Span>
                           </td>

                           {/* 날짜 */}
                           {/* 공지사항은 년월일까지 표시, 1:1문의는 분시초도 표시. */}
                           <td><Span weight={400}>{list.date}</Span></td>
                        </tr>
                     ))
                  }
               </tbody>
            </table>
            {
               inquiryTest.length > 0 ? null : <NoContent type="문의"/> 
            }
         </FlexChild>
         <FlexChild className={styles.list_bottom_box}>
            <ListPagination />
         </FlexChild>
      </VerticalFlex>
    </>
  );
}
