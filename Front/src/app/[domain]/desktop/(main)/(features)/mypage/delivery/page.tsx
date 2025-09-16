import { requester } from "@/shared/Requester";
import { DeliveryClient } from "./client";

export default async function DeliveryPage() {
  const initAddresses = await requester.getAddresses();

  return <DeliveryClient initAddresses={initAddresses} />;
}
