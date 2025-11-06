import React from "react";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = ({
  id,
  width = 34,
  height = 34,
}: {
  id?: string;
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["width"];
}) => {
  return (
    <div id={id} className={styles.spinner_wrap}>
      <div className={styles.spinner} style={{ width, height }}>
        {/* <div className={style.spinnerCircle} /> */}
        <img src="/resources/icons/loading.png" className={styles.spin} />
      </div>
      {/* <p>불러오는 중</p> */}
    </div>
  );
};

export default LoadingSpinner;
