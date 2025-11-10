import { Params } from "next/dist/server/request/params";
import { DetailFrame } from "./client";
import { adminRequester } from "@/shared/AdminRequester";

export default async function ({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  if (!id) throw new Error("템플릿 ID 누락");

  const template = await adminRequester.getContract(String(id));
  return <DetailFrame initTemplate={template} />;
}
