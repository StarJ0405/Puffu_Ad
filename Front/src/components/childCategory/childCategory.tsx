"use client";
import Span from "@/components/span/Span";
import clsx from "clsx";
import Link from "next/link";
import styles from "./childCategory.module.css";
import FlexChild from "../flex/FlexChild";
import Image from "@/components/Image/Image";
import useNavigate from "@/shared/hooks/useNavigate";
import P from "@/components/P/P";

// 중분류, 소분류 카테고리
export default function ChildCategory({
  childrenData,
  parent,
  categoryId,
}: {
  childrenData: CategoryData[];
  parent: CategoryData;
  categoryId: any;
}) {

  const navigate = useNavigate();

  return (
    <>
      <ul className={styles.category_list}>
        <li className={clsx(parent.id === categoryId && styles.active)}>
          <Link href={`/categories/${parent.id}`}>
            <Span>전체</Span>
          </Link>
        </li>
        {
         childrenData.length > 0 ? 
          childrenData.map((child, i) => (
            <li key={i}>
              <Link href={`/categories/${child.id}`}>
                <Span>{child.name}</Span>
              </Link>
            </li>
          )) : (
            <FlexChild
              onClick={() => navigate(-1)}
              gap={10}
              cursor="pointer"
              width={"auto"}
              alignSelf="start"
            >
              <Image src={"/resources/images/back.png"} width={20} />
              <P color="#aaa">이전으로</P>
            </FlexChild>
          )
        }
      </ul>
    </>
  );
}
