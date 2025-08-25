import { Back } from "../layoutClient";

export default async function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Back header="로그인" />
      {children}
    </>
  );
}
