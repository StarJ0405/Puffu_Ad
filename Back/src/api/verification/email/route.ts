import { ApiHandler } from "app";
import { sendMail } from "expand/smtp/module";
import { UserService } from "services/user";
import { container } from "tsyringe";
import { generateShortId } from "utils/functions";

export const POST: ApiHandler = async (req, res) => {
  const { email, update = false } = req.body;
  try {
    const code = generateShortId(6);
    await sendMail({
      to: email,
      subject: `푸푸 회원가입 임시 코드는 ${code}입니다.`,
      html: `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="width: 100%;">
                    <tbody>
                      <tr>
                        <td align="center" style="padding: 20px;">
                          <p style="font-weight: 700; font-size: 20px;">푸푸 가입하기</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 0 20px;">
                          <div style="padding: 10px; width: 100%; text-align: center; border: 1px solid #EEEEEE; background-color: #F4F4F4; border-radius: 8px;">
                            <p style="word-break: break-all;">${code}</p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-bottom: 20px;">
                          <p style="font-size: 14px; color: #c1c1c1">하나의 계정으로 푸푸의 모든 서비스를!</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>`,
    });
    if (update) {
      const service = container.resolve(UserService);
      await service.update(
        { username: email },
        { metadata: () => `metadata || '{"code":"${code}"}'::jsonb` }
      );
    }
    return res.json({ message: "메일 전송에 성공했습니다.", code });
  } catch (err) {
    return res.status(404).json({
      error: `메일 전송에 실패했습니다.`,
      status: 404,
    });
  }
};
