import { ConnectCodeService } from "services/connect-code";
import { LinkService } from "services/link";
import { container } from "tsyringe";
import { schedule } from "../module";

export function regist(DEV: boolean) {
  // 스케줄링된 작업 시작
  schedule(
    "0 0 0 * * *",
    async () => {
      const connectCodeService = container.resolve(ConnectCodeService);
      await connectCodeService.removeExpires();
      const linkService = container.resolve(LinkService);
      await linkService.clean();
    },
    {}
  );
}
