"use client";

import { Color } from "@/app/admin/desktop/(main)/store/regist/regist";
import useData from "@/shared/hooks/data/useData";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { requester } from "@/shared/Requester";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../AuthPorivder/AuthPorivderClient";

export const StoreContext = createContext<{
  storeData?: StoreData | null;
  subdomain?: string | null;
}>({
  storeData: null,
  subdomain: null,
});

export const CategoryContext = createContext<{
  categoriesData: CategoryData[];
}>({ categoriesData: [] });

export const CartContext = createContext<{
  cartData?: CartData;
  reload: () => Promise<void>;
}>({
  reload: async () => {},
});

export default function StoreProviderClient({
  children,
  initStoreData,
  initCategories,
  initCart,
  subdomain,
}: {
  children: React.ReactNode;
  initStoreData: any;
  initCategories: any;
  initCart: any;
  subdomain: string | null;
}) {
  const { userData } = useAuth();
  const { store: storeData } = useData(
    "store",
    { subdomain, relations: ["methods"] },
    (condition) => requester.getStores(condition),
    {
      onReprocessing: (data) => data?.content?.[0] || null,
      fallbackData: initStoreData,
    }
  );
  const { categories: categoriesData } = useData(
    "categories",
    {
      store_id: storeData?.id,
      parent_id: null,
      tree: "descendants",
    },
    (condition) => requester.getCategories(condition),
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initCategories,
    }
  );
  const [type, setType] = useState<string | null>(null);
  const { cart, mutate } = useData(
    "cart",
    {
      store_id: storeData?.id,
      type,
    },
    (condition) => requester.getMyCart(condition),
    {
      fallbackData: initCart,
      refresh: {
        keepPreviousData: true,
      },
      onReprocessing: (data) => {
        return data?.content || null;
      },
    }
  );
  useClientEffect(() => {
    mutate();
  }, [userData]);

  useEffect(() => {
    if (storeData) {
      const colors = (storeData?.metadata?.colors || []) as Color[];
      colors?.forEach((color: Color) => {
        if (color.css)
          document.documentElement.style.setProperty(color.code, color.css);
      });
    }
  }, [storeData]);

  return (
    <StoreContext.Provider
      value={{
        storeData,
        subdomain,
      }}
    >
      <CategoryContext.Provider
        value={{
          categoriesData: (categoriesData || []).map((cat: CategoryData) => {
            if (!userData?.adult)
              return {
                ...cat,
                thumbnail: "/resources/images/19_only_category.png",
              };
            return cat;
          }),
        }}
      >
        <CartContext.Provider value={{ cartData: cart, reload: mutate }}>
          {children}
        </CartContext.Provider>
      </CategoryContext.Provider>
    </StoreContext.Provider>
  );
}
export const useStore = () => useContext(StoreContext);

export const useCategories = () => useContext(CategoryContext);

export const useCart = () => useContext(CartContext);
