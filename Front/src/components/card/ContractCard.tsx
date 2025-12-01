"use client";

import styles from "./ContractCard.module.css";
import VerticalFlex from "../flex/VerticalFlex";
import FlexChild from "../flex/FlexChild";
import Button from "../buttons/Button";
import P from "../P/P";
import Span from "../span/Span";
import clsx from "clsx";

interface ContractCardProps {
  image: string;
  title: string;
  approveStatus?: "pending" | "ready" | "confirm";
  completed?: boolean;
  deleted?: boolean;
  onView?: () => void;
  onSign?: () => void;
  senderReady?: boolean;
}

export default function ContractCard({
  image,
  title,
  approveStatus = "pending",
  completed = false,
  deleted = false,
  onView,
  onSign,
  senderReady = false,
}: ContractCardProps) {
  const getBadge = () => {
    if (deleted)
      return (
        <Span className={clsx(styles.badge, styles.deleted)}>파기된 계약</Span>
      );

    if (completed)
      return (
        <Span className={clsx(styles.badge, styles.complete)}>계약 완료</Span>
      );

    switch (approveStatus) {
      case "pending":
        return (
          <Span className={clsx(styles.badge, styles.active)}>
            서명 및 확인중
          </Span>
        );
      case "ready":
        return (
          <Span className={clsx(styles.badge, styles.ready)}>서명 완료</Span>
        );
      case "confirm":
        return (
          <Span className={clsx(styles.badge, styles.confirm)}>검토 완료</Span>
        );
      default:
        return null;
    }
  };

  const getButton = () => {
    if (deleted)
      return (
        <Button styleType="admin2" disabled>
          파기된 계약
        </Button>
      );

    if (completed)
      return (
        <Button styleType="admin2" disabled>
          계약 완료
        </Button>
      );

    switch (approveStatus) {
      case "pending":
        return (
          <Button styleType="admin2" onClick={onSign}>
            서명하기
          </Button>
        );

      case "ready":
        return senderReady ? (
          <Button styleType="admin2" onClick={onSign}>
            검토하기
          </Button>
        ) : (
          <Button styleType="admin2" disabled>
            검토 대기중
          </Button>
        );

      case "confirm":
        return (
          <Button styleType="admin2" disabled>
            검토 완료
          </Button>
        );

      default:
        return (
          <Button styleType="admin2" disabled>
            계약 완료
          </Button>
        );
    }
  };

  return (
    <VerticalFlex
      className={styles.card}
      alignItems="center"
      justifyContent="flex-start"
      gap={0}
    >
      <FlexChild className={styles.previewBox}>
        <img src={image} alt={title} className={styles.preview} />
        <div className={styles.badgeWrapper}>{getBadge()}</div>

        <div className={styles.overlay} />

        <Button
          styleType="admin2"
          className={styles.hoverButton}
          onClick={onView}
        >
          보기
        </Button>
      </FlexChild>

      <FlexChild className={styles.info}>
        <VerticalFlex alignItems="center" gap={8}>
          <P className={styles.title}>{title}</P>
          {getButton()}
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
