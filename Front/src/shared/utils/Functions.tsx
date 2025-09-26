import i18n from "@/lang/i18n";
import { saveAs } from "file-saver";
import { RefObject } from "react";
import * as XLSX from "xlsx";

export const getCookieOption = ({
  maxAge,
  expires,
  encode,
  httpOnly,
  secure,
}: {
  maxAge?: number;
  expires?: Date | string;
  encode?: boolean;
  httpOnly?: boolean;
  secure?: boolean;
} = {}) => {
  let href = window.location.hostname.replace("www.", "");

  const domains = (process.env.NEXT_PUBLIC_MAIN_DOMAIN || "").split(",");

  if (domains.length > 0)
    domains.forEach((domain: string) => {
      if (href.endsWith(domain)) href = domain;
    });

  const data: any = { domain: href, path: "/" };
  if (maxAge) {
    data.maxAge = maxAge;
  } else if (expires) data.expires = new Date(expires);

  if (encode) data.encode = encode;
  if (httpOnly) data.httpOnly = httpOnly;
  if (secure) data.secure = secure;
  return data;
};

export const getTokenPayload = (token: string) => {
  try {
    var base64Payload = token.includes(".") ? token.split(".")[1] : token;
    var payload = decode(base64Payload);
    var result = JSON.parse(payload);
    return result;
  } catch (e) {
    return false;
  }
};
export const decode = (encoded: string) => {
  let decoded = Buffer.from(encoded, "base64").toString();
  return decoded;
};
export const encode = (payload: string) => {
  let encoded = Buffer.from(payload).toString("base64");
  return encoded;
};

export const dataToQuery = (data: any) => {
  return new URLSearchParams(
    Object.keys(data || {}).reduce((acc: any, key) => {
      acc[key] = Array.isArray(data[key])
        ? data[key]
        : typeof data[key] === "object"
        ? JSON.stringify(data[key])
        : data[key];
      return acc;
    }, {})
  ).toString();
};

export const toast = ({
  message,
  autoClose = 700,
  icon,
}: {
  message: string;
  autoClose?: number;
  icon?: string;
}) => {
  const NiceModal = require("@ebay/nice-modal-react");

  NiceModal.show("toast", {
    message: i18n.t(message),
    autoClose,
    icon,
  });
};

export const log = (...message: any[]) => {
  const dev = process.env.NEXT_PUBLIC_DEV;
  if (dev) console.log(...message);
};

export const copy = ({ text, message }: { text: string; message?: string }) => {
  const textArea = document.createElement("textarea");
  textArea.value = text || "";

  // Move textarea out of the viewport so it's not visible
  textArea.style.position = "absolute";
  textArea.style.left = "-999999px";

  document.body.prepend(textArea);
  textArea.select();

  try {
    document.execCommand("copy");
  } catch (error) {
    console.error(error);
  } finally {
    textArea.remove();
    if (message) toast({ message: message });
  }
};

export function getDeviceType(userAgent: string | null): DeviceType {
  if (!userAgent) return "unknown";

  userAgent = userAgent.toLowerCase(); // 대소문자 구분 없이 비교하기 위해 소문자로 변환

  const isAndroid = /android/.test(userAgent);
  const isiPad = /ipad/.test(userAgent);
  const isiPhone = /iphone/.test(userAgent);
  const isiPod = /ipod/.test(userAgent);
  const isBlackBerry = /blackberry/.test(userAgent);
  const isWindowsPhone = /windows phone/.test(userAgent);
  const isOperaMini = /opera mini/.test(userAgent);
  const isWebOS = /webos/.test(userAgent);
  const isKindle = /kindle/.test(userAgent); // 아마존 킨들

  // 태블릿 판별 (일반적인 모바일 키워드가 없으면서 태블릿 특유의 키워드가 있을 때)
  // 'android'이면서 'mobile' 키워드가 없으면 안드로이드 태블릿일 가능성이 높습니다.
  if (
    isiPad ||
    (isAndroid && !/mobile/.test(userAgent)) ||
    isKindle ||
    /tablet|playbook|silk/i.test(userAgent)
  ) {
    return "tablet";
  }

  // 모바일 판별
  if (
    isiPhone ||
    isiPod ||
    isAndroid ||
    isBlackBerry ||
    isWindowsPhone ||
    isOperaMini ||
    isWebOS
  ) {
    return "mobile";
  }

  // 위 조건에 해당하지 않으면 데스크톱으로 간주
  return "desktop";
}

