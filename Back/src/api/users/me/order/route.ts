import { OrderService } from "services/order";
import { container } from "tsyringe";
import { randomUUID } from "crypto";

export const GET: ApiHandler = async (req, res) => {
  const user = req.user;
  let {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    ...where
  } = req.parsedQuery;
  const service: OrderService = container.resolve(OrderService);
  where = { ...where, user_id: user.id };
  if (pageSize) {
    const page = await service.getPageable(
      {
        pageSize: Number(pageSize),
        pageNumber: Number(pageNumber),
      },
      { select, order, relations, where }
    );
    return res.json(page);
  } else {
    const content = await service.getList({ select, order, relations, where });
    return res.json({ content });
  }
};

export const POST: ApiHandler = async (req, res) => {
  try {
    const secret = process.env.TOSS_SECRET_KEY?.trim();
    if (!secret) {
      return res.status(500).json({ error: "TOSS_SECRET_KEY missing", status: 500 });
    }

    const { paymentKey, orderId, amount } = req.body || {};
    if (!paymentKey || !orderId || typeof amount === "undefined") {
      return res.status(400).json({ error: "missing params", status: 400 });
    }


    const auth = Buffer.from(`${secret}:`).toString("base64");

    const r = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        "Idempotency-Key": randomUUID(), 
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
    return res.json({ content: payment });
  } catch (e: any) {
    console.error("toss confirm error:", e);
    return res.status(500).json({ error: "confirm failed", status: 500 });
  }
};
