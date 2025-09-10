import EventBoard from './event/event';
import InquiryBoard from './inquiry/inquiry';
import NoticeBoard from './notice/notice';


import PhotoReview from './(community)/photoReview/photoReview';

export default async function BoardPage({params} : { params: {boardType: string}}) {

   return (
      <>
         {
            params.boardType === 'notice' && (
               <NoticeBoard />
            )
         }
         {
            params.boardType === 'photoReview' && (
               <PhotoReview />
            )
         }
         {
            params.boardType === 'inquiry' && (
               <InquiryBoard />
            )
         }
         {
            params.boardType === 'event' && (
               <EventBoard />
            )
         }
      </>
   )


}