import { container } from "tsyringe";
import { schedule } from "../module";
import { StackItemService } from "services/stack_item";

export function regist(DEV: boolean) {
  // 매 1분마다 실행 (* * * * *)
  schedule(
    "* * * * *",
    async () => {
      try {
        const stackItemService = container.resolve(StackItemService);
        // 180초(3분) 지난 임시 재고 정리
        await stackItemService.clearExpiredTempStacks(180);
      } catch (e) {
        console.error("[Cron] clean_temp_stack_item Error:", e);
      }
    },
    {}
  );
}