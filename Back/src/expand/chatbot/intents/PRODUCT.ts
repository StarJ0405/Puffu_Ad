import { embedContent, generateContent } from "../module";

export async function query(question: string) {
  try {
    const query = await generateContent(
      `
            당신은 질문 분석 전문가입니다.
            아래 사용자 질문을 분석하여, **가장 핵심적인 검색 키워드**만 추출하십시오.
            출력은 **쉼표(,)로 구분된 단어 리스트 형태**로만 출력해야 합니다.
            목표는 저장된 데이터의 키(product_name, price, product_id)와 일치하는 키워드를 찾는 것입니다.

            예시)
            질문: 얼려먹고싶오의 가격을 알려줘
            출력: 얼려먹고싶오

            [사용자 질문]: ${question}
            출력:
            `,
      question
    );
    const contextChunks = await embedContent(query || "", "PRODUCT");
    const context = contextChunks.join("\n---\n");
    const response = await generateContent(
      `
        당신은 친절한 회사의 지식 도우미입니다.
        아래 제공된 [컨텍스트]에 **전적으로 근거**하여 사용자 질문에 답변하십시오.
        만약 컨텍스트에 답변할 정보가 없다면, 유사한 정보가 있다면 유사한 정보라고 알려줘
        상품명을 포함하는 경우는 유사한 정보가 아니라 해당 검색어로 검색한 결과라고 알려줘
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
    return question; // 오류 시 원본 질문 사용
  }
}
