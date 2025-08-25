import * as fs from "fs/promises";
import path from "path";
import { LinkService } from "services/link";
import { container } from "tsyringe";
import { MoreThan } from "typeorm";
import { encrypt } from "utils/functions";
import { schedule } from "../module";

const outputPath = path.join(
  __dirname,
  "../../../../uploads/processed_link_ids.txt"
);
const lastProcessedIdPath = path.join(
  __dirname,
  "../../../../uploads/last_processed_link_id.txt"
);
const limit = 1000;
let isWork = false; // 크론 작업 중복 실행 방지 플래그
async function getProcessedRowCount(): Promise<number> {
  try {
    const data = await fs.readFile(outputPath, "utf8");
    // 파일 내용이 비어있으면 0줄, 아니면 줄바꿈 문자로 분리하여 줄 수 계산
    // 마지막 줄이 줄바꿈으로 끝나지 않을 경우를 위해 .filter(Boolean) 추가
    const lines = data.split("\n").filter(Boolean);
    return lines.length;
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return 0; // 파일이 없으면 0줄
    }
    console.error(`Error reading processed row count: ${err.message}`);
    // 오류 발생 시 0을 반환하여 처음부터 다시 시작하도록 (또는 에러 처리 로직에 따라 다르게)
    return 0;
  }
}

export function regist(DEV: boolean) {
  const uploadDir = path.join(__dirname, "../../../../uploads");
  fs.mkdir(uploadDir, { recursive: true })
    .then(async () => {
      console.log(`[초기화] 'uploads' 디렉토리가 준비되었습니다.`);

      // 스케줄링된 작업 시작
      const _schedule = schedule("*/10 * * * * *", async () => {
        if (isWork) {
          console.log("[스케줄러] 이전 작업이 진행 중입니다. 건너뜁니다.");
          return;
        }
        isWork = true;
        console.log("--- Cron Job 시작: 링크 ID 파일 기록 ---");

        let currentSkip = await getProcessedRowCount(); // 현재 파일에 작성된 줄 수
        console.log(`[진행] 현재까지 파일에 기록된 링크 수: ${currentSkip}`);

        try {
          const service: LinkService = container.resolve(LinkService);
          const count = await service.getCount({
            where: {
              chance: MoreThan(0),
            },
            order: {
              created_at: "ASC",
            },
          });
          console.log(`[DB] 총 링크 수: ${count}`);
          if (count < 1000000) {
            return;
          }
          if (currentSkip >= count) {
            console.log(
              "[종료] 모든 링크가 이미 파일에 기록되었습니다. 스케줄러를 중지합니다."
            );
            isWork = false; // 종료 후 다음 스케줄 실행을 방지하기 위함
            _schedule.destroy(); // 모든 데이터를 처리했다면 스케줄러 종료
            return; // 함수 종료
          }

          let totalProcessedInThisRun = 0; // 이번 스케줄링 주기에서 처리된 총 링크 수

          while (true) {
            const links = await service.getList({
              skip: currentSkip, // 파일에 이미 기록된 줄 수만큼 스킵
              take: limit,
              order: {
                created_at: "ASC",
              },
            });

            if (links.length === 0) {
              console.log("[종료] 더 이상 처리할 새로운 링크가 없습니다.");
              break; // 더 이상 가져올 데이터가 없으면 루프 종료
            }

            const dataToWrite = links
              .map((link) => `https://qr.puffu.co.kr/${link.code}\n`)
              .join("");

            // 파일에 ID를 이어 쓰기
            await fs.appendFile(outputPath, dataToWrite, "utf8");
            console.log(
              `[기록 완료] ${currentSkip}번째 줄부터 ${
                currentSkip + links.length - 1
              }번째 줄까지 (${links.length}개) 파일에 기록했습니다.`
            );

            currentSkip += links.length; // 다음 배치의 시작점을 업데이트
            totalProcessedInThisRun += links.length;

            // 가져온 데이터가 limit보다 작으면 더 이상 가져올 데이터가 없다고 판단하고 종료
            if (links.length < limit || currentSkip >= count) {
              console.log(
                `[배치] 마지막 배치 (${links.length}개) 처리 완료. 이번 스케줄 작업에서 총 ${totalProcessedInThisRun}개 링크 처리됨.`
              );
              break;
            }
          }
          console.log(
            `[완료] 이번 스케줄 작업에서 총 ${totalProcessedInThisRun}개 링크를 처리했습니다. 최종 기록된 링크 수: ${currentSkip}`
          );
        } catch (err) {
          console.error("[오류] 링크 ID 처리 중 오류 발생:", err);
        } finally {
          isWork = false;
          console.log("--- Cron Job 종료 ---");
        }
      });

      console.log(
        "Node.js Cron 스케줄러가 시작되었습니다. 첫 번째 작업은 10초 후에 실행됩니다."
      );
    })
    .catch((err) => {
      console.error(`[오류] 초기 디렉토리 생성 실패: ${err.message}`);
      process.exit(1); // 디렉토리 생성 실패 시 프로세스 종료
    });
}
