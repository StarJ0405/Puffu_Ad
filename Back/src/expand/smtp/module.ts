import * as nodeMailer from "nodemailer";

let transporter: any;

export function init(DEV: boolean) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.error(
      "SMTP 설정값이 없습니다. EXPAND에서 제거하거나, 설정을 추가해주세요!"
    );
    process.exit();
  }

  transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD },
  });
}
export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!transporter) {
    throw Error("initialization이 안되어있습니다.");
  }
  const mailOptions = {
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
}
