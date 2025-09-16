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
    const paytype = (req.body?.paytype || "").toLowerCase();

    if (paytype !== "nestpay") {
      return res.status(400).json({
        type: "error",
        content: "unsupported paytype",
      });
    }

    // products가 문자열이면 JSON으로 변환
    if (typeof req.body.products === "string") {
      req.body.products = JSON.parse(req.body.products);
    }

    const response = await nestpayAxios.post(`${NESTPAY_BASE_URL}/api/ready`, {
      ready: req.body,
    });

    return res.json(response.data);
  } catch (err: any) {
    console.error("Nestpay Error Response:", err.response?.data || err);
    return res.status(err.response?.status || 500).json({
      type: "error",
      content: err.response?.data || err.message,
    });
  }
};
