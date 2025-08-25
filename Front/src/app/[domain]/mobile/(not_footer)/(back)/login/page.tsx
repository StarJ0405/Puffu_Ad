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
  const { redirect_url = "/", id = "" } = await searchParams;
  return (
    <VerticalFlex height={"100%"}>
      <Login
        pre_id={(id as string) || _cookies.get(Cookies.ID)?.value || ""}
        redirect_url={redirect_url as string}
      />
    </VerticalFlex>
  );
}
