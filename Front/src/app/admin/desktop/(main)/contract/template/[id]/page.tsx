import VerticalFlex from "@/components/flex/VerticalFlex";
import Client from "./client";
import { adminRequester } from "@/shared/AdminRequester";
import { Params } from "next/dist/server/request/params";

export default async function ({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const contract = await adminRequester.getContract(id as string);

  return <Client contract={contract} />;
}
