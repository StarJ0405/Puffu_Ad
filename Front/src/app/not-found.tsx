import { getDeviceType } from "@/shared/utils/Functions";
import { headers } from "next/headers";

export default async function () {
  const headerList = await headers();
  const userAgent = headerList.get("user-agent");
  const deviceType = getDeviceType(userAgent);
  return <div>hello this Page is not used</div>;
}
