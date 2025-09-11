import { ApiHandler } from "app";
import { google } from "googleapis";
import { User } from "models/user";
import { AccountLinkService } from "services/account_link";
import { container } from "tsyringe";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_LINK_REDIRECT_URL
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
  const user: User = req.user;
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
      // if (
      //   user?.accounts?.some(
      //     (s) =>
      //       s.type === "oauth" && s.name === "google" && s.uuid === payload.sub
      //   )
      // )
      //   return res.status(404).json({ error: "이미 연동된 상태입니다." });
      const account = await service.get({
        where: {
          type: "oauth",
          name: "google",
          uuid: payload.sub,
        },
        withDeleted: true,
      });
      if (account) {
        if (!account.deleted_at)
          return res.status(404).json({ error: "이미 연동된 상태입니다." });
        await service.restore({
          id: account.id,
        });
      } else {
        await service.create({
          type: "oauth",
          name: "google",
          uuid: payload.sub,
          user_id: user.id,
        });
      }
      res.json({ message: "구글 연동에 성공하셨습니다." });
    }
  }
  return res.status(404).send("Cannot POST /auth");
};

export const DELETE: ApiHandler = async (req, res) => {
  const user: User = req.user;
  const service = container.resolve(AccountLinkService);
  await service.delete({
    type: "oauth",
    name: "google",
    user_id: user.id,
  });
  return res.json({ message: "연동을 해제했습니다." });
};
