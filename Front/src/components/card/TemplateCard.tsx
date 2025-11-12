"use client";

import styles from "./TemplateCard.module.css";
import VerticalFlex from "../flex/VerticalFlex";
import FlexChild from "../flex/FlexChild";
import Button from "../buttons/Button";
import P from "../P/P";

interface TemplateCardProps {
  image: string;
  title: string;
  onCreate?: () => void;
}

export default function TemplateCard({ image, title, onCreate }: TemplateCardProps) {
  return (
    <VerticalFlex
      className={styles.card}
      alignItems="center"
      justifyContent="flex-start"
      gap={0}
    >
      <FlexChild className={styles.previewBox}>
        <img src={image} alt={title} className={styles.preview} />
      </FlexChild>

      <FlexChild className={styles.info}>
        <VerticalFlex alignItems="center" gap={8}>
          <P className={styles.title}>{title}</P>
          <Button
            styleType="main"
            width="100%"
            height={36}
            className={styles.createBtn}
            onClick={onCreate}
          >
            작성
          </Button>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
