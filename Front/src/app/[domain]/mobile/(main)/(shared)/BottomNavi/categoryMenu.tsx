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
import styles from "./categoryMenu.module.css";
import useNavigate from "@/shared/hooks/useNavigate";

export default function CategoryMenu({ CaOpen }: { CaOpen?: boolean }) {
  // 카테고리메뉴
   const { categoriesData } = useCategories();
   const [categories, setCategories] = useState<CategoryData[]>([]);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await requester.getCategories();
          console.log(result);
          setCategories(result.content);
        } catch (error) {
          console.error("카테고리 데이터를 가져오는 데 실패했습니다:", error);
        }
      };
      fetchData();
    }, []);

    console.log('카테고리1', categoriesData);

  const [activeDepth1, setActiveDepth1] = useState<string | null>(null);
    


  return (
    <Div className={styles.category_container}>
      <FlexChild className={styles.frame_header}>
         <FlexChild cursor="pointer" width={'auto'}>
            {/* onClick={()=> onClose(true)} */}
            <Image src={'/resources/icons/arrow/slide_arrow.png'} width={12} />
         </FlexChild>

         <FlexChild gap={10} className={`searchInput_Box ${styles.search_Box}`}>
            <input type="search" placeholder="2025 신제품"/>

            <Image
               src="/resources/images/header/input_search_icon.png"
               width={18}
               height="auto"
               cursor="pointer"
            />
         </FlexChild>
      </FlexChild>

      <HorizontalFlex className={styles.ca_wrap}>

        {/* 대분류 */}
        <nav className={clsx(styles.ca_tab1, styles.ca_box)}>
          {categoriesData
            .sort((c1, c2) => c1.index - c2.index)
            .map((cat, i) => (
              <FlexChild
                key={i}
                className={clsx(styles.tab_item, 
                  {[styles.active]: activeDepth1 === cat.id,}
                )}
              >
                <P>
                 {cat.name}
               </P>
              </FlexChild>
            ))}
        </nav>

        <VerticalFlex className={clsx(styles.child_wrap)}>
          <VerticalFlex alignItems="start">
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
                  <FlexChild className={styles.cat1_item} onClick={()=> navigate(`/categories/${cat1.id}`)}>
                     <P>{cat1.name}</P>
                     <Image src={'/resources/icons/arrow/list_paging_next.png'} width={7} />
                  </FlexChild> 

                  {cat1.children
                    ?.sort((c1, c2) => c1.index - c2.index)
                    .map((child2, j) => (
                        <Link href={`/categories/${child2.id}`} key={child2.id ?? j}>
                           <FlexChild cursor="pointer" className={styles.child_item}>
                              <P>{child2.name}</P>
                              <Image src={'/resources/icons/arrow/list_paging_next.png'} width={5} />
                           </FlexChild>
                        </Link>
                    ))}
                </VerticalFlex>
              ))}
          </VerticalFlex>
        </VerticalFlex>
      </HorizontalFlex>
    </Div>
  );
}
