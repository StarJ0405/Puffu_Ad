"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { adminRequester } from "@/shared/AdminRequester";
import usePageData from "@/shared/hooks/data/usePageData";
import VerticalFlex from "@/components/flex/VerticalFlex";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Image from "@/components/Image/Image";

type Row = {
  id: string;
  name?: string;
  locked?: boolean;
  updated_at?: string;
  usage_count?: number;
};

const pageSize = 20;
const parseSort = (s: string) => {
  const [k = "updated_at", d = "DESC"] = (s || "").split(",");
  return { [k]: (d || "DESC").toUpperCase() };
};

export function Client({
  initialQ = "",
  initialPage = 1,
  initialSort = "updated_at,DESC",
}: {
  initialQ?: string;
  initialPage?: number;
  initialSort?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(initialQ);
  const [uiPage, setUiPage] = useState(initialPage);
  const [sort, setSort] = useState(initialSort);

  // URL 동기화
  useEffect(() => {
    const usp = new URLSearchParams();
    if (q) usp.set("q", q);
    if (uiPage > 1) usp.set("page", String(uiPage));
    if (sort) usp.set("sort", sort);
    const nextUrl = usp.toString() ? `${pathname}?${usp}` : pathname;
    const currentUrl = window.location.pathname + window.location.search;
    if (nextUrl !== currentUrl) router.replace(nextUrl, { scroll: false });
  }, [q, uiPage, sort, pathname, router]);

  // 데이터 로딩
  const {
    contract_templates: rows,
    origin,
    isLoading,
    page,
    maxPage,
    setPage,
    mutate,
  } = usePageData(
    "contract_templates",
    (pageNumber) => ({
      q: q || undefined,
      pageSize,
      pageNumber,
      order: parseSort(sort),
      select: ["id", "name", "locked", "updated_at",],
    }),
    (cond) => adminRequester.getContractTemplates(cond),
    (data: any) =>
      data?.totalPages ??
      (data?.page?.numberOfTotalElements
        ? Math.ceil(data.page.numberOfTotalElements / pageSize)
        : 0),
    {
      onReprocessing: (data) =>
        Array.isArray(data?.content)
          ? data.content.map((r: any) => ({
              id: r.id,
              name: r.name,
              locked: !!r.locked,
              updated_at: r.updated_at,
              usage_count: r?.usage_count ?? 0,
            }))
          : [],
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    setPage(Math.max(0, uiPage - 1));
  }, [uiPage, q, sort, setPage]);

  const totalPages = Math.max(1, maxPage + 1);

  // 공통 낙관적 업데이트
  async function optimisticUpdate(
    updater: (rows: Row[]) => Row[],
    action: () => Promise<any>
  ) {
    const prev = Array.isArray(rows) ? rows.slice() : [];
    mutate({ ...origin, content: updater(prev) }, { revalidate: false });
    try {
      await action();
      mutate();
    } catch {
      mutate({ ...origin }, { revalidate: false });
    }
  }

  // 핸들러
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setUiPage(1);
    setQ((q || "").trim());
  };
  const gotoRegist = () => router.push(`/contract/template/regist`);
  const gotoEdit = (id: string) =>
    router.push(`/contract/template/management/${id}`);
  const toggleLock = (id: string, locked?: boolean) =>
    optimisticUpdate(
      (r) => r.map((x) => (x.id === id ? { ...x, locked: !locked } : x)),
      () => adminRequester.updateContractTemplate(id, { locked: !locked })
    );
  const remove = (id: string) =>
    confirm("삭제하시겠습니까?") &&
    optimisticUpdate(
      (r) => r.filter((x) => x.id !== id),
      () => adminRequester.deleteContractTemplate(id)
    );

  return (
    <VerticalFlex className="p-4" gap={16}>
      {/* 헤더 */}
      <HorizontalFlex justifyContent="space-between" alignItems="center">
        <P className="text-xl font-semibold">템플릿 관리</P>
        <button onClick={gotoRegist} className="px-3 py-2 border rounded">
          신규 등록
        </button>
      </HorizontalFlex>

      {/* 검색바 */}
      <form onSubmit={onSearch}>
        <HorizontalFlex gap={8} className="mb-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="템플릿명 검색"
            className="flex-1 px-2 py-2 border rounded"
          />
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setUiPage(1);
            }}
            className="px-2 py-2 border rounded"
          >
            <option value="updated_at,DESC">최근수정 ↓</option>
            <option value="updated_at,ASC">최근수정 ↑</option>
            <option value="name,ASC">이름 ↑</option>
            <option value="name,DESC">이름 ↓</option>
          </select>
          <button type="submit" className="px-3 py-2 border rounded">
            검색
          </button>
        </HorizontalFlex>
      </form>

      {/* 테이블 */}
      <VerticalFlex className="border rounded overflow-hidden">
        <HorizontalFlex
          className="px-3 py-2 text-sm font-medium border-b bg-gray-50"
          justifyContent="space-between"
        >
          <Span className="flex-[1.6]">이름</Span>
          <Span className="flex-[0.6]">잠금</Span>
          <Span className="flex-[0.8]">최근수정</Span>
          <Span className="flex-[0.6]">사용중</Span>
          <Span className="flex-[0.8] text-right">액션</Span>
        </HorizontalFlex>

        {isLoading ? (
          <P className="p-6 text-center text-sm text-gray-500">불러오는 중…</P>
        ) : !rows || rows.length === 0 ? (
          <P className="p-6 text-center text-sm text-gray-500">데이터 없음</P>
        ) : (
          rows.map((r: Row) => (
            <HorizontalFlex
              key={r.id}
              className="px-3 py-2 border-t text-sm items-center"
              justifyContent="space-between"
            >
              <FlexChild flex="1.6">
                <button
                  className="underline text-left truncate"
                  onClick={() => gotoEdit(r.id)}
                  title={r.id}
                >
                  {r.name || "(제목 없음)"}
                </button>
              </FlexChild>

              <FlexChild flex="0.6">
                <button
                  onClick={() => toggleLock(r.id, r.locked)}
                  className="px-2 py-1 border rounded w-full"
                  disabled={isLoading}
                >
                  {r.locked ? "잠금" : "해제"}
                </button>
              </FlexChild>

              <FlexChild flex="0.8">
                <Span>
                  {r.updated_at
                    ? new Intl.DateTimeFormat("ko-KR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(new Date(r.updated_at))
                    : "-"}
                </Span>
              </FlexChild>

              <FlexChild flex="0.6">
                <Span>{r.usage_count ?? 0}</Span>
              </FlexChild>

              <FlexChild flex="0.8" className="text-right">
                <button
                  onClick={() => remove(r.id)}
                  className="px-2 py-1 border rounded"
                  disabled={isLoading}
                >
                  삭제
                </button>
              </FlexChild>
            </HorizontalFlex>
          ))
        )}
      </VerticalFlex>

      {/* 페이지네이션 */}
      <HorizontalFlex justifyContent="center" alignItems="center" gap={8}>
        <button
          className="px-2 py-1 border rounded"
          disabled={uiPage <= 1 || isLoading}
          onClick={() => setUiPage((p) => Math.max(1, p - 1))}
        >
          이전
        </button>
        <P className="text-sm">
          {uiPage} / {totalPages}
        </P>
        <button
          className="px-2 py-1 border rounded"
          disabled={uiPage >= totalPages || isLoading}
          onClick={() => setUiPage((p) => Math.min(totalPages, p + 1))}
        >
          다음
        </button>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
