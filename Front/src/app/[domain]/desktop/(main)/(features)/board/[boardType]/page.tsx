import EventBoard from "./event/event";
import InquiryBoard from "./inquiry/inquiry";
import NoticeBoard from "./notice/notice";

import { Params } from "next/dist/server/request/params";
import PhotoReview from "./(community)/photoReview/photoReview";

export default async function BoardPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { boardType } = await params; // 비동기 해제

  return (
    <>
      {boardType === "notice" && <NoticeBoard />}
      {boardType === "photoReview" && <PhotoReview />}
      {boardType === "inquiry" && <InquiryBoard />}
      {boardType === "event" && <EventBoard />}
    </>
  );
}
