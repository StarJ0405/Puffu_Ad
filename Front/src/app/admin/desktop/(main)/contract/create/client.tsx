// "use client";

// import styles from "./page.module.css";
// import TemplateCard from "@/components/card/TemplateCard";
// import { adminRequester } from "@/shared/AdminRequester";
// import useNavigate from "@/shared/hooks/useNavigate";
// import HorizontalFlex from "@/components/flex/HorizontalFlex";
// import FlexChild from "@/components/flex/FlexChild";
// import clsx from "clsx";
// import P from "@/components/P/P";
// import usePageData from "@/shared/hooks/data/usePageData";

// export default function ContractCreatePage() {
//   const navigate = useNavigate();

//   const { contractTemplates, page, setPage, maxPage, isLoading } = usePageData(
//     "contractTemplates",
//     (page) => ({
//       pageSize: 12,
//       pageNumber: page,
//       // origin_id: null 제거 — null 비교는 SQL에서 무의미
//     }),
//     async (params) => {
//       const res = (await adminRequester.getContracts(params)) as any;

//       // 배열 형태 호환 처리
//       if (Array.isArray(res?.rows)) return res;
//       if (Array.isArray(res)) return { rows: res, count: res.length };

//       return { rows: [], count: 0 };
//     },
//     (data) => Math.ceil((data?.count ?? data?.rows?.length ?? 0) / 12),
//     {
//       onReprocessing: (data) => data?.rows ?? data ?? [],
//       refresh: { revalidateOnFocus: false },
//     }
//   );

//   const handleCreate = (id: string) => {
//     navigate(`/admin/contract/create/${id}`);
//   };

//   return (
//     <div className={styles.page}>
//       <h2 className={styles.title}>템플릿으로 계약 작성</h2>

//       <div className={styles.grid}>
//         {!isLoading && contractTemplates?.length > 0 ? (
//           contractTemplates.map((tpl: any) => (
//             <TemplateCard
//               key={tpl.id}
//               image={
//                 tpl.pages?.[0]?.image || "/resources/images/placeholder.png"
//               }
//               title={tpl.name}
//               onCreate={() => handleCreate(tpl.id)}
//             />
//           ))
//         ) : (
//           <p className={styles.empty}>등록된 템플릿이 없습니다.</p>
//         )}
//       </div>

//       {maxPage > 0 && (
//         <FlexChild className={styles.pageLine}>
//           <HorizontalFlex
//             width={"max-content"}
//             justifyContent="center"
//             gap={10}
//           >
//             <FlexChild
//               className={clsx(
//                 styles.pageButton,
//                 styles.arrow,
//                 styles.arrowTwice
//               )}
//               onClick={() => setPage(0)}
//             />
//             <FlexChild
//               className={clsx(styles.pageButton, styles.arrow)}
//               onClick={() => setPage(Math.max(0, page - 1))}
//             />

//             {Array.from(
//               {
//                 length: Math.min(10, maxPage - Math.floor(page / 10) * 10 + 1),
//               },
//               (_, i) => Math.floor(page / 10) * 10 + i
//             ).map((index) => (
//               <FlexChild
//                 key={`page_${index}`}
//                 className={clsx(styles.pageButton, {
//                   [styles.selected]: index === page,
//                 })}
//                 onClick={() => setPage(index)}
//               >
//                 <P width={"100%"}>{index + 1}</P>
//               </FlexChild>
//             ))}

//             <FlexChild
//               className={clsx(
//                 styles.pageButton,
//                 styles.arrow,
//                 styles.arrowNext
//               )}
//               onClick={() => setPage(Math.min(maxPage, page + 1))}
//             />
//             <FlexChild
//               className={clsx(
//                 styles.pageButton,
//                 styles.arrow,
//                 styles.arrowNext,
//                 styles.arrowTwice
//               )}
//               onClick={() => setPage(maxPage)}
//             />
//           </HorizontalFlex>
//         </FlexChild>
//       )}
//     </div>
//   );
// }
