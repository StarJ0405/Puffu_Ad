import PrivacyContent from "@/components/agreeContent/privacyContent";
import TermContent from "@/components/agreeContent/TermContent";
import FlexChild from "@/components/flex/FlexChild";
import Route from './client'

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Policies({ params }: PageProps) {

  console.log(params.id);

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
