"use client";

import useData from "@/shared/hooks/data/useData";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { requester } from "@/shared/Requester";
import { Cookies } from "@/shared/utils/Data";
import { getCookieOption } from "@/shared/utils/Functions";
import { createContext, useContext, useEffect } from "react";
import { useCookies } from "react-cookie";

export const AuthContext = createContext<{
  userData?: UserData | null;
  reload: () => Promise<void>;
}>({
  userData: null,
  reload: async () => {},
});

export default function AuthProviderClient({
  children,
  initUserData: initUserData,
}: {
  children: React.ReactNode;
  initUserData: UserData | null;
}) {
  const [cookies, setCookie] = useCookies([Cookies.JWT]);
  const { [Cookies.JWT]: token } = cookies;
  const {
    user: userData,
    mutate,
    origin,
  } = useData("user", {}, () => requester.getCurrentUser(), {
    onReprocessing: (data) => data?.user,
    fallbackData: initUserData,
  });
  useEffect(() => {
    if (origin?.access_token) {
      setCookie(
        Cookies.JWT,
        origin?.access_token,
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
    <AuthContext.Provider
      value={{
        userData,
        reload: mutate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
