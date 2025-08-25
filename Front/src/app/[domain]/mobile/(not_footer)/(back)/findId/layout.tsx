import { Back } from "../layoutClient";

export default async function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Back header="아이디 찾기" />
      {children}
    </>
  );
}