export function getOperatingSystem(userAgent: string | null): OSType {
  if (!userAgent) return "unknown";

  userAgent = userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "ios";
  }
  if (/android/.test(userAgent)) {
    return "android";
  }
  if (
    /windows phone|windows ce|windows mobile/.test(userAgent) ||
    /windows nt/.test(userAgent)
  ) {
    return "windows";
  }
  if (/macintosh|mac os x/.test(userAgent)) {
    return "macos";
  }
  if (/linux/.test(userAgent)) {
    // Android도 Linux 기반이지만, 위에서 먼저 처리되었으므로 여기는 주로 데스크톱 Linux
    return "linux";
  }

  return "unknown";
}

export function getWebView(userAgent: string | null): boolean {
  if (!userAgent) return false;

  return /webview/.test(userAgent);
}

export function dateToString(
  date: Date | string,
  withTime?: boolean,
  withSeconds?: boolean
) {
  if (!(date instanceof Date)) date = new Date(date);
  return (
    `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일` +
    (withTime ? ` ${date.getHours()}시 ${date.getMinutes()}분` : "") +
    (withSeconds ? ` ${date.getSeconds()}초` : "")
  );
}

export const validateInputs = async (
  inputs: RefObject<any>[]
): Promise<{ isValid: boolean; index: number }> => {
  return new Promise(async (resolve, reject) => {
    let result = false;
    let index = 0;

    const validationPromises = inputs.map((input: any, i) => {
      index = i;
      const validateFn = input.isValid;
      const isAsyncFn = validateFn.constructor.name === "AsyncFunction";

      if (isAsyncFn) {
        return validateFn().then((validationResult: boolean) => ({
          isValid: validationResult,
          input,
          index: i,
        }));
      } else {
        const isValid = validateFn();
        return Promise.resolve({ isValid, input, index: i });
      }
    });

    try {
      const results = await Promise.all(validationPromises);

      result = results.every((res) => res.isValid);

      const invalidInput = results.find((res) => !res.isValid);
      if (invalidInput) {
        invalidInput?.input?.focus?.();
      }

      resolve({ isValid: result, index: invalidInput?.index ?? 0 });
    } catch (err) {
      reject(err);
    }
  });
};

export const scrollTo = (id: string, message: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  toast({ message });
  return false;
};

export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;
  let timeoutId: NodeJS.Timeout | null = null;

  return function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ): ReturnType<T> {
    const context = this;
    if (!inThrottle) {
      inThrottle = true;
      timeoutId = setTimeout(() => {
        inThrottle = false;
        timeoutId = null;
      }, limit);
      lastResult = func.apply(context, args) as ReturnType<T>;
    }
    return lastResult;
  };
};

export const getShippingType = (method: ShippingMethodData) => {
  switch (method.type) {
    case "default":
      return "기본 배송";
    case "refund":
      return "환불 배송";
    case "exchange":
      return "교환 배송";
  }
  return "알 수 없음";
};
export const getOrderStatus = (order: OrderData) => {
  switch (order.status) {
    case "pending":
      return "상품준비중";
    case "fulfilled":
      return "배송대기중";
    case "shipping":
      return "배송중";
    case "complete":
      return "배송완료";
    case "cancel":
      return "취소";
  }
  return "알 수 없음";
};

