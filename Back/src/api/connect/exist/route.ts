import { ConnectService } from "services/connect";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const { appid, redirect_uri } = req.parsedQuery;
  if (!appid || !redirect_uri)
    return res.status(404).send({ error: "매개변수 오류", status: 404 });
  const service = container.resolve(ConnectService);

  const find = await service.get({
    where: { appid: String(appid) },
  });
  if (!find)
    return res.status(404).json({ error: "매개변수 오류", status: 404 });
  try {
    const uri = new URL(String(redirect_uri));
    let allow = false;
    find.domains?.forEach((domain) => {
      if (allow) return;
      try {
        if (uri.hostname === domain) {
          return (allow = true);
        }
        if (domain.startsWith("*.")) {
          const _domain = domain.substring(2);
          if (_domain === uri.hostname) return (allow = true);
          if (uri.hostname.endsWith(`.${_domain}`)) {
            return (allow =
              uri.hostname.replace(`.${_domain}`, "").split(".")?.length === 1);
          }
        }
      } catch (err) {}
    });
    if (allow) return res.json({ message: "sucess", name: find.name });
    else return res.status(404).json({ error: "매개변수 오류", status: 404 });
  } catch (err) {
    return res.status(404).json({ error: "Redirect URI 오류", status: 404 });
  }
};
