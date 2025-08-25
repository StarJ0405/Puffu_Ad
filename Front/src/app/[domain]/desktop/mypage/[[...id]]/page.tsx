import { Params } from "next/dist/server/request/params";

export default async function ({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  console.log(id)
  return <></>;
}
