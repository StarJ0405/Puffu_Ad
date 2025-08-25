import { adminRequester } from "@/shared/AdminRequester";
import Regist from "./regist";

export default async function () {
  const stores: any = await adminRequester.getStores({
    select: ["id", "name", "currency_unit"],
  });
  const brands: any = await adminRequester.getBrands({
    select: ["id", "name"],
  });
  return <Regist stores={stores.content} brands={brands.content} />;
}
