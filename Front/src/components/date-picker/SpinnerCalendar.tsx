"use client";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import React, { useEffect, useState } from "react";
import styles from "./SpinnerCalendar.module.css";

// --- 타입 정의 ---
interface SpinnerCalendarProps {
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  onDone: () => void;
  showTimePicker: boolean;
}

const SpinnerCalendar: React.FC<SpinnerCalendarProps> = ({
  selectedDate = new Date(),
  onSelectDate,
  onDone,
  showTimePicker,
}) => {
  const { isMobile } = useBrowserEvent();
  const [currentYear, setCurrentYear] = useState(selectedDate?.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(selectedDate?.getMonth());
  const [currentDate, setCurrentDate] = useState(selectedDate?.getDate());
  const [columns, setColumns] = useState<any[]>([]);
  const [preventScroll, setPreventScroll] = useState(!isMobile);
  const move = (behavior: "smooth" | "instant" = "smooth") => {
    document
      .getElementById(`year_${currentYear}`)
      ?.scrollIntoView({ behavior, block: "center" });
    document
      .getElementById(`month_${currentMonth + 1}`)
      ?.scrollIntoView({ behavior, block: "center" });
    document
      .getElementById(`date_${currentDate}`)
      ?.scrollIntoView({ behavior, block: "center" });
  };
  useEffect(() => {
    setTimeout(() => move("instant"), 100);
  }, []);
  useEffect(() => {
    const columns = [
      {
        min: 1900,
        max: 3000,
        id: "year",
        onWheel: (delta: number) => {
          if (delta > 0) {
            setCurrentYear(Math.max(currentYear + 1, 1900));
          } else {
            setCurrentYear(Math.min(currentYear - 1, 2999));
          }
        },
        onTouchEnd: (index: number) => {
          setCurrentYear(Math.min(Math.max(index, 1900), 2999));
        },
      },
      {
        min: 1,
        max: 12,
        id: "month",
        onWheel: (delta: number) => {
          if (delta > 0) {
            setCurrentMonth(Math.max(currentMonth + 1, 0));
          } else {
            setCurrentMonth(Math.min(currentMonth - 1, 11));
          }
        },
        onTouchEnd: (index: number) => {
          setCurrentMonth(Math.min(Math.max(index, 1), 12) - 1);
        },
      },
    ];
    const date = new Date(currentYear, currentMonth + 1, 0);
    columns.push({
      min: 1,
      max: date.getDate(),
      id: "date",
      onWheel: (delta: number) => {
        if (delta > 0) {
          setCurrentDate(Math.max(currentDate + 1, 1));
        } else {
          setCurrentDate(Math.min(currentDate - 1, date.getDate()));
        }
      },
      onTouchEnd: (index: number) => {
        setCurrentDate(Math.min(Math.max(index, 1), date.getDate()));
      },
    });
    move();
    setColumns(columns);
  }, [currentYear, currentMonth, currentDate]);
  return (
    <div className={styles.spinnerCalendarContainer}>
      {/* <div className={styles.headerDate}>{currentYear}</div> */}
      <div className={styles.spinnerHeader}></div>
      <div className={styles.spinnerColumnsWrapper}>
        <div className={styles.selectionOverlay} />
        {columns.map((column) => (
          <div
            id={column.id}
            key={column.id}
            className={styles.spinnerColumnLine}
            style={{ overflow: preventScroll ? "hidden" : "scroll" }}
          >
            {Array.from({ length: column.max - column.min }).map((_, index) => (
              <p
                id={`${column.id}_${index + column.min}`}
                key={`${column.id}_${index + column.min}`}
                className={styles.spinnerColumn}
                onWheel={(e) => column.onWheel(e.deltaY)}
                onTouchEnd={(e) => {
                  setPreventScroll(true);
                  setTimeout(() => {
                    setPreventScroll(false);
                    const scroll = document.getElementById(column.id);
                    column?.onTouchEnd(
                      column.min + Math.round((scroll?.scrollTop || 0) / 30)
                    );
                  }, 300);
                }}
              >
                {index + column.min}
              </p>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.doneButtonContainer}>
        <button
          className={styles.doneButton}
          onClick={() => {
            onSelectDate(new Date(currentYear, currentMonth, currentDate));
            onDone();
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default SpinnerCalendar;
