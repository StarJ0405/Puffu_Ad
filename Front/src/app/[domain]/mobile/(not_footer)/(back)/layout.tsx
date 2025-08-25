import VerticalFlex from "@/components/flex/VerticalFlex";

export default async function ({ children }: { children: React.ReactNode }) {
  return (
    <VerticalFlex id="scroll" height={"100dvh"} overflow="scroll">
      {children}
    </VerticalFlex>
  );
}
