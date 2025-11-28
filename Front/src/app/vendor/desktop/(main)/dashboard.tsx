"use client";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
Chart.register(
  LineController,
  BarController,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip
);

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

export function WeeklySalesChart({ data = [] }: { data: any[] }) {
  const chartRef = useRef<any>(null);
  const [chartInstance, setChartInstance] = useState<any>(null);
  const [chartError, setChartError] = useState<any>(null);

  // 로컬 디버깅용 상태
  const [debugInfo, setDebugInfo] = useState({
    received: false,
    dataCount: 0,
    hasLabels: false,
    hasAmounts: false,
    status: "waiting",
    lastUpdate: new Date().toLocaleString(),
    sampleItems: [] as any[],
  } as any);

  useEffect(() => {
    // 디버깅 정보 업데이트
    if (data) {
      setDebugInfo({
        received: true,
        dataCount: data.length,
        hasLabels: data.every((item) => item.day !== undefined),
        hasAmounts: data.every((item) => item.amount !== undefined),
        status: "data_received",
        lastUpdate: new Date().toLocaleString(),
        sampleItems: data.slice(0, 2),
      });
    } else {
      setDebugInfo({
        received: false,
        dataCount: 0,
        hasLabels: false,
        hasAmounts: false,
        status: "no_data",
        lastUpdate: new Date().toLocaleString(),
      });

      return;
    }

    // 기존 차트 정리
    if (chartInstance) {
      chartInstance?.destroy();
      setChartInstance(null);
    }

    if (!chartRef.current) {
      return;
    }

    try {
      // 매우 기본적인 데이터로 변환
      const safeData = data.map((item, i) => ({
        day: item && item.day ? item.day : `항목${i + 1}`,
        amount:
          item && typeof item.amount !== "undefined"
            ? isNaN(Number(item.amount))
              ? 0
              : Number(item.amount)
            : 0,
        point:
          item && typeof item.point !== "undefined"
            ? isNaN(Number(item.point))
              ? 0
              : Number(item.point)
            : 0,
      }));

      // 매우 단순한 차트 설정
      const ctx = chartRef.current.getContext("2d");
      const simplifiedConfig = {
        type: "line",
        data: {
          labels: safeData.map((item) => item.day),
          datasets: [
            {
              label: "매출액",
              data: safeData.map((item) => item.amount),
              backgroundColor: "#5471e6",
              borderColor: "#5471e6",
              tension: 0,
              borderWidth: 2,
            },
            {
              label: "포인트",
              data: safeData.map((item) => item.point),
              backgroundColor: "#7154e6",
              borderColor: "#7154e6",
              tension: 0,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      };

      // 차트 생성
      const newChartInstance = new Chart(ctx, simplifiedConfig as any);
      setChartInstance(newChartInstance);
      setChartError(null);

      setDebugInfo((prev: any) => ({
        ...prev,
        status: "chart_created",
        lastUpdate: new Date().toLocaleString(),
      }));

      // 클린업 함수
      return () => {
        if (newChartInstance) {
          newChartInstance.destroy();
        }
      };
    } catch (error: any) {
      setChartError(error.message || "차트 생성 오류");
      setDebugInfo((prev: any) => ({
        ...prev,
        status: "error",
        errorMessage: error.message,
        lastUpdate: new Date().toLocaleString(),
      }));
    }
  }, [data]);

  // 더미 데이터가 없을 경우 로딩 표시
  if (!data) {
    return <div className={styles.loading}>데이터를 불러오는 중...</div>;
  }

  // 차트 에러 시 기본 UI로 대체
  const renderFallbackChart = () => {
    // 가장 간단한 차트 시각화 (HTML/CSS로만 표현)
    const maxValue = Math.max(
      ...data.map((item) =>
        item && typeof item.amount !== "undefined"
          ? Number(item.amount) || 0
          : 0
      )
    );

    return (
      <div className={styles.fallbackChart}>
        <div className={styles.fallbackTitle}>
          <span>차트 렌더링 대체 표시 (그래프 라이브러리 오류)</span>
        </div>
        <div className={styles.barContainer}>
          {data.map((item, index) => {
            const value =
              item && typeof item.amount !== "undefined"
                ? isNaN(Number(item.amount))
                  ? 0
                  : Number(item.amount)
                : 0;

            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

            return (
              <div key={index} className={styles.barGroup}>
                <div
                  className={styles.bar}
                  style={{ height: `${percentage}%` }}
                >
                  <span className={styles.barValue}>
                    {value.toLocaleString()}원
                  </span>
                </div>
                <div className={styles.barLabel}>
                  {item && item.day ? item.day : `항목${index + 1}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <div className={styles.chartUpdateInfo}>
          <span className={styles.updateLabel}>최종 업데이트 </span>
          <span className={styles.updateTime}>
            {new Date().toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {chartError ? (
        <>
          {/* 오류 메시지 */}
          <div className={styles.chartErrorMessage}>
            <span>{chartError}</span>
            <button
              className={styles.retryButton}
              onClick={() => {
                setChartError(null);
                setChartInstance(null);
              }}
            >
              다시 시도
            </button>
          </div>

          {/* 폴백 차트 UI */}
          {renderFallbackChart()}

          {/* 개발 모드에서만 표시될 디버그 정보 */}
          {process.env.NODE_ENV === "development" && (
            <div className={styles.debugInfo}>
              <details>
                <summary>디버그 정보</summary>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </details>
            </div>
          )}
        </>
      ) : (
        <canvas ref={chartRef} className={styles.canvas} />
      )}

      <div className={styles.chartFooter}>
        <span className={styles.chartNote}>*최근 7일간의 데이터입니다.</span>
      </div>
    </div>
  );
}

export function StoreSalesStatistics({ data }: { data: any[] }) {
  const [sortType, setSortType] = useState("daily");
  const [direction, setDirection] = useState("DESC");
  // 더미 데이터 (실제 데이터가 없을 경우 사용)
  // const dummyData = [
  //   { id: "1", storeName: '대전점', monthly: 4535000, weekly: 395500, daily: 132000 },
  //   { id: "2", storeName: '테스트매장1', monthly: 8000, weekly: 2000, daily: 0 },
  //   { id: "3", storeName: '서울점', monthly: 3150000, weekly: 280000, daily: 65000 },
  // ];

  // 최대 5개 데이터만 표시
  const salesData = data || [];

  return (
    <div className={styles.container2}>
      <table className={styles.salesTable}>
        <thead>
          <tr>
            <th
              className={clsx(styles.clickable, {
                [styles.selected]: sortType === "storeName",
              })}
              onClick={() => {
                if (sortType !== "storeName") {
                  setSortType("storeName");
                  setDirection("ASC");
                } else setDirection(direction === "DESC" ? "ASC" : "DESC");
              }}
            >
              {`스토어명${
                sortType === "storeName"
                  ? direction === "DESC"
                    ? "▼"
                    : "▲"
                  : ""
              }`}
            </th>
            <th
              className={clsx(styles.clickable, {
                [styles.selected]: sortType === "monthly",
              })}
              onClick={() => {
                if (sortType !== "monthly") {
                  setSortType("monthly");
                  setDirection("DESC");
                } else setDirection(direction === "DESC" ? "ASC" : "DESC");
              }}
            >
              {`월${
                sortType === "monthly" ? (direction === "DESC" ? "▼" : "▲") : ""
              }`}
            </th>
            <th
              className={clsx(styles.clickable, {
                [styles.selected]: sortType === "weekly",
              })}
              onClick={() => {
                if (sortType !== "weekly") {
                  setSortType("weekly");
                  setDirection("DESC");
                } else setDirection(direction === "DESC" ? "ASC" : "DESC");
              }}
            >
              {`주${
                sortType === "weekly" ? (direction === "DESC" ? "▼" : "▲") : ""
              }`}
            </th>
            <th
              className={clsx(styles.clickable, {
                [styles.selected]: sortType === "daily",
              })}
              onClick={() => {
                if (sortType !== "daily") {
                  setSortType("daily");
                  setDirection("DESC");
                } else setDirection(direction === "DESC" ? "ASC" : "DESC");
              }}
            >
              {`일${
                sortType === "daily" ? (direction === "DESC" ? "▼" : "▲") : ""
              }`}
            </th>
          </tr>
        </thead>
        <tbody>
          {salesData
            .sort((s1, s2) => {
              const v1 = s1?.[sortType];
              const v2 = s2?.[sortType];
              if (typeof v1 === "number" && typeof v2 === "number") {
                const value =
                  direction === "DESC"
                    ? s2?.[sortType] - s1?.[sortType]
                    : s1?.[sortType] - s2?.[sortType];
                if (value !== 0) return value;
              }

              return direction === "DESC"
                ? String(s2.storeName).localeCompare(s1.storeName)
                : String(s1.storeName).localeCompare(s2.storeName);
            })
            .map((store, index) => (
              <tr key={store.id || index}>
                <td className={styles.storeName}>{store.storeName}</td>
                <td className={styles.amount}>
                  {store.monthly.toLocaleString()} 원
                </td>
                <td className={styles.amount}>
                  {store.weekly.toLocaleString()} 원
                </td>
                <td className={styles.amount}>
                  {store.daily.toLocaleString()} 원
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
