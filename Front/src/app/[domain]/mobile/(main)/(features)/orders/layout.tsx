import LayoutClient from "./layoutClient";
import SubPageHeader from "@/components/subPageHeader/subPageHeader";

export default async function ({ children }: { children: React.ReactNode }) {
  return <LayoutClient><SubPageHeader />{children}</LayoutClient>;
}
