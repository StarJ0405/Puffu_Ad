import { useAuth } from "@/providers/AuthPorivder/AuthPorivder";
import { redirect } from "next/navigation";
import LayoutClient from "./layoutClient";
import Header from "../(main)/(shared)/Header/header";
import Footer from "../(main)/(shared)/Footer/footer";

export default async function ({ children }: { children: React.ReactNode }) {
  // const { userData } = await useAuth();
  // if (!userData?.id) {
  //   redirect("/auth/login");
  // }
  // return <Layout>{children}</Layout>;
  return (
    <LayoutClient>
      <div style={{ minWidth: "1300px" }}>
        {/*  */}
        <Header />
        {children}
        <Footer />
        {/*  */}
      </div>
    </LayoutClient>
  );
}