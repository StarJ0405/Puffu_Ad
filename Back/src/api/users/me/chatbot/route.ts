import { Process } from "expand/chatbot/module";

export const POST: ApiHandler = async (req, res) => {
  const user = req.user;
  if (user.role !== "admin") return res.status(500);
  try {
    let { question }: any = req.body;
    question = question as string;
    if (!question) {
      return res.status(400).json({ error: "질문을 입력해주세요." });
    }
    const response = await Process(question, undefined, { user });

    return res.json({ answer: response });
  } catch (error) {
    res.status(500).json({ error: "처리 중 오류가 발생했습니다." });
  }
};
