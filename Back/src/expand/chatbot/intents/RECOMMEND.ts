import { AppDataSource } from "data-source";
import { DocumentChunk } from "models/document_chunks";
import { dataToVector, generateContent } from "../module";

export async function query(question: string) {
  try {
    let json = await generateContent(
      `
        당신은 SQL 쿼리 조건 생성 전문가입니다.
        아래 질문을 분석하여, 검색에 필요한 JSON 객체를 생성하십시오.
        - 'price_min': 최소 가격 (숫자)
        - 'price_max': 최대 가격 (숫자)
        - 'category_filter': 필터링할 카테고리 이름 (문자열)

        결과는 오직 JSON 객체 형태로만 출력하십시오. 찾을 수 없으면 null 값을 사용하십시오.

        [사용자 질문]: ${question}
        출력:
        `,
      question
    );
    // if (query) console.log(JSON.parse(query));

    const query = JSON.parse(
      (json || "{}").replace("```json", "").replace("```", "")
    );
    const queryText = `
      SELECT
          dc.content,
          dc.embedding_vector <=> $1 AS score,
          CAST(REPLACE((dc.content::jsonb) ->> 'price','원','') AS INTEGER)
      FROM
          document_chunks dc
      LEFT JOIN product p
        ON p.id = dc.source_id
      WHERE
          dc.content::text ~ '^\s*\{.*\}\s*$'
          AND dc.intent = 'PRODUCT'
          ${
            query.price_min
              ? `AND CAST(REPLACE((dc.content::jsonb) ->> 'price','원','') AS INTEGER) >= ${query.price_min}`
              : ""
          }
          ${
            query.price_max
              ? `AND CAST(REPLACE((dc.content::jsonb) ->> 'price','원','') AS INTEGER) <= ${query.price_max}`
              : ""
          }
          ${
            query.category_filter
              ? `AND dc.source_id in (SELECT ctp.product_id FROM public.product_category ct 
                    LEFT JOIN public.product_category_product ctp ON ctp.product_category_id = ct.id
                    WHERE REPLACE(ct.name,' ','') ilike REPLACE('%${query.category_filter}%',' ', ''))`
              : ""
          }
      ORDER BY
        score
      LIMIT ${100}
    `;
    const result: DocumentChunk[] = await AppDataSource.manager.query(
      queryText,
      [await dataToVector(JSON.stringify(query))]
    );
    if (result.length === 0) return "해당하는 상품을 찾을 수 없습니다.";
    return `해당하는 상품으로는 ${result
      .map((data) => {
        const json = JSON.parse(data.content);
        return `'${json.product_name}' (${json.price})`;
      })
      .join(",")}가 있습니다.`;
  } catch (error) {
    console.error("키워드 추출 실패:", error);
    return question; // 오류 시 원본 질문 사용
  }
}
