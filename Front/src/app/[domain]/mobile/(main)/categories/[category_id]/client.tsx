"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import clsx from "clsx";
import Link from "next/link";
import styles from "./page.module.css";

function findCategoryById(categories: any[], id: string): any | undefined {
  for (const cat of categories) {
    if (cat.id === id) {
      return cat; // 현재 레벨에서 찾음
    }
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryById(cat.children, id);
      if (found) return found; // 자식 트리에서 찾음
    }
  }
  return undefined;
}

export function TitleBox({ category_id }: { category_id: any }) {
  const { categoriesData } = useCategories();
  const category = findCategoryById(categoriesData, category_id);
  const navigate = useNavigate();

  return (
    <VerticalFlex className={styles.title_box}>
      <h3>{category?.name ?? "카테고리"}</h3>

      {/* 프로덕트 카테고리 */}
      <VerticalFlex marginBottom={30}>
        <SecondCategory
          categoryId={category_id}
          childrenData={category.children}
          parent={category}
        />
      </VerticalFlex>
    </VerticalFlex>
  );
}

// 중분류, 소분류 카테고리
export function SecondCategory({
  childrenData,
  parent,
  categoryId,
}: {
  childrenData: CategoryData[];
  parent: CategoryData;
  categoryId: any;
}) {
  return (
    <>
      <ul className={styles.category_list}>
        <li className={clsx(parent.id === categoryId && styles.active)}>
          <Link href={`/categories/${parent.id}`}>
            <Span>전체</Span>
          </Link>
        </li>
        {childrenData.map((child, i) => (
          <li key={i}>
            <Link href={`/categories/${child.id}`}>
              <Span>{child.name}</Span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
