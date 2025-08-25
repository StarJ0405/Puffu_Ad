import { LinkService } from "services/link";
import { container } from "tsyringe";
import { schedule } from "../module";

let isWork = false;
const limit = 1000;
export function regist(DEV: boolean) {
  const _schedule = schedule("*/10 * * * * *", async () => {
    if (isWork) return;
    const service = container.resolve(LinkService);
    const count = await service.getCount();
    if (count >= 1000000) {
      await _schedule.destroy();
      return;
    }
    await service.creates(
      {
        chance: 1,
      },
      limit
    );
  });
}
