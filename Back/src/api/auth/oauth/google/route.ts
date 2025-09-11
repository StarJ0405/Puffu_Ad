import { ApiHandler } from "app";
import { google } from "googleapis";
import { AccountLinkService } from "services/account_link";
import { container } from "tsyringe";
import { generateToken } from "utils/functions";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_LOGIN_REDIRECT_URL
);
const scopes = process.env.GOOGLE_SCOPE?.split(",") || [];

export const GET: ApiHandler = async (req, res) => {
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "online",
    scope: scopes,
    include_granted_scopes: true,
    state: "google",
  });
  if (authorizationUrl) return res.json({ url: authorizationUrl });
  return res.status(404).send("Cannot GET /auth");
};

export const POST: ApiHandler = async (req, res) => {
  const { code } = req.body;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  const idToken = tokens.id_token;
  if (idToken) {
    const ticket = await oauth2Client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (payload?.sub) {
      const service = container.resolve(AccountLinkService);
      const account = await service.get({
        where: {
          type: "oauth",
          name: "google",
          uuid: payload.sub,
        },
      });
      if (account)
        return res.json({
          access_token: generateToken(
            {
              user_id: account.user_id,
              keep: false,
            },
            {}
          ),
        });
      return res.status(404).json({
        error:
          "연동된 계정이 없습니다. 가입된 계정이 있다면 설정창을 확인해주세요.",
      });
    }
  }
  return res.status(404).send("Cannot POST /auth");
};
