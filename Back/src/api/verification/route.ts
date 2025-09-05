import { verificationRequester } from "utils/class";

export const GET: ApiHandler = async (req, res) => {
  const mokToken = await verificationRequester.get("/mok/mok_api_gettoken");
  return res.json({ mokToken });
};

export const POST: ApiHandler = async (req, res) => {
  const {
    userName,
    userPhoneNum,
    providerid,
    reqAuthType,
    userBirthday,
    userGender,
    userNation,
    MOKAuthRequestData,
  } = req.body;
  const response = await verificationRequester.post("/mok/mok_api_request", {
    serviceType: "telcoAuth",
    usageCode: "01005",
    retTransferType: "MOKResult",
    normalFlag: "Y",
    userName,
    userPhoneNum,
    providerid,
    reqAuthType,
    userBirthday,
    userGender,
    userNation,
    MOKAuthRequestData,
  });

  return res.json(response);
};
