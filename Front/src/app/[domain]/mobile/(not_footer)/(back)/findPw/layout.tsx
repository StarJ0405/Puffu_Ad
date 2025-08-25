import { Back } from "../layoutClient";

export default async function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Back header="비밀번호 찾기" />
      {children}
    </>
  );
}
