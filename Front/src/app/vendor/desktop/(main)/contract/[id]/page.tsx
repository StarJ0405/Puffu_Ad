import ContractWriteClient from "@/components/contract/ContractWriteClient";
import { vendorRequester } from "@/shared/VendorRequester";
import { Params } from "next/dist/server/request/params";

export default async function ({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const contract = await vendorRequester.getMyContract(id as string, {
    relations: ["pages", "pages.input_fields", "contract_users", "contract_users.user",],
  }) as ContractData;
  
  return <ContractWriteClient contract={contract} mode={"user"} />;
}