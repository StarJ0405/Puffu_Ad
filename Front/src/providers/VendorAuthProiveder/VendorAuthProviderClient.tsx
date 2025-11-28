"use client";

import { vendorRequester } from "@/shared/VendorRequester";
import useData from "@/shared/hooks/data/useData";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { Cookies } from "@/shared/utils/Data";
import { getCookieOption } from "@/shared/utils/Functions";
import { createContext, useContext, useEffect } from "react";
import { useCookies } from "react-cookie";

export const VendorAuthContext = createContext<{
  userData?: UserData | null;
  reload?: () => Promise<void>;
}>({
  userData: null,
  reload: async () => {},
});

export default function VendorAuthProviderClient({
  children,
  initUserData: initUserData,
}: {
  children: React.ReactNode;
  initUserData: UserData | null;
}) {
  const [cookies, setCookie] = useCookies([Cookies.VENDOR_JWT]);
  const { [Cookies.VENDOR_JWT]: token } = cookies;
  const {
    user: userData,
    mutate,
    origin,
  } = useData(
    "user",
    {},
    (condition) => vendorRequester.getCurrentUser(condition),
    {
      onReprocessing: (data) => data?.user,
      fallbackData: initUserData,
    }
  );
  useEffect(() => {
    if (origin?.access_token) {
      setCookie(
        Cookies.VENDOR_JWT,
        origin.access_token,
        getCookieOption({
          maxAge: 60 * 60 * 24 * 31,
        })
      );
    }
  }, [origin]);
  useClientEffect(() => {
    mutate();
  }, [token]);

  return (
    <VendorAuthContext.Provider
      value={{
        userData,
        reload: mutate,
      }}
    >
      {children}
    </VendorAuthContext.Provider>
  );
}
export const useVendorAuth = () => useContext(VendorAuthContext);
