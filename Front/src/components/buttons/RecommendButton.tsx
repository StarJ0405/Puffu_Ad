"use client";

import { useEffect, useState, useCallback } from "react";
import clsx from "clsx";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Button from "@/components/buttons/Button";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import { requester } from "@/shared/Requester";
import { toast } from "@/shared/utils/Functions";
import styles from "@/components/buttons/RecommendButton.module.css";

type ClassNames = {
  wrap?: string;
  button?: string;
  buttonActive?: string;
};

type RecommendButtonProps = {
  reviewId: string;
  classNames?: ClassNames;
  iconSrc?: string;
  promptText?: string;
  confirmText?: string;
  cancelText?: string;
  onToggle?: (liked: boolean) => void;
};

export default function RecommendButton({
  reviewId,
  classNames: _classNames = {
    wrap: styles.wrap,
    button: styles.button,
    buttonActive: styles.buttonActive,
  },
  iconSrc = "/resources/icons/board/review_like.png",
  promptText = "이 리뷰가 도움이 되었나요?",
  confirmText = "도움이 됐어요",
  cancelText = "추천 취소",
  onToggle,
}: RecommendButtonProps) {
  const classNames = {
    wrap: styles.wrap,
    button: styles.button,
    buttonActive: styles.buttonActive,
    ..._classNames,
  };
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await requester.getRecommend(reviewId);
        if (!alive) return;
        setLiked(Boolean(res?.content?.id));
      } catch {
        // 초기 상태 조회 실패 시 무시
      }
    })();
    return () => {
      alive = false;
    };
  }, [reviewId]);

  const toggleRecommend = useCallback(async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    const next = !liked;
    try {
      if (next) {
        await requester.createRecommend({ review_id: reviewId });
        window.dispatchEvent(
          new CustomEvent("review:recommend-changed", {
            detail: { id: reviewId, delta: +1 },
          })
        );
        toast({ message: "리뷰가 추천되었습니다." });
      } else {
        await requester.deleteRecommend(reviewId);
        window.dispatchEvent(
          new CustomEvent("review:recommend-changed", {
            detail: { id: reviewId, delta: -1 },
          })
        );
        toast({ message: "추천이 취소되었습니다." });
      }
      setLiked(next);
      onToggle?.(next);
    } catch (e: any) {
      toast({ message: e?.message || "처리에 실패했습니다." });
    } finally {
      setLikeLoading(false);
    }
  }, [liked, likeLoading, reviewId, onToggle]);

  return (
    <VerticalFlex className={classNames?.wrap} gap={15} hidden>
      <P>{promptText}</P>
      <Button
        className={clsx(classNames.button, {
          [classNames.buttonActive!]: liked,
        })}
        aria-pressed={liked}
        data-active={liked}
        disabled={likeLoading}
        onClick={toggleRecommend}
      >
        <Image src={iconSrc} width={20} height={"auto"} />
        <P>{liked ? cancelText : confirmText}</P>
      </Button>
    </VerticalFlex>
  );
}
