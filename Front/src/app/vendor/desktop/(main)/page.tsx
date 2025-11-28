import Container from "@/components/container/Container";
import { StoreSalesStatistics, WeeklySalesChart } from "./dashboard";
import styles from "./page.module.css";
export default async function () {
  const totalWeekEachAmount = [
    { day: "월", amount: 0, point: 0 },
    { day: "화", amount: 0, point: 0 },
    { day: "수", amount: 0, point: 0 },
    { day: "목", amount: 0, point: 0 },
    { day: "금", amount: 0, point: 0 },
    { day: "토", amount: 0, point: 0 },
    { day: "일", amount: 0, point: 0 },
  ];
  const totalSalesAmount = [] as any[];
  return (
    <>
      <Container padding={20} width={"100%"}>
        <div className={styles.container}>
          <div className={styles.flexGrid}>
            {/* 주간 총 매출현황 */}
            <div className={`${styles.flexBox} ${styles.wideBox}`}>
              <div className={styles.card}>
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>주간 총 매출현황</div>
                  <div className={styles.sectionContent}>
                    <WeeklySalesChart data={totalWeekEachAmount} />
                  </div>
                </div>
              </div>
            </div>

            {/* 스토어별 매출현황 */}
            <div className={styles.flexBox}>
              <div className={styles.card}>
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>스토어별 매출현황</div>
                  <div className={styles.sectionContent}>
                    <StoreSalesStatistics data={totalSalesAmount} />
                  </div>
                </div>
              </div>
            </div>

            {/* <div className={`${styles.flexBox} ${styles.fullWidthBox}`}>
              <HorizontalFlex gap={15} justifyContent={"flex-start"}>
                <FlexChild width="calc(100% / 2 - 8px)">
                  <WeeklyAccessDevice />
                </FlexChild>
                <FlexChild width="calc(100% / 2 - 8px)">
                  <WeeklyReferralSource />
                </FlexChild>
              </HorizontalFlex>
            </div> */}
          </div>
        </div>
      </Container>
    </>
  );
}
