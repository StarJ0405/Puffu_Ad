import LayoutClient from "./layoutClient";

export default async function ({ children }: { children: React.ReactNode }) {
  return <LayoutClient>{children}</LayoutClient>;
}