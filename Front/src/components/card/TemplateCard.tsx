"use client";

import styles from "./TemplateCard.module.css";
import VerticalFlex from "../flex/VerticalFlex";
import FlexChild from "../flex/FlexChild";
import Button from "../buttons/Button";
import P from "../P/P";
import HorizontalFlex from "../flex/HorizontalFlex";
import Image from "../Image/Image";

interface TemplateCardProps {
  image: string;
  title: string;
  onCreate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function TemplateCard({
  image,
  title,
  onCreate,
  onEdit,
  onDelete,
}: TemplateCardProps) {
  return (
    <VerticalFlex
      className={styles.card}
      alignItems="center"
      justifyContent="flex-start"
      gap={0}
    >
      <FlexChild className={styles.previewBox}>
        <Button className={styles.hoverButton} onClick={onDelete}>
          <Image width={15} height={15} src="/resources/images/closeBtnWhite2x.png" />
        </Button>

        <Image src={image} alt={title} className={styles.preview} />
      </FlexChild>

      <FlexChild className={styles.info}>
        <VerticalFlex alignItems="center" gap={8}>
          <P className={styles.title}>{title}</P>
          <HorizontalFlex gap={5}>
            <Button
              styleType="main"
              width="50%"
              height={36}
              className={styles.createBtn}
              onClick={onCreate}
            >
              작성
            </Button>
            <Button
              styleType="main"
              width="50%"
              height={36}
              className={styles.createBtn}
              onClick={onEdit}
            >
              수정
            </Button>
          </HorizontalFlex>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
