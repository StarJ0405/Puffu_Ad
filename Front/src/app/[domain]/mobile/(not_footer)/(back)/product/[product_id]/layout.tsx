import { Back } from "@/app/[domain]/mobile/(not_footer)/(back)/layoutClient";
import { Name } from "./client";

export default async function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Back header={<Name />} />
      {children}
    </>
  );
}
