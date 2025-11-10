"use client";

import styles from "./TemplateCard.module.css";

interface TemplateCardProps {
  image: string;
  title: string;
  onCreate?: () => void;
}

export default function TemplateCard({ image, title, onCreate }: TemplateCardProps) {
  return (
    <div className={styles.card}>
      <img src={image} alt={title} className={styles.preview} />
      <div className={styles.info}>
        <p className={styles.title}>{title}</p>
        <button className={styles.createBtn} onClick={onCreate}>
          계약 작성
        </button>
      </div>
    </div>
  );
}
