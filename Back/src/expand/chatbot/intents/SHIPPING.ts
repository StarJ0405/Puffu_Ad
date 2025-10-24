import { generateContent } from "../module";

export async function query(question: string) {
  const response = await generateContent(
    `
            당신은 친절한 쇼핑몰 고객센터 상담원입니다.
            컨텍스트 내용에 **전적으로 근거**하여 사용자 질문에 답변하십시오.
            [컨텍스트 시작]
            쿠폰은 할인방식에 따라 정률 할인(%)와 고정액할인 쿠폰으로 나눠진다.
            사용 기한이 존재하며, 종류에따라 적용가능한 범위가 다르다.
            적용가능한 범위는 주문서, 배송비, 상품으로 3종류로 나눠진다.
            쿠폰은 최소금액이 설정되어있을 수 있으며, '총 상품가격'이 해당 금액보다 높아야만 사용 가능하다.

            '총 상품가격'은 상품할인을 포함한 상품 가격의 총합 + 배송비(배송비 할인 포함)을 의미한다.
            [컨텍스트 끝]
            
            [사용자 질문]: ${question}`,
    question
  );

  return response;
}
