"use client";
import ChildCategory from "@/components/childCategory/childCategory";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";
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
        <ChildCategory
          categoryId={category_id}
          childrenData={category.children}
          parent={category}
        />
      </VerticalFlex>
    </VerticalFlex>
  );
}
