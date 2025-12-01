import { vendorRequester } from "@/shared/VendorRequester";
import VendorAuthProviderClient from "./VendorAuthProviderClient";

export default async function VendorAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initUserData = await vendorRequester.getCurrentUser();

  return (
    <VendorAuthProviderClient initUserData={initUserData}>
      {children}
    </VendorAuthProviderClient>
  );
}
export const useVendorAuth = async (): Promise<{ userData: UserData }> => {
  const { user } = await vendorRequester.getCurrentUser();
  return { userData: user };
};
