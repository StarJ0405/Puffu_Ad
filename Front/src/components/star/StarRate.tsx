"use client";
// src/components/StarRate/StarRate.tsx
import clsx from "clsx";
import React, { MouseEvent, useCallback, useEffect, useState } from "react";
import styles from "./StarRate.module.css";
import { uniqueId } from "lodash";

interface StarRateProps {
  score?: number;
  onRate?: (newScore: number) => void;
  readOnly?: boolean;
  starCount?: number;
  starWidth?: number;
  starHeight?: number;
  maxScoreScale?: number;
  fillColor?: string;
  emptyColor?: string;
  width: React.CSSProperties["width"];
}

function StarRate({
  score = 0,
  onRate,
  readOnly = false,
  starCount = 5,
  starWidth = 15,
  starHeight = 15,
  maxScoreScale = 5,
  fillColor = "#fff",
  emptyColor = "#888",
  width,
}: StarRateProps) {
  const [uuid] = useState(uniqueId());
  const [internalScore, setInternalScore] = useState(score);
  // hoverScore 상태 제거
  // const [hoverScore, setHoverScore] = useState(0);

  useEffect(() => {
    setInternalScore(score);
  }, [score]);

  const calculateStarFillWidths = useCallback(
    (currentScore: number): number[] => {
      const fillWidths: number[] = Array(starCount).fill(0);
      let normalizedScore = (currentScore / maxScoreScale) * starCount;

      for (let i = 0; i < starCount; i++) {
        if (normalizedScore >= 1) {
          fillWidths[i] = starWidth;
          normalizedScore -= 1;
        } else if (normalizedScore > 0) {
          fillWidths[i] = normalizedScore * 14; // viewBox크기
          normalizedScore = 0;
        } else {
          fillWidths[i] = 0;
        }
      }
      return fillWidths;
    },
    [starCount, starWidth, maxScoreScale]
  );

  // displayScore는 이제 internalScore만 참조 (호버 없음)
  const displayScore = internalScore;
  const ratesResArr = calculateStarFillWidths(displayScore);
  const scoreUnitPerStar = maxScoreScale / starCount;
  const halfScoreUnitValue = 0.5 * scoreUnitPerStar;
  // handleMouseEnter 제거
  // const handleMouseEnter = useCallback((event: MouseEvent<HTMLSpanElement>, index: number) => {
  //   if (readOnly) return;
  //   // ... 호버 로직 ...
  // }, [readOnly, starWidth, scoreUnitPerStar, maxScoreScale, halfScoreUnitValue]);

  // handleMouseLeave 제거
  // const handleMouseLeave = useCallback(() => {
  //   if (readOnly) return;
  //   setHoverScore(0);
  // }, [readOnly]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLSpanElement>, index: number) => {
      if (readOnly) return;

      const starRect = event.currentTarget.getBoundingClientRect();
      const relativeX = event.clientX - starRect.left;

      const halfUnit = relativeX < starWidth / 2 ? 0.5 : 1;

      let newScore = (index + halfUnit) * scoreUnitPerStar;

      // 0점 방지 로직 (최소 0.5점부터 시작)
      // 사용자가 첫 번째 별의 가장 왼쪽 끝(0점)을 클릭하더라도 최소 0.5점을 부여
      if (newScore === 0) {
        newScore = halfScoreUnitValue;
      }

      const finalScore = Math.min(newScore, maxScoreScale);

      if (onRate) {
        onRate(finalScore);
      } else {
        setInternalScore(finalScore);
      }
      // setHoverScore(0); // 호버 상태 초기화 불필요
    },
    [
      readOnly,
      onRate,
      starWidth,
      scoreUnitPerStar,
      maxScoreScale,
      halfScoreUnitValue,
    ]
  );

  const isInteractive = !readOnly;

  return (
    <div
      className={clsx(styles.wrap, !isInteractive && styles.disabled)}
      style={{ width }}
    >
      {Array.from({ length: starCount }).map((_, idx) => (
        <span
          className={clsx(styles.star_icon, !isInteractive && styles.disabled)}
          key={`star_${idx}`}
          // onMouseEnter, onMouseLeave 이벤트 핸들러 제거
          // onMouseEnter={isInteractive ? (e) => handleMouseEnter(e, idx) : undefined}
          // onMouseLeave={isInteractive ? handleMouseLeave : undefined}
          onClick={isInteractive ? (e) => handleClick(e, idx) : undefined} // 클릭만 유지
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={starWidth}
            height={starHeight}
            viewBox="0 0 14 13"
            fill={emptyColor}
            style={{ width: starWidth, height: starHeight }}
          >
            <clipPath id={`starClip${uuid}_${idx}`}>
              <rect width={`${ratesResArr[idx]}`} height={starHeight} />
            </clipPath>
            <path
              id={`starPath${uuid}_${idx}`}
              d="M9,2l2.163,4.279L16,6.969,12.5,10.3l.826,4.7L9,12.779,4.674,15,5.5,10.3,2,6.969l4.837-.69Z"
              transform="translate(-2 -2)"
            />
            <use
              clipPath={`url(#starClip${uuid}_${idx})`}
              href={`#starPath${uuid}_${idx}`}
              fill={fillColor}
            />
          </svg>
        </span>
      ))}
    </div>
  );
}

export default StarRate;
