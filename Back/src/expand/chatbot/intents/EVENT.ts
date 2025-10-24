import { embedContent, generateContent } from "../module";

export async function query(question: string) {
  try {
    let json = await generateContent(
      `
      당신은 SQL 쿼리 조건 생성 전문가입니다.
      아래 질문을 분석하여, 검색에 필요한 JSON 객체를 생성하십시오.
      - 'status': 진행중(continue) 또는 종료(end), 예정(ready)
      - 'keyword': 저장된 데이터의 키(event_name, starts_at, ends_at, discounts, bundles)와 일치하는 키워드
          > discounts는 할인행사로 할인율(value), 상품목록(products), 옵션적용된 상품(variants)로 구성되어있다.
          > bundles는 N+M행사로 N(조건 수량), 증정수량(M), 상품목록(products), 옵션적용된 상품(variants)로 구성되어있다.

      결과는 오직 JSON 객체 형태로만 출력하십시오. 찾을 수 없으면 null 값을 사용하십시오.

      [사용자 질문]: ${question}
      출력:
      `,
      question
    );

    const query = JSON.parse(
      (json || "{}").replace("```json", "").replace("```", "")
    );
    const where: string[] = [];

    if (query.status) {
      switch (query.status) {
        case "ready": {
          where.push(
            `AND CAST(content::json->>'starts_at' AS DATE) > DATE(NOW())`
          );
          break;
        }
        case "continue": {
          where.push(
            `AND CAST(content::json->>'starts_at' AS DATE) <= DATE(NOW())`,
            `AND CAST(content::json->>'ends_at' AS DATE) > DATE(NOW())`
          );
          break;
        }
        case "end": {
          where.push(
            `AND CAST(content::json->>'ends_at' AS DATE) <= DATE(NOW())`
          );
          break;
        }
      }
    }
    const contextChunks = await embedContent(
      query.keyword || JSON.stringify(query),
      "EVENT",
      { where }
    );
    const context = contextChunks.join("\n---\n");

    const response = await generateContent(
      `
    당신은 친절한 회사의 지식 도우미입니다.
    아래 제공된 [컨텍스트]에 조건에 맞춰서 검색된 목록이므로 사용자 질문을 보고 개수나 순서 등 사용자의 요구에 맞춰서 대답하십시오.
    만약 컨텍스트에 답변할 정보가 없다면, '만족하는 결과를 찾을 수 없습니다.'라고만 간결하게 말하십시오.
    추가적으로 아래 정보는 이벤트 중인 목록과 해당하는 상품 목록이며, 이벤트는 할인과 증정 두 종류로 나눠진다.
    할인은 상품의 가격을 할인해주는 것이고 증정은 N개를 구매하면 M개를 증정하는 형식이다.
    행사명이 같아도 event_id가 다르면 다른 행사이다.
    단, ID정보는 알려주지마!

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
