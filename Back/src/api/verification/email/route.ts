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
      // html: `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="width: 100%;">
      //               <tbody>
      //                 <tr>
      //                   <td align="center" style="padding: 20px;">
      //                     <p style="font-weight: 700; font-size: 20px;">푸푸 가입하기</p>
      //                   </td>
      //                 </tr>
      //                 <tr>
      //                   <td align="center" style="padding: 0 20px;">
      //                     <div style="padding: 10px; width: 100%; text-align: center; border: 1px solid #EEEEEE; background-color: #F4F4F4; border-radius: 8px;">
      //                       <p style="word-break: break-all;">${code}</p>
      //                     </div>
      //                   </td>
      //                 </tr>
      //                 <tr>
      //                   <td align="center" style="padding-bottom: 20px;">
      //                     <p style="font-size: 14px; color: #c1c1c1">하나의 계정으로 푸푸의 모든 서비스를!</p>
      //                   </td>
      //                 </tr>
      //               </tbody>
      //             </table>`,
      html: `<div style="background-color: #f7f7f7; padding: 40px; text-align: center;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px;">
                      <div style="text-align: center;">
                        <h1 style="color: #ff6600; margin: 0; font-size: 24px; letter-spacing: 2px;">PUFFU</h1>
                        <h2 style="color: #333333; margin-top: 10px; font-size: 28px; font-weight: bold; word-break: keep-all;">통합 회원가입 인증 메일</h2>
                        <p style="color: #666666; margin-top: 20px; font-size: 16px; line-height: 1.5; word-break: keep-all;">
                          안녕하세요, 푸푸입니다. 🎉<br>
                          회원가입을 완료하려면 아래 인증번호를 입력해주세요.
                        </p>
                      </div>
                      
                      <div style="background-color: #f2f2f2; border-radius: 6px; padding: 20px; margin-top: 30px; text-align: center;">
                        <p style="font-size: 32px; font-weight: bold; color: #333333; letter-spacing: 2px; margin: 0;">
                          ${code}
                        </p>
                      </div>
                      
                      <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #999999; text-align: left;">
                        <p style="margin: 0; word-break: keep-all;">
                          <span style="color: #ff0000; display: inline-block; margin-right: 5px;">?</span>
                          본 인증코드는 대/소문자를 구분합니다.
                        </p>
                        <p style="margin: 5px 0 0; word-break: keep-all;">
                          <span style="color: #ff0000; display: inline-block; margin-right: 5px;">?</span>
                          만약 본인이 신청한 메일이 아니라면, 이 메일을 무시해 주십시오.
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>`,
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
