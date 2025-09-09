import PrivacyContent from "@/components/agreeContent/privacyContent";
import TermContent from "@/components/agreeContent/TermContent";
import FlexChild from "@/components/flex/FlexChild";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ({ params }: PageProps) {
  return (
    <section className="root desktop_container">
      <FlexChild paddingTop={60}>
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
      </FlexChild>
    </section>
  );
}
