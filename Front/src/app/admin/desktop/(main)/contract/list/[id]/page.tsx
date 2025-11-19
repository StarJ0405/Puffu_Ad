import ContractWriteClient from "@/components/contract/ContractWriteClient";
import { adminRequester } from "@/shared/AdminRequester";
import { Params } from "next/dist/server/request/params";

export default async function ({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  const contract = await adminRequester.getContract(id as string, {
    relations: [
      "contract_users",
      "contract_users.user",
      "pages",
      "pages.input_fields",
    ],
  });
  return <ContractWriteClient contract={contract} mode={"admin"} />;
}