import Center from "@/components/center/Center";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivder";
import { requester } from "@/shared/Requester";
import { SearchParams } from "next/dist/server/request/search-params";
import OAuth, { Login } from "./OAuth";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { appid, redirect_uri, state } = await searchParams;

  const response: any = await requester.isConnectExist({ appid, redirect_uri });
  if (response?.error) {
    return <p>{response.error}</p>;
  }
  const { userData } = await useAuth();
  if (!userData) {
    return (
      <Center innerWidth={"min(80%,80vw)"}>
        <Login />
      </Center>
    );
  }

  return (
    <OAuth
      name={response.name}
      appid={String(appid || "")}
      redirect_uri={String(redirect_uri || "")}
      state={String(state || "")}
    />
  );
}
