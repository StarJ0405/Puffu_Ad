// app/.../map/page.tsx
import style from "./page.module.css";
import { MapFrame } from "./client";
import { requester } from "@/shared/Requester";

export default async function Page() {

  const initOfflineStore = await requester.getOfflineStores({
    pageSize: 12,
  });
  return (
    <div className={style.wrap}>
      <MapFrame initOfflineStore={initOfflineStore} />
    </div>
  );
}
