import { AppDataSource } from "data-source";
import { generateContent, Process } from "../module";

interface Split {
  question: string;
  value: string;
}
export async function query(question: string, metadata?: Record<string, any>) {
  const classification = await findIntent(question);
  if (list.find((f) => f.value === classification))
    return await Process(question, classification, metadata);
  else {
    // return generateDefault(question) // 기본 챗봇 질문 조회
    return "좀 더 자세한 설명을 부탁드려요!";
  }
}

const list: Split[] = [
  {
    question: "특정 상품의 정보(이름, 가격, ID 등)",
    value: "PRODUCT",
  },
  {
    question: "특정한 조건의 상품들을 추천",
    value: "RECOMMEND",
  },
  {
    question: "이벤트(행사)나 특가 상품, 세일(할인) 상품에 관한 내용",
    value: "EVENT",
  },
  {
    question: "결제 수단 변경에 관한 내용",
    value: "PAYMENT",
  },
  {
    question: "할인 쿠폰에 대한 내용",
    value: "COUPON",
  },
  {
    question: "무통장 입금 계좌에 관한 내용",
    value: "BANK",
  },
  {
    question:
      "특정 주문서의 정보(주문번호)거나 혹은 특정 상품을 주문했던 기록 혹은 가장 최근 주문서 목록",
    value: "ORDER",
  },
  {
    question: "주문 취소에 관한 내용",
    value: "ORDER_CANCEL",
  },
  {
    question: "배송 조회이나 운송장 번호, 배송상태에 관한 내용",
    value: "SHIPPING",
  },
  {
    question: "배송지 변경에 관한 내용",
    value: "ADDRESS",
  },
  {
    question: "주문서 변경에 관한 내용",
    value: "ORDER_CHANGE",
  },
  {
    question: "회원 가입에 관한 내용",
    value: "SIGNUP",
  },
  {
    question: "고객센터나 상담사 연결에 관한 내용",
    value: "HELP",
  },
];
async function findIntent(question: string) {
  const intent: Intention = (
    await AppDataSource.manager.query(
      `SELECT * FROM public.intention WHERE keyword ilike '%${question}%' LIMIT 1`
    )
  )?.[0];
  if (intent) return intent.intent.toUpperCase();
  const prompt = `
            당신은 질문 분류 전문가입니다.
            사용자 질문을 분석하여, 질문이 ${list
              .map((d) => `'${d.question}'에 관한 것이라면, '${d.value}'를`)
              .join(", 또는 ")},
            그렇지 않다면 'GENERAL'을 **단 하나의 단어**로만 출력하십시오.

            [사용자 질문]: ${question}
`;
  try {
    const classification = (
      await generateContent(prompt, question)
    )?.toUpperCase();

    return classification;
  } catch (error) {
    return "GENERAL";
  }
}
