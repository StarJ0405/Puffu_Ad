import { adminRequester } from "@/shared/AdminRequester";
import AdminAuthProviderClient from "./AdminAuthPorivderClient";

export default async function AdminAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initUserData = await adminRequester.getCurrentUser();

  return (
    <AdminAuthProviderClient initUserData={initUserData}>
      {children}
    </AdminAuthProviderClient>
  );
}
export const useAdminAuth = async (): Promise<{ userData: UserData }> => {
  const { user } = await adminRequester.getCurrentUser();
  return { userData: user };
};
