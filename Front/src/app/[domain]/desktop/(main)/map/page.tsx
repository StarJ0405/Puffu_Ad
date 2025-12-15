// app/.../map/page.tsx
import style from "./page.module.css";
import { MapFrame } from "./client";
import { requester } from "@/shared/Requester";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {

  const { q = "" } = await searchParams;
  const initCondition: { q?: string, pageSize: number } = {
    pageSize: 10
  }
  if (q) {
    initCondition.q = q as string
  }
  const initOfflineStore = await requester.getOfflineStores(initCondition);


  return (
    <div className={style.wrap}>
      <MapFrame initOfflineStore={initOfflineStore} initCondition={initCondition} />
    </div>
  );
}
