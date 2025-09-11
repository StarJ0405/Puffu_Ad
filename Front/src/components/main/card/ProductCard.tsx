"use client";
import Div from "@/components/div/Div";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import { CSSProperties } from "react";
import FlexChild from "../../flex/FlexChild";
import VerticalFlex from "../../flex/VerticalFlex";
import Image from "../../Image/Image";
import P from "../../P/P";
import Span from "../../span/Span";

export default function ({
  product,
  currency_unit,
  margin,
  onClick,
  width,
  mutate,
}: {
  product: ProductData;
  currency_unit?: string;
  margin?: CSSProperties["margin"];
  onClick?: (product: ProductData) => void;
  width?: CSSProperties["width"];
  mutate?: () => void;
}) {
  if (!product) return;
  const { isMobile } = useBrowserEvent();
  const navigate = useNavigate();
  const { userData } = useAuth();
  return (
    <VerticalFlex
      width={width}
      gap={2}
      margin={margin}
      onClick={() => {
        if (onClick) {
          onClick(product);
        } else {
          navigate(`/product/${product.id}`);
        }
      }}
      cursor="pointer"
    >
      <FlexChild>
        <Image src={product.thumbnail} width={"100%"} height={"auto"} />
      </FlexChild>
      <FlexChild padding={"6px 5px"} boxSizing="border-box">
        <VerticalFlex>
          <FlexChild padding={"0 0 4px 0"}>
            <P color="#8B8B8B" fontWeight={500} lineHeight={1.3} fontSize={12}>
              {product?.brand?.name}
            </P>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex
              justifyContent="space-between"
              alignItems="flex-start"
              gap={5}
            >
              <FlexChild width={"82%"}>
                <P
                  weight={500}
                  color="#474747"
                  fontSize={isMobile ? 14 : 15}
                  lineClamp={2}
                  textOverflow="ellipsis"
                  overflow="hidden"
                  lineHeight={1.3}
                  width={"100%"}
                >
                  {product.title}
                </P>
              </FlexChild>
              {mutate && (
                <FlexChild width={"14%"} justifyContent="flex-end">
                  <Div
                    maxWidth={"20px"}
                    cursor={userData ? "pointer" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (userData) {
                        if (product.wish) {
                          requester.deleteWishList(
                            product.wish.id,
                            {
                              soft: false,
                            },
                            () => {
                              mutate();
                            }
                          );
                        } else {
                          requester.createWishList(
                            {
                              product_id: product.id,
                            },
                            () => {
                              mutate();
                            }
                          );
                        }
                      } else {
                        NiceModal.show("confirm", {
                          message: "로그인이 필요합니다.",
                          cancelText: "취소",
                          confirmText: "로그인하기",
                          onConfirm: () =>
                            navigate(
                              `/login?redirect_url=${window.location.href}`
                            ),
                        });
                      }
                    }}
                  >
                    <Image
                      src={
                        product.wish
                          ? "/resources/icons/puffuMall_heart_icon_full.png"
                          : "/resources/icons/puffuMall_heart_icon.png"
                      }
                      width={"100%"}
                    />
                  </Div>
                </FlexChild>
              )}
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <P
              color="#AAA"
              fontSize={12}
              weight={500}
              textDecoration={"line-through"}
              hidden={product.discount_rate === 0}
              padding={"0 0 4px 0"}
            >
              <Span>{product.price}</Span>
              <Span>{currency_unit}</Span>
            </P>
          </FlexChild>
          <FlexChild>
            <P>
              <Span
                color="var(--main-color)"
                weight={600}
                fontSize={14}
                hidden={product.discount_rate === 0}
              >
                {product.discount_rate}
              </Span>
              <Span
                color="var(--main-color)"
                weight={600}
                fontSize={14}
                hidden={product.discount_rate === 0}
                paddingRight={"4px"}
              >
                %
              </Span>
              <Span fontSize={14} weight={600} color="#1C1B1F">
                {product.discount_price}
              </Span>
              <Span fontSize={14} weight={600} color="#1C1B1F">
                {currency_unit}
              </Span>
            </P>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
