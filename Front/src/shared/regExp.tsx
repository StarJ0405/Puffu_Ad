const SuperExpressive = require("super-expressive");

export const emailFormat = {
  exp: SuperExpressive()
    .startOfInput.caseInsensitive.oneOrMore.anyOf.range("a", "z")
    .range("A", "Z")
    .range("0", "9")
    .anyOfChars("._-")
    .end()
    // .oneOrMore.word
    .exactly(1)
    .char("@")
    .oneOrMore.word.exactly(1)
    .char(".")
    .between(2, 4)
    .range("a", "z")
    .endOfInput.toRegex(),
  description: "email format",
  sample: "yourEmail@xxxxx.xxx",
  feedback: "이메일형식이 아닙니다.",
};

export const mobileNoFormat = {
  exp: SuperExpressive()
    .startOfInput.exactly(1)
    .char("0")
    .exactly(1)
    .range(0, 9)
    .exactly(1)
    .char("0")
    .exactly(8)
    .range(0, 9)
    .endOfInput.toRegex(),
  description: "mobile number format",
  sample: "07012345678",
  feedback: "휴대폰번호형식이 아닙니다.",
};

export const passwordFormat = {
  exp: SuperExpressive()
    .atLeast(8)
    .anyOf.range("a", "z")
    .range("A", "Z")
    .range("0", "9")
    .anyOfChars("`~!@#$%^&*()-_=+,.<>/?[]{}|;:\\'\"")
    .end()
    .toRegex(),
  description: "password format",
  sample: "asd1231@",
  feedback: "올바른 비밀번호 형식이 아닙니다.",
};

export const birthday8Format = {
  exp: /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/,
  description: "YYYYMMDD birthday format",
  sampe: "20250813",
  feedback: "올바른 형식이 아닙니다.",
};
export const birthday6Format = {
  exp: /^\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/,
  description: "YYYYMMDD birthday format",
  sampe: "000813",
  feedback: "올바른 형식이 아닙니다.",
};

export const textFormat = {
  exp: SuperExpressive().startOfInput.caseInsensitive.oneOrMore.anyChar.endOfInput.toRegex(),
  description: "text format",
  sample: "빈칸 없어야 함",
  feedback: "빈칸이 없어야합니다.",
};

export const userNameFormat = {
  exp: /^[a-zA-Z@_\-]{3,30}$/,
  description:
    "Only English letters and @, -, _ are allowed (3 to 30 characters)",
  sample: "abc@-_",
  feedback: "",
};

export const englishFormat = {
  // exp: /[^a-zA-Z0-9\-\(\)\+\=\,\.\*\&\^\[\]\/_\s]/g,
  exp: /[^a-zA-Z0-9\s]/g,
  description: "Only Enlgish + Special Character",
  sampe: "abc(1+1)",
  feedback: "",
};

export const numberOnlyFormat = {
  exp: /[^0-9]/g,
  description: "Only Number",
  smaple: "1231",
  feedback: "",
};

export const numberFormat = {
  exp: /[^0-9.-]/g,
  description: "Number and -",
  smaple: "1231",
  feedback: "",
};

export const phoneFormat = {
  exp: /[^0-9+]/g,
  description: "Number and Plus",
  sample: "+12)34",
  feedback: "",
};

export const chinessPhoneFormat = {
  exp: /^\(\+86\)1\d{10}$/,
  description: "",
  smaple: "(+86)13012341234",
  feedback: "",
};
