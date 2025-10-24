import { Order } from "models/order";
import { OrderRepository } from "repositories/order";
import { container } from "tsyringe";
import { FindOneOptions, FindOptionsWhere, Raw } from "typeorm";
import { embedContent, generateContent } from "../module";

export async function query(question: string, metadata?: Record<string, any>) {
  const user = metadata?.user;
  const json = await generateContent(
    `
              당신은 SQL 쿼리 조건 생성 전문가입니다.
              아래 질문을 분석하여, 검색에 필요한 JSON 객체를 생성하십시오.
              - 'display': 주문번호
              - 'products': 주문한 상품의 상품명 목록
              - 'sort' : 정렬에 관한 내용이 가격이 높은순이면 'high_price', 낮은순이면 'low_price', 오래된 순서는 'past', 주문 번호순이나 최근순 혹은 없으면 'recent'값
              - 'keyword': 저장된 데이터의 키(product_name, product_id,categories,tags,type,brand_name)와 일치하는 키워드
              결과는 오직 JSON 객체 형태로만 출력하십시오. 찾을 수 없으면 null 값을 사용하십시오.
      
              [사용자 질문]: ${question}
              출력:
              `,
    question
  );
  const query = JSON.parse(
    (json || "{}").replace("```json", "").replace("```", "")
  );
  const where = [`AND content::json ->>'user_id' ='${user.id}'`];
  if (query.display) {
    where.push(`AND content::json ->>'display' ='${query.display}'`);
  }
  if (query.products) {
    where.push(
      `EXISTS (SELECT 1 FROM json_array_elements(content::json ->'items') AS item WHERE item->> 'title' ILIKE ALL (ARRAY[${(
        query.products || []
      ).map((product: string) => `'%${product}%'`)}]))`
    );
  }
  const contextChunks = await embedContent(
    query.keyword || JSON.stringify(query),
    "ORDER",
    {
      where,
      sort: `content::json ->>'display' desc`,
    }
  );
  const context = contextChunks.join("\n---\n");
  const response = await generateContent(
    `
            당신은 친절한 회사의 지식 도우미입니다.
            아래 제공된 [컨텍스트]에 조건에 맞춰서 검색된 주문서 내역이므로 사용자 질문을 보고 사용자 요구에 맞춰서 대답하시오.
            만약 컨텍스트에 답변할 정보가 없다면, '만족하는 주문서를 찾을 수 없습니다.'라고만 간결하게 말하십시오.
            
            주문서 데이터에서 '총 상품금액(배송비 포함)'은 total이고, '총 할인금액'은 total_discount이고, '총 결제금액'은 total_payment이다.
            [컨텍스트 시작]
            ${context}
            [컨텍스트 끝]
            
            [사용자 질문]: ${question}`,
    question
  );

  return response;
}
