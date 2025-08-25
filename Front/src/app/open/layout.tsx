import VerticalFlex from "@/components/flex/VerticalFlex";

export default async function ({ children }: { children: React.ReactNode }) {
  return (
    <VerticalFlex height={"100dvh"} width={"100vw"}>
      {children}
    </VerticalFlex>
  );
}
