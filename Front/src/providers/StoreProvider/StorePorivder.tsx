import { requester } from "@/shared/Requester";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import StoreProviderClient from "./StorePorivderClient";

export default async function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const subdomain = headerList.get("x-subdomain");
  const initStoreData = await requester.getStores({
    subdomain,
    relations: ["methods"],
  });
  const store = initStoreData.content?.[0];
  if (!store) return notFound();
  const initCategories =
    (
      await requester.getCategories({
        store_id: store.id,
        parent_id: null,
        tree: "descendants",
      })
    )?.content || [];
  const initCart = await requester.getMyCart({
    store_id: store.id,
  });

  return (
    <StoreProviderClient
      initStoreData={initStoreData}
      subdomain={subdomain}
      initCategories={initCategories}
      initCart={initCart}
    >
      {children}
    </StoreProviderClient>
  );
}
export const useStore = async (): Promise<{ storeData: StoreData }> => {
  const headerList = await headers();
  const subdomain = headerList.get("x-subdomain");

  const store = (await requester.getStores({ subdomain })).content?.[0];
  return { storeData: store };
};
