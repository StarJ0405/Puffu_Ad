import { useAuth } from "@/providers/AuthPorivder/AuthPorivder";
import { redirect } from "next/navigation";
import LayoutClient from "./layoutClient";
import Header from "../(main)/(shared)/Header/header";
import Footer from "../(main)/(shared)/Footer/footer";
import BottomNavi from '../(main)/(shared)/BottomNavi/bottomNavi'

export default async function ({ children }: { children: React.ReactNode }) {
  // const { userData } = await useAuth();
  // if (!userData?.id) {
  //   redirect("/auth/login");
  // }
  // return <Layout>{children}</Layout>;
  return (
    <LayoutClient>
        {/*  */}
        <Header />
        {children}
        <Footer />
        <BottomNavi />
        {/*  */}
    </LayoutClient>
  );
}