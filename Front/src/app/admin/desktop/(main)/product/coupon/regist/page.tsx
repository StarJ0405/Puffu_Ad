import { adminRequester } from "@/shared/AdminRequester";
import Regist from "./regist";

export default async function () {
  const stores: Pageable = await adminRequester.getStores({
    select: ["id", "name", "currency_unit"],
  });
  const groups: Pageable = await adminRequester.getGroups({
    select: ["id", "name", "min"],
  });
  return <Regist initStores={stores} initGroups={groups} />;
}
