import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { MemberShip } from "./dashboard";
import { adminRequester } from "@/shared/AdminRequester";
export default async function () {
  const initGroups = await adminRequester.getGroups({
    relations: ["coupons"],
    coupons: {
      user_id: null,
    },
  });
  return (
    <Container padding={20} width={"100%"} maxWidth={1380} margin={"0 auto"}>
      <VerticalFlex gap={20} flexStart={true}>
        <HorizontalFlex gap={15} justifyContent={"flex-start"}>
          <MemberShip initGroups={initGroups} />
        </HorizontalFlex>
      </VerticalFlex>
    </Container>
  );
}
