"use client";
import { Cookies } from "@/shared/utils/Data";
import { usePathname } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCookies } from "react-cookie";

export const BrowserDetectContext = createContext<{
  deviceType: DeviceType;
  OS: OSType;
  webView: boolean;
  isMobile: boolean;
  isDeskTop: boolean;
  isTablet: boolean;
  subdomain: string;
  isReload: boolean;
  setIsReload: Dispatch<SetStateAction<boolean>>;
}>({
  deviceType: "" as DeviceType,
  OS: "" as OSType,
  webView: false,
  isMobile: false,
  isDeskTop: false,
  isTablet: false,
  subdomain: "",
  isReload: false,
  setIsReload: () => {},
});

const MOBILE_MAX_WIDTH = 768;
const TABLET_MAX_WIDTH = 1024;

export default function BrowserEventProviderClient({
  children,
  initDeviceType,
  initOS,
  initWebView,
  subdomain,
}: {
  children: React.ReactNode;
  initDeviceType: DeviceType;
  initOS: OSType;
  initWebView: boolean;
  subdomain: string;
}) {
  const [deviceType] = useState(initDeviceType);
  const [OS] = useState(initOS);
  const [webView] = useState(initWebView);
  const [isReload, setIsReload] = useState(false);
  const pathname = usePathname();
  const [cookie] = useCookies([Cookies.HISTORY]);
  useEffect(() => {
    const handlePopstate = () => {
      setIsReload(true);
    };
    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  useEffect(() => {
    if (isReload) {
      const history = cookie?.[Cookies.HISTORY];
      if (history) {
        const scrollTop = history?.[pathname];
        if (scrollTop > 0) {
          const interval = setInterval(() => {
            const scroll = document.getElementById("scroll");
            if (
              scroll &&
              scroll.scrollHeight - scroll.clientHeight >= scrollTop
            ) {
              scroll.scrollTop = scrollTop;
              setIsReload(false);
              clearInterval(interval);
            }
          }, 100);
        }
      }
    }
  }, [pathname, isReload]);
  return (
    <BrowserDetectContext.Provider
      value={{
        deviceType,
        OS,
        webView,
        isMobile: deviceType === "mobile",
        isDeskTop: deviceType === "desktop",
        isTablet: deviceType === "tablet",
        subdomain,
        isReload,
        setIsReload,
      }}
    >
      {children}
    </BrowserDetectContext.Provider>
  );
}

export const useBrowserEvent = () => useContext(BrowserDetectContext);
