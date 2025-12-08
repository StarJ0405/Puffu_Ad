// import { Process } from "expand/chatbot/module";

import { stringify } from "querystring";

export const POST: ApiHandler = async (req, res) => {
  const user = req.user;
  if (user.role !== "admin") return res.status(500);
  try {
    let { question, chatId }: any = req.body;
    question = question as string;
    if (!question) {
      return res.status(400).json({ error: "질문을 입력해주세요." });
    }
    // const response = await Process(question, undefined, { user });

    // return res.json({ answer: response });

    const response = await fetch(
      `http://118.34.123.87:18888/api/v1/prediction/${process.env.FLOWISE_CHATFLOW_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLOWISE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          question,
          chatId,
          overrideConfig: {
            vars: {
              user_id: user.id,
            },
          },
        }),
      }
    );
    const result = await response.json();
    console.log(chatId, JSON.stringify(result?.usedTools?.[0]?.toolInput));
    // return result;
    return res.json({ answer: result?.text || "", chatId: result?.chatId });
  } catch (error) {
    res.status(500).json({ error: "처리 중 오류가 발생했습니다." });
  }
};