export const readExcelFile = (
  file: File,
  header: ExcelReadableColumn[]
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const processedData = jsonData.map((row: any) => {
        const data = header?.reduce((acc, head) => {
          acc[head.attr] = row[head.code];
          return acc;
        }, {} as any);
        return data;
      });

      resolve(processedData);
    };

    reader.onerror = reject;

    reader.readAsBinaryString(file);
  });
};
export const downloadExcelFile = async (
  list: any[] = [],
  fileName: string | undefined = undefined,
  empty: any[] = [],
  header: ExcelWritableColumn[] = [],
  style: { common?: any; col?: any; header?: any } = {},
  onSuccess = (_list: any[]) => {},
  extraSheet: ExcelSheet[] = []
) => {
  extraSheet = extraSheet
    ? Array.isArray(extraSheet)
      ? extraSheet
      : [extraSheet]
    : [];
  const pattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  const _ = require("lodash");
  const calcWidth = (text: string) =>
    ([...`${text}`]?.reduce(
      (pre, acc) => pre + (pattern.test(acc) ? 17.5 : 10),
      0
    ) +
      11) /
      1.15 || 0;
  let array: any[] = [];
  let wpx = header.map((headerCol) => ({
    wpx: headerCol?.wpx || calcWidth(headerCol.text),
  }));

  list.forEach((row, index) => {
    let obj: any = {};
    header.forEach((headerCol, ColIndex) => {
      let value;
      if (headerCol.Cell) {
        value = headerCol.Cell({
          row: row,
          cell: row?.[headerCol?.code || ""],
          index: index,
        });
      } else {
        value =
          row?.[headerCol?.code || ""] !== undefined
            ? row?.[headerCol?.code || ""]
            : "";
      }
      obj[headerCol.text] = _.merge(
        {
          ...(String(value).includes("=")
            ? { f: value.replace("=", "") }
            : { v: value }),
          s: _.merge(
            {},
            style?.common,
            style?.col,
            headerCol?.style?.common,
            headerCol?.style?.col
          ),
        },
        typeof value === "number" ? { t: "n" } : {}
      );
      wpx[ColIndex] = {
        wpx:
          headerCol?.wpx ||
          Math.max(wpx?.[ColIndex]?.wpx || 0, calcWidth(value)),
      };
    });
    array.push(obj);
  });
  const head: any = {};
  header.forEach(
    (headerCol) =>
      (head[headerCol.text] = {
        v: headerCol.text,
        s: _.merge(
          {},
          style?.common,
          style?.header,
          headerCol?.style?.common,
          headerCol?.style?.header
        ),
      })
  );
  const worksheet = XLSX.utils.json_to_sheet([...empty, head, ...array], {
    skipHeader: true,
  });
  // 너비 적용
  worksheet["!cols"] = wpx;
  // 헤더 스타일 적용
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  try {
    extraSheet?.forEach((sheet) => {
      const name = sheet?.name || String(new Date().getTime()); // 추가시트 이름
      const list = sheet?.list || []; // 추가 데이터 목록
      const empty = sheet?.empty || []; // 상단 추가용
      const header = sheet?.header || []; // header용
      const pattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
      const _ = require("lodash");
      const calcWidth = (text: string) =>
        ([...`${text}`]?.reduce(
          (pre, acc) => pre + (pattern.test(acc) ? 17.5 : 10),
          0
        ) +
          11) /
          1.15 || 0;
      let array: any[] = [];
      let wpx = header.map((headerCol) => ({
        wpx: headerCol?.wpx || calcWidth(headerCol.text),
      }));

      list.forEach((row, index) => {
        let obj: any = {};
        header.forEach((headerCol, ColIndex) => {
          let value;
          if (headerCol.Cell) {
            value = headerCol.Cell({
              row: row,
              cell: row?.[headerCol?.code || ""],
              index: index,
            });
          } else {
            value =
              row?.[headerCol?.code || ""] !== undefined
                ? row[headerCol?.code || ""]
                : "";
          }
          obj[headerCol.text] = _.merge(
            {
              ...(String(value).includes("=")
                ? { f: value.replace("=", "") }
                : { v: value }),
              s: _.merge(
                {},
                style?.common,
                style?.col,
                headerCol?.style?.common,
                headerCol?.style?.col
              ),
            },
            typeof value === "number" ? { t: "n" } : {}
          );
          wpx[ColIndex] = {
            wpx:
              headerCol?.wpx ||
              Math.max(wpx?.[ColIndex]?.wpx || 0, calcWidth(value)),
          };
        });
        array.push(obj);
      });
      const head: any = {};
      header.forEach(
        (headerCol) =>
          (head[headerCol.text] = {
            v: headerCol.text,
            s: _.merge(
              {},
              style?.common,
              style?.header,
              headerCol?.style?.common,
              headerCol?.style?.header
            ),
          })
      );
      const worksheet = XLSX.utils.json_to_sheet([...empty, head, ...array], {
        skipHeader: true,
      });
      XLSX.utils.book_append_sheet(workbook, worksheet, name);
    });
  } catch (err) {
    log("추가 시트 생성중 오류 발생 : ", err);
  }
  // XLSXStyle.apply_style(workbook, worksheet);
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

  // 이진 데이터를 Blob으로 변환하는 함수입니다.
  function s2ab(s: any) {
    const buffer = new ArrayBuffer(s.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buffer;
  }

  // Blob을 이용하여 사용자가 파일을 다운로드 할 수 있게 합니다.
  await saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    `${fileName}.xlsx`
  );

  if (onSuccess.constructor.name === "Function") onSuccess?.(list);
  else await onSuccess?.(list);
};

