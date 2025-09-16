import clsx from "classnames";
import React, { Children } from "react";
import style from "./HorizontalFlex.module.css";

function HorizontalFlex({
  flexStart,
  width,
  maxWidth,
  minWidth,
  height,
  minHeight,
  maxHeight,
  overflow,
  overflowX,
  overflowY,
  gap,
  alignItems = "center",
  padding,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  backgroundColor,
  border,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  borderRadius,
  flexWrap,
  margin,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  hideScrollbar,
  justifyContent,
  color,
  flexGrow,
  flexBasis,
  fontWeight,
  fontSize,
  className,
  position,
  top,
  bottom,
  left,
  right,
  cursor,
  onClick,
  onContextMenu,
  onMouseEnter,
  onMouseLeave,
  hidden,
  children,
}: ComponentProps<HTMLDivElement> & {
  flexStart?: boolean;
  hideScrollbar?: boolean;
}) {
  const childrenWithProps = Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child?.type === React.Fragment) return child;
      return React.cloneElement(child, {
        parentclass: "horizontal",
      } as any);
    }
  });

  // 방향성 스타일 속성들을 처리
  const getDirectionalStyles = (): DirectionalStyleInterface => {
    const styles: DirectionalStyleInterface = {};
    // padding 처리
    if (padding || paddingTop || paddingRight || paddingBottom || paddingLeft) {
      if (padding) styles.padding = padding;
      if (paddingTop) styles.paddingTop = paddingTop;
      if (paddingRight) styles.paddingRight = paddingRight;
      if (paddingBottom) styles.paddingBottom = paddingBottom;
      if (paddingLeft) styles.paddingLeft = paddingLeft;
    }

    // margin 처리
    if (margin || marginTop || marginRight || marginBottom || marginLeft) {
      if (margin) styles.margin = margin;
      if (marginTop) styles.marginTop = marginTop;
      if (marginRight) styles.marginRight = marginRight;
      if (marginBottom) styles.marginBottom = marginBottom;
      if (marginLeft) styles.marginLeft = marginLeft;
    }

    // border 처리
    if (border || borderTop || borderRight || borderBottom || borderLeft) {
      if (border) styles.border = border;
      if (borderTop) styles.borderTop = borderTop;
      if (borderRight) styles.borderRight = borderRight;
      if (borderBottom) styles.borderBottom = borderBottom;
      if (borderLeft) styles.borderLeft = borderLeft;
    }
    if (overflow || overflowX || overflowY) {
      if (overflow) styles.overflow = overflow;
      if (overflowY) styles.overflowY = overflowY;
      if (overflowX) styles.overflowX = overflowX;
    }

    return styles;
  };
  return (
    <div
      hidden={hidden}
      className={clsx(
        style.horizontal,
        {
          [style.flexStart]: !!flexStart,
          [style.flex]: !flexStart,
        },

        className
      )}
      style={{
        width,
        maxWidth,
        minWidth,
        height,
        maxHeight,
        minHeight,
        gap,
        alignItems: flexStart ? "flex-start" : alignItems,
        backgroundColor,
        color,
        borderRadius,
        flexWrap,
        borderBottom,
        justifyContent,
        flexGrow,
        flexBasis,
        fontSize,
        fontWeight,
        position,
        top,
        bottom,
        left,
        right,
        cursor,
        scrollbarWidth: hideScrollbar ? "none" : undefined,
        msOverflowStyle: hideScrollbar ? "none" : undefined,
        ...getDirectionalStyles(), // 방향성 스타일 적용
      }}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {childrenWithProps}
    </div>
  );
}

export default HorizontalFlex;
