"use client";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./headerCategory.module.css";

export function HeaderCategory({ CaOpen }: { CaOpen: boolean }) {
  // 카테고리메뉴
  const { categoriesData } = useCategories();
   const [categories, setCategories] = useState<CategoryData[]>([]);

   useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await requester.getCategories();
          
          setCategories(result.content);
        } catch (error) {
          console.error("카테고리 데이터를 가져오는 데 실패했습니다:", error);
        }
      };
      fetchData();
      
    }, []);





  const [activeDepth1, setActiveDepth1] = useState<string | null>(null);

  return (
    <Div
      className={clsx(styles.overlay, {[styles.isOverlayVisible]: CaOpen,})}
    >
      <HorizontalFlex className={styles.ca_wrap}>

        {/* 대분류 */}
        <nav className={clsx(styles.ca_tab1, styles.ca_box)}>
          {categoriesData
            .sort((c1, c2) => c1.index - c2.index)
            .map((cat, i) => {
              // const href = cat.children?.length
              //   ? `/categories/${cat.children[0]?.id}`
              //   : `/categories/${cat.id}`;

              return (
                <FlexChild
                  key={i}
                  className={clsx(styles.tab_item, {
                    [styles.active]: activeDepth1 === cat.id,
                  })}
                  onMouseEnter={() => setActiveDepth1(cat.id)}
                  onMouseLeave={() => setActiveDepth1(null)}
                >
                  {/* <Link href={href}> */}
                  <Link href={`/categories/${cat.id}`}>
                    <P>{cat.name}</P>
                  </Link>
                </FlexChild>
              );
          })}
        </nav>

        <VerticalFlex className={clsx(styles.child_wrap)}>
          <VerticalFlex>
            {categoriesData
              .sort((c1, c2) => c1.index - c2.index)
              .filter((cat1) => cat1.children && cat1.children.length > 0)
              .map((cat1, i) => (
                <VerticalFlex key={cat1.id ?? i} 
                  className={clsx(styles.ca_child, {
                    [styles.active]: activeDepth1 === cat1.id,
                  })}

                  onMouseEnter={() => setActiveDepth1(cat1.id)}
                  onMouseLeave={() => setActiveDepth1(null)}
                >
                  {cat1.children
                    ?.sort((c1, c2) => c1.index - c2.index)
                    .map((child2, j) => (
                      <FlexChild key={child2.id ?? j} cursor="pointer" className={styles.child_item}>
                        <Link href={`/categories/${child2.id}`}>
                          <P>{child2.name}</P>
                          <Image src={'/resources/icons/arrow/foldBtn_black.png'} width={7} />
                        </Link>
                      </FlexChild>
                    ))}
                </VerticalFlex>
              ))}
          </VerticalFlex>
        </VerticalFlex>
      </HorizontalFlex>
    </Div>
  );
}
