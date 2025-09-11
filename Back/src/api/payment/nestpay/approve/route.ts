import axios from "axios";

export const POST: ApiHandler = async (req, res) => {
  const NESTPAY_BASE_URL = process.env.NESTPAY_BASE_URL;
  const NESTPAY_SECRET_KEY = process.env.NESTPAY_SECRET_KEY;

  const nestpayAxios = axios.create({
    timeout: 30000,
    maxRedirects: 5,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: NESTPAY_SECRET_KEY,
    },
  });

  try {
    const { trxId, resultCd, resultMsg } = req.body;

    const approveResponse = await nestpayAxios.post(
      `${NESTPAY_BASE_URL}/api/approve/keyin/${trxId}`,
      {}, // empty body
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: NESTPAY_SECRET_KEY,
          Charset: "utf-8",
        },
      }
    );

    const approveResult = approveResponse.data;

    if (resultCd === "0000") {
      // 결제 성공 - DB 저장 없이 결과만 반환
      return res.json({
        message: "SUCCESS",
        trxId,
        approveResult,
      });
    } else {
      // 결제 실패
      return res.json({
        message: "FAIL",
        trxId,
        resultCd,
        resultMsg,
      });
    }
  } catch (error) {
    console.error("Payment approval failed:", (error as Error).message);
    return res.json({ message: "FAIL", error: (error as Error).message });
  }
};
