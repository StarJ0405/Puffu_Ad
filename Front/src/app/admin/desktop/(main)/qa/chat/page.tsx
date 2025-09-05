import { adminRequester } from "@/shared/AdminRequester";
import Client from "./client";

export default async function () {
  const initCondition = {
    pageSize: 30,
  };
  const initChatrooms = await adminRequester.getMyChatrooms(initCondition);
  return <Client initCondition={initCondition} initChatrooms={initChatrooms} />;
}
