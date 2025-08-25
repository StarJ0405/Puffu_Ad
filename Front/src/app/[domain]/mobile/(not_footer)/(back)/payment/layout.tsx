import { Back } from "../layoutClient";

export default async function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Back header="주문/결제" />
      {children}
    </>
  );
}
