import styles from './LoadingOverlay.module.css'

export default function LoadingOverlay() {
  return (
    <div className={styles.loadingOverlay}>
      <p className="mt-3 text-white">로딩 중...</p>
    </div>
  );
}