"use client";

import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { Cookies } from "@/shared/utils/Data";
import { getCookieOption } from "@/shared/utils/Functions";
import { createContext, useContext, useEffect } from "react";
import { useCookies } from "react-cookie";

export const AdminAuthContext = createContext<{
  userData?: UserData | null;
  reload?: () => Promise<void>;
}>({
  userData: null,
  reload: async () => {},
});

export default function AdminAuthProviderClient({
  children,
  initUserData: initUserData,
}: {
  children: React.ReactNode;
  initUserData: UserData | null;
}) {
  const [cookies, setCookie] = useCookies([Cookies.ADMIN_JWT]);
  const { [Cookies.ADMIN_JWT]: token } = cookies;
  const {
    user: userData,
    mutate,
    origin,
  } = useData(
    "user",
    {},
    (condition) => adminRequester.getCurrentUser(condition),
    {
      onReprocessing: (data) => data?.user,
      fallbackData: initUserData,
    }
  );
  useEffect(() => {
    if (origin.access_token) {
      setCookie(
        Cookies.ADMIN_JWT,
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
    <AdminAuthContext.Provider
      value={{
        userData,
        reload: mutate,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
export const useAdminAuth = () => useContext(AdminAuthContext);
