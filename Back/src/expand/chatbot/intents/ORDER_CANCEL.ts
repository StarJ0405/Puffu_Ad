import { container } from "tsyringe";
import { generateContent } from "../module";
import { OrderRepository } from "repositories/order";
import { FindOptionsWhere } from "typeorm";
import { Order } from "models/order";

export async function query(question: string, metadata?: Record<string, any>) {
  const user = metadata?.user;
  const json = await generateContent(
    `
              당신은 SQL 쿼리 조건 생성 전문가입니다.
              아래 질문을 분석하여, 검색에 필요한 JSON 객체를 생성하십시오.
              - 'display': 주문번호
      
              결과는 오직 JSON 객체 형태로만 출력하십시오. 찾을 수 없으면 null 값을 사용하십시오.
      
              [사용자 질문]: ${question}
              출력:
              `,
    question
  );
  const query = JSON.parse(
    (json || "{}").replace("```json", "").replace("```", "")
  );
  const repo = container.resolve(OrderRepository);
  const where: FindOptionsWhere<Order> = {
    user_id: user.id,
  };
  let context;
  if (query.display) {
    where.display = query.display;
    const result = await repo.findAll({ where });
    const contextChunks = result.map((row) => {
      let status;
      switch (row.status) {
        case "awaiting": {
          status = "입금 대기중";
          break;
        }
        case "pending": {
          status = "상품 준비중";
          break;
        }
        case "fulfilled": {
          status = "배송준비";
          break;
        }
        case "shipping": {
          status = "배송중";
          break;
        }
        case "complete": {
          status = "배송완료";
          break;
        }
        case "cancel": {
          status = "주문취소";
          break;
        }
      }
      return JSON.stringify(
        {
          display: row.display,
          status,
        },
        null,
        2
      );
    });
    context = contextChunks.join("\n---\n");
  }
  const response = await generateContent(
    `
            당신은 친절한 쇼핑몰 고객센터 상담원입니다.
            컨텍스트 내용에 **전적으로 근거**하여 사용자 질문에 답변하십시오.
            주문 취소 버튼은 주문서가 '입금 대기중' 혹은 '상품 준비중' 일때만 가능하며, 그 이후 단계에서는 이미 물품이 출발하여 주문 취소는 불가능하며, 환불로 진행되게됩니다.
            환불 및 교환 버튼은 주문서가 배송완료 상태일때 활성화되며, 상품을 구매확정하지 않은 경우에만 가능합니다.

            [컨텍스트 시작]
            ${context}
            [컨텍스트 끝]
            
            [사용자 질문]: ${question}`,
    question
  );

  return response;
}
