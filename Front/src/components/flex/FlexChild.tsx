import clsx from "classnames";
import { CSSProperties } from "react";
import style from "./FlexChild.module.css";

function FlexChild({
  parentclass,
  id,
  height,
  width,
  Ref,
  addWidth,
  display,
  gridTemplateColumns,
  flex,
  flexBasis,
  flexGrow,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  overflow,
  overflowX,
  overflowY,
  alignItems = "center",
  flexStart,
  alignSelf,
  justifySelf,
  flexDirection,
  textDecorationLine,
  gap,
  justifyContent,
  backgroundColor,
  backgroundImage,
  padding,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  flexWrap,
  border,
  borderRadius,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  margin,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  cursor,
  position,
  top,
  bottom,
  left,
  right,
  fontWeight,
  fontSize,
  color,
  boxShadow,
  zIndex,
  flexShrink,
  scrollMarginTop,
  transform,
  transition,
  scale,
  hidden,
  hideScrollbar,
  onClick,
  onContextMenu,
  scrollbarGutter,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
  onMouseLeave,
  onWheel,
  className,
  children,
}: ComponentProps<HTMLDivElement> & {
  parentclass?: React.HTMLAttributes<HTMLElement>["className"];
  addWidth?: CSSProperties["width"];
  flexStart?: boolean;
  hideScrollbar?: boolean;
}) {
  // Fixed 여부 체크
  let isFixed = false;
  if (parentclass) {
    if (parentclass === "vertical") {
      isFixed = height ? true : false;
    } else if (parentclass === "horizontal") {
      isFixed = width ? true : false;
    }
  }

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
      if (overflowX) styles.overflowX = overflowX;
      if (overflowY) styles.overflowY = overflowY;
    }

    return styles;
  };

  return (
    <div
      ref={Ref}
      id={id}
      className={clsx(style.flexChild, { [style.fixed]: isFixed }, className)}
      style={{
        width: addWidth ? `calc(${flexBasis || "100%"} + ${addWidth})` : width,
        minWidth,
        maxWidth,
        height,
        maxHeight,
        minHeight,
        display,
        gridTemplateColumns,
        overflowX,
        overflowY,
        alignItems: flexStart ? "flex-start" : alignItems,
        alignSelf,
        justifySelf,
        gap,
        justifyContent,
        textDecorationLine,
        backgroundColor,
        backgroundImage,
        flexWrap,
        borderRadius,
        flex,
        flexBasis,
        flexGrow,
        flexDirection,
        cursor,
        position,
        top,
        bottom,
        left,
        right,
        zIndex,
        fontWeight,
        fontSize,
        scrollbarGutter,
        color,
        transform,
        transition,
        flexShrink,
        boxShadow,
        scale,
        scrollMarginTop,
        scrollbarWidth: hideScrollbar ? "none" : undefined,
        msOverflowStyle: hideScrollbar ? "none" : undefined,
        ...getDirectionalStyles(), // 방향성 스타일 적용
      }}
      hidden={hidden}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onWheel={onWheel}
    >
      {children}
    </div>
  );
}

export default FlexChild;
