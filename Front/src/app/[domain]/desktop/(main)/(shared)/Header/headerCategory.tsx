"use client";
import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import StarRate from "@/components/star/StarRate";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import styles from "./headerCategory.module.css";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import { log } from "@/shared/utils/Functions";
import Link from "next/link";

export function HeaderCategory({ CaOpen }: { CaOpen: boolean }) {
  // 카테고리메뉴
  const { categoriesData } = useCategories();

  console.log("카테고리", categoriesData);

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
            .map((cat, i) => (
              <FlexChild
                key={i}
                className={clsx(styles.tab_item, 
                  {[styles.active]: activeDepth1 === cat.id,}
                )}

                onMouseEnter={()=> setActiveDepth1(cat.id)}
                onMouseLeave={() => setActiveDepth1(null)}
              >
                <Link href={`/categories/${cat.id}`}>
                  <P>
                    {cat.name}
                  </P>
                </Link>
              </FlexChild>
            ))}
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
                    ?.slice()
                    .reverse()
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
