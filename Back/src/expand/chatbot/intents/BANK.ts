import { generateContent } from "../module";

export async function query(question: string) {
  const response = await generateContent(
    `
            당신은 친절한 쇼핑몰 고객센터 상담원입니다.
            컨텍스트 내용에 **전적으로 근거**하여 사용자 질문에 답변하십시오.
            [컨텍스트 시작]
            무통장 입금에 사용되는 은행은 'KEB하나은행'이고, 예금주는 '푸푸글로벌 주식회사'이고, 계좌번호는 '642-910017-99204'이다.
            CS가 활동하는 시간에만 확인하며, CS는 평일 09:30 ~ 18:30에 활동하며 점심시간은 12:00 ~ 13:00이다.
            [컨텍스트 끝]
            
            [사용자 질문]: ${question}`,
    question
  );

  return response;
}
