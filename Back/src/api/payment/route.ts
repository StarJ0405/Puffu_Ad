export const GET: ApiHandler = async (req, res) => {
  try {
    const secret = process.env.BRAND_PAY_SECRET_KEY?.trim();
    if (!secret) {
      return res
        .status(500)
        .json({ error: "BRAND_PAY_SECRET_KEY missing", status: 500 });
    }

    const { customerKey, code } = req.query as {
      customerKey?: string;
      code?: string;
    };
    if (!customerKey || !code) {
      return res
        .status(400)
        .json({ error: "missing customerKey or code", status: 400 });
    }

    const auth = "Basic " + Buffer.from(`${secret}:`).toString("base64");

    const response = await fetch(
      "https://api.tosspayments.com/v1/brandpay/authorizations/access-token",
      {
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grantType: "AuthorizationCode",
          customerKey,
          code,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(result);
    }
    return res.json({ content: result });
  } catch (e: any) {
    return res
      .status(500)
      .json({ error: e?.message ?? "server error", status: 500 });
  }
};

export const POST: ApiHandler = async (req, res) => {
  try {
    const { paymentKey, orderId, amount } = req.body || {};
    if (!paymentKey || !orderId || typeof amount === "undefined") {
      return res.status(400).json({ error: "missing params", status: 400 });
    }

    const secret = process.env.TOSS_SECRET_KEY?.trim();
    if (!secret) {
      return res
        .status(500)
        .json({ error: "TOSS_SECRET_KEY missing", status: 500 });
    }

    const auth = Buffer.from(`${secret}:`).toString("base64");

    const r = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    });

    const payment = await r.json();
    if (!r.ok) {
      return res.status(r.status).json(payment);
    }

    return res.json({ ok: true, payment });
  } catch (e: any) {
    console.error("toss confirm error:", e);
    return res
      .status(500)
      .json({ error: e?.message ?? "confirm failed", status: 500 });
  }
};
