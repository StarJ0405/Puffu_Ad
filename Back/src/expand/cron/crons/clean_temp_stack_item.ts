import { inject, injectable } from "tsyringe";
import cron from "node-cron";
import { StackItemService } from "services/stack_item";

@injectable()
export class CleanTempStackItemCron {
  constructor(
    @inject(StackItemService) private stackItemService: StackItemService
  ) {}

  start() {
    cron.schedule("* * * * *", async () => {
      try {
        // 180초(3분) 이상 지난 임시 재고 삭제
        await this.stackItemService.clearExpiredTempStacks(180);
      } catch (e) {
        console.error("CleanTempStackItemCron Error", e);
      }
    });
  }
}