export const delay = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function openTrackingNumber(
  tracking_number: string,
  options?: {
    width?: React.CSSProperties["width"];
    height?: React.CSSProperties["height"];
  }
) {
  const trackingUrl = `https://trace.cjlogistics.com/next/tracking.html?wblNo=${tracking_number.replaceAll(
    "-",
    ""
  )}`;

  const width = options?.width || 800;
  const height = options?.height || 800;
  // 팝업창 옵션 설정
  const popupOptions = `width=${width},height=${height},scrollbars=yes,resizable=yes`;

  // 팝업창 열기
  window.open(trackingUrl, "ShippingStatusPopup", popupOptions);
}

export function isSame(v1: any, v2: any): boolean {
  if (typeof v1 === typeof v2) {
    switch (typeof v1) {
      case "string":
      case "number":
      case "bigint":
      case "boolean":
        return v1 === v2;
      case "object":
        return JSON.stringify(v1) === JSON.stringify(v2);
      default:
        return v1 === v2;
    }
  }
  return false;
}

//이메일 마스킹 앞네자리보이고 뒷자린 "*" 표시
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;

  if (local.length <= 4) {
    return "*".repeat(local.length) + "@" + domain;
  }

  return local.slice(0, 4) + "*".repeat(local.length - 4) + "@" + domain;
}
export function getQAType(qa: any) {
  switch (qa.type) {
    case "refund":
      return "환불문의";
    case "exchange":
      return "교환문의";
    default: {
      if (qa.product_id) return "상품문의";
      else if (qa.order_id를) return "주문/결제/배송 문의";
      else return "기타 문의";
    }
  }
}

export function maskPhone(phone: string): string {
  // 배송지 관리등에서 휴대폰 가운데 자리 *처리
  return phone.replace(/(\d{3})-?(\d{4})-?(\d{4})/, "$1-****-$3");
}

export function getItemStatus(order: OrderData, item: LineItemData) {
  switch (order.status) {
    case "pending":
      return "상품준비중";
    case "fulfilled":
      return "배송대기";
    case "shipping":
      return "배송중";
    case "complete":
      return "배송완료";
    case "cancel":
      return "주문취소";
    default:
      return "오류";
  }
}


export function maskTwoThirds(name: string): string {
  if (!name) return "";
  const Seg = (Intl as any).Segmenter as
    | (new (locales?: string | string[], options?: { granularity?: "grapheme" | "word" | "sentence" }) => any)
    | undefined;

  const units: string[] = Seg
    ? Array.from(new Seg("ko", { granularity: "grapheme" }).segment(name), (x: any) => x.segment)
    : Array.from(name);

  const n = units.length;
  const visible = Math.max(1, Math.ceil(n / 3));
  return units.slice(0, visible).join("") + "*".repeat(n - visible);
}