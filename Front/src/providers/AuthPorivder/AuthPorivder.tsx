import { requester } from "@/shared/Requester";
import AuthProviderClient from "./AuthPorivderClient";

export default async function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initUserData = await requester.getCurrentUser();

  return (
    <AuthProviderClient initUserData={initUserData}>
      {children}
    </AuthProviderClient>
  );
}
export const useAuth = async (): Promise<{ userData: UserData }> => {
  const { user } = await requester.getCurrentUser();
  return { userData: user };
};
