import Center from "@/components/center/Center";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { Cookies } from "@/shared/utils/Data";
import { SearchParams } from "next/dist/server/request/search-params";
import { cookies } from "next/headers";
import Login from "./Login";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const _cookies = await cookies();
  const { redirect_url = "/" } = await searchParams;

  return (
    <VerticalFlex height="100dvh" width={"100vw"}>
      <Center innerWidth={"min(30vw,400px)"}>
        <Login
          pre_id={_cookies.get(Cookies.ID)?.value || ""}
          redirect_url={redirect_url as string}
        />
      </Center>
    </VerticalFlex>
  );
}
