"use client";
import Span from "@/components/span/Span";
import styles from "./page.module.css";

// export function ProdcutCategory() {
//   // 대분류 카테고리

//   const pathname = usePathname();

//   return (
//     <nav className={styles.category_wrap}>
//       {/* ca_item에 active 클래스 주기. active 클래스만 걸리면 효과 들어감. */}
//       {pathname !== "/" ? (
//         <VerticalFlex className={clsx(styles.ca_item, styles.ca_all)}>
//           <FlexChild className={styles.ca_thumb} width={120} height={120}>
//             <P>ALL</P>
//           </FlexChild>
//           <Span>전체</Span>
//         </VerticalFlex>
//       ) : null}
//       {ca_test.map((cat, i) => (
//         <VerticalFlex className={styles.ca_item} key={i}>
//           <FlexChild className={styles.ca_thumb}>
//             <Image src={cat.thumbnail} width={"auto"} height={120} />
//           </FlexChild>
//           <Span>{cat.name}</Span>
//         </VerticalFlex>
//       ))}
//     </nav>
//   );
// }

export function SecondCategory() {
  // 중분류, 소분류 카테고리

  const ca_test = [
    { name: "세척/세정" },
    { name: "관리/파우더" },
    { name: "워머/히팅" },
    { name: "드라이/건조" },
    { name: "보관/파우치" },
    { name: "오나홀 보조" },
    { name: "기타용품" },
  ];

  return (
    <>
      <ul className={styles.category_list}>
        <li className={styles.active}>
          <Span>전체</Span>
        </li>
        {ca_test.map((cat, i) => (
          <li key={i}>
            <Span>{cat.name}</Span>
          </li>
        ))}
      </ul>
    </>
  );
}
