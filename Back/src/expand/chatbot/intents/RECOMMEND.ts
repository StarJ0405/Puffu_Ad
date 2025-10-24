import { embedContent, generateContent } from "../module";

export async function query(question: string) {
  try {
    let json = await generateContent(
      `
        당신은 SQL 쿼리 조건 생성 전문가입니다.
        아래 질문을 분석하여, 검색에 필요한 JSON 객체를 생성하십시오.
        - 'price_min': 최소 가격 (숫자)
        - 'price_max': 최대 가격 (숫자)
        - 'category_filter': 필터링할 카테고리 이름 (문자열)
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
    const where = [`AND content::jsonb ->>'visible' = 'true'`];
    if (query.price_min) {
      where.push(
        `AND CAST(COALESCE(content::jsonb ->>'price','0') AS INTEGER) >= ${query.price_min}`
      );
    }
    if (query.price_max) {
      where.push(
        `AND CAST(COALESCE(content::jsonb ->>'price','0') AS INTEGER) <= ${query.price_max}`
      );
    }
    if (query.category_filter) {
      where.push(
        `AND content::jsonb ->> 'categories' ilike '%${query.category_filter}%'`
      );
    }
    const contextChunks = await embedContent(
      query.keyword || JSON.stringify(query),
      "PRODUCT",
      {
        where,
      }
    );
    const context = contextChunks.join("\n---\n");
    const response = await generateContent(
      `
        당신은 친절한 회사의 지식 도우미입니다.
        아래 제공된 [컨텍스트]에 **전적으로 근거**하여 사용자 질문에 답변하십시오.
        만약 컨텍스트에 답변할 정보가 없다면, 유사한 정보가 있다면 유사한 정보라고 알려줘
        유사한 정보가 있다면 해당 정보로 검색한 결과라고 알려줘
        유사한 정보조차 없다면 '정보를 찾을 수 없습니다'고만 간결하게 말하십시오.
        단, 상품 ID정보는 알려주지마!

        [컨텍스트 시작]
        ${context}
        [컨텍스트 끝]

        [사용자 질문]: ${question}
      `,
      question
    );
    return response;
  } catch (error) {
    console.error("키워드 추출 실패:", error);
    return "알 수 없는 질문입니다.";
  }
}
