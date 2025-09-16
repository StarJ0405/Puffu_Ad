"use client";
import Span from "@/components/span/Span";
import clsx from "clsx";
import Link from "next/link";
import styles from "./childCategory.module.css";



// 중분류, 소분류 카테고리
export default function ChildCategory(
  { childrenData, parent, categoryId } :
  {
    childrenData: CategoryData[]; 
    parent: CategoryData;
    categoryId: any;
  }
) {

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