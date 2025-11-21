import { adminRequester } from "@/shared/AdminRequester";
import { Params } from "next/dist/server/request/params";
import Client from "./client";

export default async function ({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  // relations로 템플릿 세부 데이터까지 가져오기
  const contract = await adminRequester.getContract(id as string, {
    relations: ["pages", "pages.input_fields", "contract_users"],
  });

  return <Client contract={contract} />;
}
