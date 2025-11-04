import styles from "./page.module.css";
import { SearchParams } from "next/dist/server/request/search-params";
import { Client } from "./client";

const pickStr = (v: string | string[] | undefined, def = "") =>
  Array.isArray(v) ? v[0] ?? def : v ?? def;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const q = pickStr(params?.q, "").trim();
  const page = Number(pickStr(params?.page, "1"));
  const sort = pickStr(params?.sort, "updated_at,DESC");

  return <Client initialQ={q} initialPage={page} initialSort={sort} />;
}
