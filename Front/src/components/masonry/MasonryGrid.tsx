"use client";
import Masonry from "react-masonry-css";
import style from "./MasonryGrid.module.css";

interface MasonryProps {
  breakpoints?:
    | number
    | { [key: number]: number; default?: number }
    | undefined;
}
function MasonryGrid(props: MasonryProps & ComponentProps<HTMLElement>) {
  const defaultBreakpoints = {
    default: 6,
    1440: 5,
    1024: 4,
    768: 2,
  };
  const breakpoints = props.breakpoints || defaultBreakpoints;

  return (
    <Masonry
      breakpointCols={breakpoints}
      className={style.masonryGrid}
      columnClassName={style.masonryColumn}
      style={{
        gap: props.gap,
        width: props.width,
      }}
    >
      {props.children}
    </Masonry>
  );
}

export default MasonryGrid;
