"use client";
import useNavigate from "@/shared/hooks/useNavigate";
import { CSSProperties } from "react";
import FlexChild from "../flex/FlexChild";
import VerticalFlex from "../flex/VerticalFlex";
import Image from "../Image/Image";
import P from "../P/P";
import Span from "../span/Span";

export default function ({
  product,
  currency_unit,
  margin,
  onClick,
  width,
}: {
  product: ProductData;
  currency_unit?: string;
  margin?: CSSProperties["margin"];
  onClick?: (product: ProductData) => void;
  width?: CSSProperties["width"];
}) {
  if (!product) return;
  const navigate = useNavigate();
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
    >
      <FlexChild>
        <Image src={product.thumbnail} width={"100%"} height={"auto"} />
      </FlexChild>
      <FlexChild padding={"8px 15px"}>
        <VerticalFlex gap={2}>
          <FlexChild>
            <P weight={500} fontSize={14} ellipsis>
              {product.title}
            </P>
          </FlexChild>
          <FlexChild>
            <P
              color="#AAA"
              fontSize={10}
              weight={500}
              textDecoration={"line-through"}
              hidden={product.discount_rate >= 1}
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
                hidden={product.discount_rate >= 1}
                paddingRight={"0.5em"}
              >
                {product.discount_rate}
              </Span>
              <Span fontSize={14} weight={600}>
                {product.discount_price}
              </Span>
              <Span fontSize={14} weight={600}>
                {currency_unit}
              </Span>
            </P>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
