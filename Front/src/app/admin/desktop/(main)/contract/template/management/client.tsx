"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { adminRequester } from "@/shared/AdminRequester";
import Button from "@/components/buttons/Button";
import P from "@/components/P/P";
import HorizontalFlex from "@/components/flex/HorizontalFlex";

export function TemplateManagementClient() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    setLoading(true);
    try {
      const res = await adminRequester.getContracts({
        origin_id: null,
        pageSize: 20,
        pageNumber: 0,
      }) as any;
      setTemplates(Array.isArray(res.rows) ? res.rows : res);
    } catch (e) {
      console.error("템플릿 목록 로드 실패", e);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <HorizontalFlex justifyContent="space-between" alignItems="center">
        <P className={styles.title}>템플릿 관리</P>
        <Button styleType="admin" onClick={() => alert("새 템플릿 만들기")}>
          새 템플릿 만들기
        </Button>
      </HorizontalFlex>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>이름</th>
            <th>최근 수정일</th>
            <th>설정</th>
          </tr>
        </thead>
        <tbody>
          {!loading && templates.length > 0 ? (
            templates.map((tpl) => (
              <tr key={tpl.id}>
                <td>{tpl.name}</td>
                <td>{new Date(tpl.updated_at).toLocaleDateString()}</td>
                <td>
                  <Button
                    styleType="white"
                    onClick={() => alert(`설정: ${tpl.name}`)}
                  >
                    설정
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>등록된 템플릿이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
