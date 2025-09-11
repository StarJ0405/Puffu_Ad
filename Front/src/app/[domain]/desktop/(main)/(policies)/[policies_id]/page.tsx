import { Params } from "next/dist/server/request/params";
import Route from "./client";

interface PageProps {
  params: Promise<Params>;
}

export default async function Policies({ params }: PageProps) {
  return (
    <section className="root page_container">
      <Route />
      {/* <FlexChild paddingTop={60}>
        {
          params.id === 'term' && (
            <TermContent size={10} />
          )
        }

        {
          params.id === 'privacy' && (
            <PrivacyContent size={10} />
          )
        }
      </FlexChild> */}
    </section>
  );
}
