"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Tooltip from "@/components/tooltip/Tooltip";
import { useVendorAuth } from "@/providers/VendorAuthProiveder/VendorAuthProviderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import { Cookies } from "@/shared/utils/Data";
import { getCookieOption } from "@/shared/utils/Functions";
import { useCookies } from "react-cookie";

export default function () {
  const [, , removeCookie] = useCookies();
  const { userData } = useVendorAuth();
  const navigate = useNavigate();
  return (
    <VerticalFlex gap={8}>
      <FlexChild>
        <Tooltip
          width={"100%"}
          autoMove={false}
          left={36}
          position="bottom_center"
          content={
            <VerticalFlex
              backgroundColor={"white"}
              border={"1px solid #a0a0a0"}
              padding={"8px 12px"}
              borderRadius={10}
              gap={5}
            >
              <P
                textHover
                onClick={() => {
                  navigate("/mypage");
                }}
                cursor="pointer"
                weight="bold"
              >
                회원정보 수정
              </P>
              <P
                textHover
                onClick={() => {
                  removeCookie(Cookies.VENDOR_JWT, getCookieOption());
                  navigate("/login");
                }}
                cursor="pointer"
                weight="bold"
              >
                로그아웃
              </P>
            </VerticalFlex>
          }
        >
          <P>
            <Span>{userData?.nickname || userData?.name}</Span>
            <Span> 님</Span>
          </P>
        </Tooltip>
      </FlexChild>
      <FlexChild justifyContent="end">
        <Image src="/resources/images/bell2x.png" cursor="pointer" size={24} />
      </FlexChild>
    </VerticalFlex>
  );
}
