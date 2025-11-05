import { inject, injectable } from "tsyringe";
import { BaseService } from "data-source";
import { IntakeRequestRepository } from "repositories/intake_request";
import { IntakeRequest } from "models/intake_request";
import { CounterpartyService } from "services/counterparty";

@injectable()
export class IntakeRequestService extends BaseService<
  IntakeRequest,
  IntakeRequestRepository
> {
  constructor(
    @inject(IntakeRequestRepository) repo: IntakeRequestRepository,
    @inject(CounterpartyService)
    private counterpartyService: CounterpartyService
  ) {
    super(repo);
  }

  /* 검색 조건 빌드 */
  buildWhere(q?: string, store_id?: string, status?: string) {
    let where: any = {};
    if (q) where = this.Search(where, ["email"], q);
    if (store_id) where.store_id = store_id;
    if (status) where.status = status;
    return where;
  }

  /*Intake 요청 생성 (3일 유효) */
  async createRequest(store_id: string, email: string) {
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3); // 3일 유효
    const entity = await this.repository.create({
      store_id,
      email,
      expires_at: expires,
      status: "pending",
    });
    const saved = await this.repository.save(entity);
    // TODO: 이메일 전송 로직 추가 (token 포함)
    return saved;
  }

  /** 토큰 검증 */
  async verifyToken(token: string) {
    const req = await this.repository.findOne({ where: { token } });
    if (!req) throw new Error("Invalid token");
    if (req.expires_at && req.expires_at < new Date())
      throw new Error("Expired token");
    return req;
  }

  /** 피계약자 정보 제출 */
  async submitData(token: string, data: any) {
    const req = await this.verifyToken(token);
    const ctrp = await this.counterpartyService.create({
      store_id: req.store_id,
      name: data.name,
      email: req.email,
      phone: data.phone,
      biz_no: data.biz_no,
      bank: data.bank,
      bank_account: data.bank_account,
      status: "active",
    });
    req.status = "submitted";
    await this.repository.save(req);
    return ctrp;
  }
}
