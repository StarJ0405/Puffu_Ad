import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Tooltip from "@/components/tooltip/Tooltip";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ChromePicker } from "react-color";

const InputColor = forwardRef(
  (
    {
      id,
      type = "hex", // hex, hsl, hsv, rgb
      displayType = "text", // text, bar, box(square), sphere
      withText = false, // displayType이 text가 아닌 경우에만 적용, 이미지 옆에 텍스트 추가
      readOnly = false,
      value: props_value = "#000000",
      onChange: props_onChange,
      disabled,
      disableAlpha = true,
      zIndex,
    }: {
      id?: string;
      type?: "hex" | "hsl" | "hsv" | "rgb";
      displayType?: "text" | "bar" | "box" | "square" | "sphere";
      withText?: boolean;
      readOnly?: boolean;
      value?: any;
      onChange?: (value: any) => void;
      disabled?: boolean;
      disableAlpha?: boolean;
      zIndex?: number;
    },
    ref
  ) => {
    if (type === "hex") disableAlpha = true;
    const input = useRef<any>([]);
    const [value, setValue] = useState<{
      hex?: string;
      hsl?: { h?: number; s?: number; l?: number; a?: number };
      hsv?: { h?: number; s?: number; v?: number; a?: number };
      oldHue?: number;
      rgb?: { r?: number; g?: number; b?: number; a?: number };
    }>({
      hex: "#000000",
      hsl: { h: 0, s: 0, l: 0, a: 1 },
      hsv: { h: 0, s: 0, v: 0, a: 1 },
      oldHue: 0,
      rgb: { r: 0, g: 0, b: 0, a: 1 },
    });
    const [focusState, setFocusState] = useState(false);
    const timeoutRef = useRef<any>(null);
    const focusChange = (status: boolean) => {
      clearTimeout(timeoutRef.current);
      if (status && !disabled) setFocusState(true);
      else {
        timeoutRef.current = setTimeout(() => {
          setFocusState(false);
        }, 500);
      }
    };

    const onChange = (inputValue: any) => {
      setValue(inputValue);
      input.current.value = inputValue;
      if (props_onChange) {
        props_onChange(inputValue);
      }
    };
    useEffect(() => {
      if (props_value) {
        if (typeof props_value === "string") {
          const rgb = HEXtoRGB(props_value);
          const hsl = RGBtoHSL(rgb);
          const hsv = RGBtoHSV(rgb);
          setValue({ hex: props_value, rgb, hsl, hsv });
        } else if (typeof props_value === "object") {
          if (props_value.rgb) {
            const hsl = RGBtoHSL(props_value.rgb);
            const hsv = RGBtoHSV(props_value.rgb);
            const hex = RGBtoHEX(props_value.rgb);
            setValue({ rgb: props_value.rgb, hsl, hsv, hex });
          } else if (props_value.hex) {
            const rgb = HEXtoRGB(props_value.hex);
            const hsl = RGBtoHSL(rgb);
            const hsv = RGBtoHSV(rgb);
            setValue({ hex: props_value.hex, rgb, hsl, hsv });
          } else if (props_value.hsl) {
            const hsv = HSLtoHSV(props_value.hsl);
            const rgb = HSLtoRGB(props_value.hsl);
            const hex = RGBtoHEX(rgb);
            setValue({ hsl: props_value.hsl, hsv, rgb, hex });
          } else if (props_value.hsv) {
            const hsl = HSVtoHSL(props_value.hsv);
            const rgb = HSVtoRGB(props_value.hsv);
            const hex = RGBtoHEX(rgb);
            setValue({ hsv: props_value.hsv, hsl, rgb, hex });
          } else setValue(props_value);
        }
      }
    }, [props_value]);

    useImperativeHandle(ref, () => ({
      getId() {
        return id;
      },
      getValue() {
        return value?.[type];
      },
      getHex() {
        return value?.hex;
      },
      getRGB() {
        return value.rgb;
      },
      getHSL() {
        return value.hsl;
      },
      getHSV() {
        return value.hsv;
      },
      setValue(value: any, change_event = true) {
        if (value) {
          if (typeof props_value === "string") {
            const rgb = HEXtoRGB(props_value);
            const hsl = RGBtoHSL(rgb);
            const hsv = RGBtoHSV(rgb);
            value = { hex: props_value, rgb, hsl, hsv };
            setValue(value);
          } else {
            if (value.rgb) {
              const hsl = RGBtoHSL(value.rgb);
              const hsv = RGBtoHSV(value.rgb);
              const hex = RGBtoHEX(value.rgb);
              value = { rgb: value.rgb, hsl, hsv, hex };
            } else if (value.hex) {
              const rgb = HEXtoRGB(value.hex);
              const hsl = RGBtoHSL(rgb);
              const hsv = RGBtoHSV(rgb);
              value = { hex: value.hex, rgb, hsl, hsv };
            } else if (value.hsl) {
              const hsv = HSLtoHSV(value.hsl);
              const rgb = HSLtoRGB(value.hsl);
              const hex = RGBtoHEX(rgb);
              value = { hsl: value.hsl, hsv, rgb, hex };
            } else if (value.hsv) {
              const hsl = HSVtoHSL(value.hsv);
              const rgb = HSVtoRGB(value.hsv);
              const hex = RGBtoHEX(rgb);
              value = { hsv: value.hsv, hsl, rgb, hex };
            }
            setValue(value);
          }
          if (change_event) onChange(value);
        }
      },
      isValid() {
        return true;
      },
      empty() {
        setValue({ hex: "#000000" });
      },
    }));
    const Display = ({
      displayType,
      type,
      disableAlpha,
    }: {
      displayType: string;
      type: string;
      disableAlpha: boolean;
    }) => {
      switch (String(displayType).toLowerCase()) {
        case "bar":
          return (
            <div
              onClick={() => focusChange(true)}
              style={{
                border: "1px solid #dadada",
                padding: 5,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  height: 10,
                  width: 40,
                  backgroundColor: value?.hex ?? "#000000",
                }}
              ></div>
            </div>
          );
        case "sphere":
          return (
            <div
              onClick={() => focusChange(true)}
              style={{
                display: "flex",
                border: "1px solid #dadada",
                height: 40,
                width: 40,
                cursor: "pointer",
                borderRadius: "100%",
                backgroundColor: value?.hex ?? "#000000",
              }}
            />
          );
        case "square":
        case "box":
          return (
            <div
              onClick={() => focusChange(true)}
              style={{
                border: "1px solid #dadada",
                cursor: "pointer",
                height: 40,
                width: 40,
                backgroundColor: value?.hex ?? "#000000",
              }}
            />
          );
        case "textColor":
          return <></>;
        case "text":
          switch (String(type).toLowerCase()) {
            case "hex":
              return (
                <div
                  onClick={() => focusChange(true)}
                  style={{
                    border: "1px solid #dadada",
                    padding: "5px 12px",
                    cursor: "pointer",
                  }}
                >
                  <P>{value?.hex || "#000000"}</P>
                </div>
              );
            case "rgba":
            case "rgb":
              return (
                <div onClick={() => focusChange(true)}>
                  <HorizontalFlex gap={10}>
                    {["r", "g", "b"].map((rgb) => (
                      <FlexChild key={rgb} width={"max-content"}>
                        <VerticalFlex gap={3}>
                          <P border={"1px solid #dadada"} padding={"5px 12px"}>
                            {String((value?.rgb as any)?.[rgb] || 0).padStart(
                              3,
                              "0"
                            )}
                          </P>
                          <P color={"#dadada"}>{rgb.toUpperCase()}</P>
                        </VerticalFlex>
                      </FlexChild>
                    ))}
                    {!disableAlpha && (
                      <FlexChild width={"max-content"}>
                        <VerticalFlex gap={3}>
                          <P border={"1px solid #dadada"} padding={"5px 12px"}>
                            {Number(value?.rgb?.a || 0).toLocaleString("ko", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </P>
                          <P color={"#dadada"}>{"a".toUpperCase()}</P>
                        </VerticalFlex>
                      </FlexChild>
                    )}
                  </HorizontalFlex>
                </div>
              );
            case "hsla":
            case "hsl":
              return (
                <div onClick={() => focusChange(true)}>
                  <HorizontalFlex gap={10}>
                    <FlexChild>
                      <VerticalFlex gap={3}>
                        <P border={"1px solid #dadada"} padding={"5px 12px"}>
                          {String(Math.round(value?.hsl?.h || 0)).padStart(
                            3,
                            "0"
                          )}
                        </P>
                        <P color={"#dadada"}>{"h".toUpperCase()}</P>
                      </VerticalFlex>
                    </FlexChild>
                    {["s", "l"].map((hsl) => (
                      <FlexChild key={hsl}>
                        <VerticalFlex gap={3}>
                          <P border={"1px solid #dadada"} padding={"5px 12px"}>
                            {String(
                              Math.round(
                                ((value?.hsl as any)?.[hsl] || 0) * 100
                              )
                            ).padStart(2, "0")}
                            %
                          </P>
                          <P color={"#dadada"}>{hsl.toUpperCase()}</P>
                        </VerticalFlex>
                      </FlexChild>
                    ))}
                    {!disableAlpha && (
                      <FlexChild>
                        <VerticalFlex gap={3}>
                          <P border={"1px solid #dadada"} padding={"5px 12px"}>
                            {Number(value?.hsl?.a || 0).toLocaleString("ko", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </P>
                          <P color={"#dadada"}>{"a".toUpperCase()}</P>
                        </VerticalFlex>
                      </FlexChild>
                    )}
                  </HorizontalFlex>
                </div>
              );
            case "hsva":
            case "hsv":
              return (
                <div onClick={() => focusChange(true)}>
                  <HorizontalFlex gap={10}>
                    <FlexChild>
                      <VerticalFlex gap={3}>
                        <P border={"1px solid #dadada"} padding={"5px 12px"}>
                          {String(Math.round(value?.hsv?.h || 0)).padStart(
                            3,
                            "0"
                          )}
                        </P>
                        <P color={"#dadada"}>{"h".toUpperCase()}</P>
                      </VerticalFlex>
                    </FlexChild>
                    {["s", "v"].map((hsv) => (
                      <FlexChild key={hsv}>
                        <VerticalFlex gap={3}>
                          <P border={"1px solid #dadada"} padding={"5px 12px"}>
                            {String(
                              Math.round(
                                ((value?.hsv as any)?.[hsv] || 0) * 100
                              )
                            ).padStart(2, "0")}
                            %
                          </P>
                          <P color={"#dadada"}>{hsv.toUpperCase()}</P>
                        </VerticalFlex>
                      </FlexChild>
                    ))}
                    {!disableAlpha && (
                      <FlexChild>
                        <VerticalFlex gap={3}>
                          <P border={"1px solid #dadada"} padding={"5px 12px"}>
                            {Number(value?.hsv?.a || 0).toLocaleString("ko", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </P>
                          <P color={"#dadada"}>{"a".toUpperCase()}</P>
                        </VerticalFlex>
                      </FlexChild>
                    )}
                  </HorizontalFlex>
                </div>
              );
            default:
              break;
          }
          break;
        default:
          break;
      }
      return <P>unknown</P>;
    };
    return (
      <Tooltip
        zIndex={zIndex}
        disable={readOnly}
        hover={false}
        click={true}
        autoClose={false}
        position="top"
        content={
          <ChromePicker
            disableAlpha={disableAlpha}
            // color={String(value?.[type] ?? value)}
            color={value as any}
            onChange={(value) => {
              input.current.value = (value as any)?.[type];
              setValue(value);
              if (props_onChange) props_onChange(value);
              return value;
            }}
          />
        }
      >
        <HorizontalFlex id={id} cursor={"pointer"} gap={10}>
          <FlexChild width={"max-content"}>
            <Display
              displayType={displayType}
              type={type}
              disableAlpha={disableAlpha}
            />
          </FlexChild>
          {withText && displayType !== "text" && (
            <FlexChild width={"max-content"}>
              <Display
                displayType={"text"}
                type={type}
                disableAlpha={disableAlpha}
              />
            </FlexChild>
          )}
        </HorizontalFlex>
      </Tooltip>
    );
  }
);

export default InputColor;

export function HEXtoRGB(hex: string) {
  if (hex.startsWith("#")) hex = hex.slice(1);
  let r = 0;
  let g = 0;
  let b = 0;
  let a;
  if (
    !/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{4}$|^[0-9A-Fa-f]{6}$|^[0-9A-Fa-f]{8}$/.test(
      hex
    )
  ) {
    return { r, g, b };
  }
  if (hex.length === 3) {
    r = parseInt(hex?.[0] + hex?.[0], 16);
    g = parseInt(hex?.[1] + hex?.[1], 16);
    b = parseInt(hex?.[2] + hex?.[2], 16);
  } else if (hex.length == 4) {
    r = parseInt(hex?.[0] + hex?.[0], 16);
    g = parseInt(hex?.[1] + hex?.[1], 16);
    b = parseInt(hex?.[2] + hex?.[2], 16);
    a = parseInt(hex?.[3] + hex?.[3], 16) / 255;
  } else if (hex.length === 6) {
    r = parseInt(hex?.[0] + hex?.[1], 16);
    g = parseInt(hex?.[2] + hex?.[3], 16);
    b = parseInt(hex?.[4] + hex?.[5], 16);
  } else if (hex.length === 8) {
    r = parseInt(hex?.[0] + hex?.[1], 16);
    g = parseInt(hex?.[2] + hex?.[3], 16);
    b = parseInt(hex?.[4] + hex?.[5], 16);
    a = parseInt(hex?.[6] + hex?.[7], 16) / 255;
  }
  const data: { r: number; g: number; b: number; a?: number } = { r, g, b };
  if (typeof a !== "undefined") data.a = a;
  return data;
}
export function RGBtoHEX(rgb: { r: number; g: number; b: number; a?: number }) {
  let { r, g, b, a } = rgb;
  const toHex = (c: number) => {
    const hex = Math.round(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };
  let data = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

  if (typeof a !== "undefined") data += toHex(a * 255);
  return data;
}
export function RGBtoHSL(rgb: { r: number; g: number; b: number; a?: number }) {
  let { r, g, b, a } = rgb;
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  const data: { h: number; s: number; l: number; a?: number } = { h, s, l };
  if (typeof a !== "undefined") data.a = a;
  return data;
}

export function RGBtoHSV(rgb: { r: number; g: number; b: number; a?: number }) {
  let { r, g, b, a } = rgb;
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  let v = max; // Value는 RGB 중 가장 큰 값

  if (delta === 0) {
    h = 0; // 회색조 (색조 없음)
  } else if (max === r) {
    h = ((g - b) / delta) % 6;
  } else if (max === g) {
    h = (b - r) / delta + 2;
  } else {
    // max === b
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60); // Hue는 0-360도
  if (h < 0) h += 360; // 음수 값 방지

  s = max === 0 ? 0 : delta / max; // Saturation
  s = Math.round(s * 100); // Saturation은 0-100%

  v = Math.round(v * 100); // Value는 0-100%

  const data: { h: number; s: number; v: number; a?: number } = { h, s, v };
  if (typeof a !== "undefined") data.a = data.a;
  return data;
}

export function HSLtoHSV(hsl: { h: number; s: number; l: number; a?: number }) {
  let { h, s, l, a } = hsl;
  s /= 100;
  l /= 100;

  let s_hsv;
  let v;

  v = l + s * Math.min(l, 1 - l);
  if (v === 0) {
    s_hsv = 0;
  } else {
    s_hsv = (2 * (s * (1 - l))) / v;
  }
  s_hsv = Math.round(s_hsv * 100);
  v = Math.round(v * 100);
  const data: { h: number; s: number; v: number; a?: number } = {
    h,
    s: s_hsv,
    v,
  };
  if (typeof a !== "undefined") data.a = a;
  return data;
}

export function HSLtoRGB(hsl: { h: number; s: number; l: number; a?: number }) {
  let { h, s, l, a } = hsl;
  s /= 100;
  l /= 100;

  let r = 0;
  let g = 0;
  let b = 0;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h / 360 + 1 / 3);
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, h / 360 - 1 / 3);
  }
  const data: { r: number; g: number; b: number; a?: number } = {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
  if (typeof a !== "undefined") data.a = a;
  return data;
}

export function HSVtoHSL(hsv: { h: number; s: number; v: number; a?: number }) {
  let { h, s, v, a } = hsv;
  s /= 100;
  v /= 100;

  let s_hsl;
  let l;
  l = v * (1 - s / 2);
  if (l === 0 || l === 1) {
    s_hsl = 0;
  } else {
    s_hsl = (v - l) / Math.min(l, 1 - l);
  }
  s_hsl = Math.round(s_hsl * 100);
  l = Math.round(l * 100);

  const data: { h: number; s: number; l: number; a?: number } = {
    h,
    s: s_hsl,
    l,
  };
  if (typeof a !== "undefined") data.a = a;
  return data;
}

export function HSVtoRGB(hsv: { h: number; s: number; v: number; a?: number }) {
  let { h, s, v, a } = hsv;
  s /= 100;
  v /= 100;
  let r = 0;
  let g = 0;
  let b = 0;

  const i = Math.floor(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  const data: { r: number; g: number; b: number; a?: number } = {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
  if (typeof a !== "undefined") data.a = a;
  return data;
}
