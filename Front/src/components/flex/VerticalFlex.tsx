import clsx from "classnames";
import React, { Children } from "react";
import style from "./VerticalFlex.module.css";

function VerticalFlex({
  id,
  flexStart,
  flexDirection,
  Ref,
  width,
  minWidth,
  height,
  maxHeight,
  minHeight,
  overflow,
  overflowX,
  overflowY,
  overscrollBehavior,
  gap,
  alignItems,
  alignSelf,
  color,
  backgroundColor,
  padding,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  margin,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  justifyContent,
  borderRadius,
  direction,
  border,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  flexBasis,
  flexGrow,
  maxWidth,
  cursor,
  display,
  fontSize,
  fontWeight,
  hideScrollbar,
  hidden,
  zIndex,
  top,
  right,
  left,
  bottom,
  scale,
  scrollMarginTop,
  position,
  onWheel,
  onClick,
  onDrop,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onMouseUp,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  onScroll,
  onTransitionStart,
  onTransitionEnd,
  onContextMenu,
  className,
  children,
}: ComponentProps<HTMLDivElement> & {
  flexStart?: boolean;
  hideScrollbar?: boolean;
}) {
  const childrenWithProps = Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child?.type === React.Fragment) return child;
      return React.cloneElement(child, {
        parentclass: "vertical",
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

    return styles;
  };

  return (
    <div
      id={id}
      hidden={hidden}
      ref={Ref}
      className={clsx(style.flex, style.vertical, className)}
      style={{
        display,
        width: width,
        minWidth,
        height: height,
        maxHeight: maxHeight,
        minHeight: minHeight,
        overflow,
        overflowX,
        overflowY,
        top,
        right,
        left,
        bottom,
        gap: gap,
        alignItems: alignItems
          ? alignItems
          : flexStart
          ? "flex-start"
          : "center",
        alignSelf,
        color,
        cursor,
        backgroundColor: backgroundColor,
        justifyContent: justifyContent,
        borderRadius: borderRadius,
        flexDirection,
        flexBasis: flexBasis,
        flexGrow: flexGrow,
        maxWidth: maxWidth,
        scrollbarWidth: hideScrollbar ? "none" : undefined,
        msOverflowStyle: hideScrollbar ? "none" : undefined,
        position,
        fontSize,
        fontWeight,
        scrollMarginTop,
        overscrollBehavior,
        scale,
        zIndex,
        ...getDirectionalStyles(), // 방향성 스타일 적용
      }}
      onWheel={onWheel}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onTransitionEnd={onTransitionEnd}
      onTransitionStart={onTransitionStart}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onScroll={onScroll}
      onContextMenu={onContextMenu}
    >
      {childrenWithProps}
    </div>
  );
}

export default VerticalFlex;
