import BrowserEventProvider from "./BrowserEventProvider/BrowserEventProvider";
import ProviderWrapperClient from "./ProviderWrapperClient";
export default async function ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProviderWrapperClient>
      <BrowserEventProvider>
        {/*  */}
        {children}
        {/*  */}
      </BrowserEventProvider>
    </ProviderWrapperClient>
  );
}
