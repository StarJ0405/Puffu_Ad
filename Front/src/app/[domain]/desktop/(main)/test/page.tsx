import notFound from "@/app/not-found";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivder";
import Client from "./client";
import clsx from "clsx";
import VerticalFlex from "@/components/flex/VerticalFlex";

export default async function () {
  const { userData } = await useAuth();
  if (userData?.role !== "admin") return notFound();
  return (
    <section className={clsx("root ", "page_container")}>
      <VerticalFlex height={"100dvh"}>
        <Client />
      </VerticalFlex>
    </section>
  );
}
