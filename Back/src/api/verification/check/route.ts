import { verificationRequester } from "utils/class";

export const POST: ApiHandler = async (req, res) => {
  const { MOKConfirmData, session, authNumber } = req.body;

  if (!MOKConfirmData || !session) {
    return res.status(400).json({
      success: false,
      message: "MOKConfirmData와 session 값이 필요합니다.",
    });
  }

  const payload: any = { MOKConfirmData, session };
  if (authNumber) payload.authNumber = authNumber;
  const resultRes = await verificationRequester.post(
    "/mok/mok_api_result",
    payload
  );
  return res.json(resultRes);
};
