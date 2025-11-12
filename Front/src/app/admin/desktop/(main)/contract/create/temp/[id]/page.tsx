import { adminRequester } from "@/shared/AdminRequester";
import { Params } from "next/dist/server/request/params";
import Client from "./client";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function ({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { user_ids } = await searchParams;
  const contract = await adminRequester.getContract(id as string);
  const users = user_ids ? (Array.isArray(user_ids) ? user_ids : user_ids.split(",")) : [];
  // console.log(users)
  return <Client contract={contract} />;
}
