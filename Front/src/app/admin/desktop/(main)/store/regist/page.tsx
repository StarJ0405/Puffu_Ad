import { adminRequester } from "@/shared/AdminRequester";
import Regist from "./regist";

export default async function () {
  const stores: any = await adminRequester.getStores({
    select: ["id", "name"],
  });
  return <Regist initStores={stores} />;
}
