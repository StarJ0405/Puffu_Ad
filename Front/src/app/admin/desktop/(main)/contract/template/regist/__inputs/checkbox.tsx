"use client";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputNumber from "@/components/inputs/InputNumber";
import InputTextArea from "@/components/inputs/InputTextArea";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import { uuid } from "@/shared/utils/Functions";
import _ from "lodash";
import {
  CSSProperties,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ContractInput from "../class";
import { useHotkeys } from "react-hotkeys-hook";

const key: string = "checkbox";
export default class CheckboxInput extends ContractInput {
  constructor() {
    super({
      key: key,
      icon: ({ size }) => (
        <Icon src="contract/" name="checkbox" type="svg" size={size} />
      ),
      title: "체크 그룹",
      width: 60,
      height: 60,
    });
  }

  public Float = forwardRef(
    (
      props: {
        name?: string;
        onChange?: (data: any) => void;
        data?: any;
      },
      ref: any
    ) => {
      const [boxes, setBoxes] = useState<any[]>(props?.data?.boxes || []);
      const [select, setSelect] = useState<string>("");
      useHotkeys(
        "delete",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!select) return;
          const newBoxes = boxes.filter((b) => b.id !== select);
          props.data.boxes = newBoxes;
          setBoxes([...newBoxes]);
          props.onChange?.({ __sync: true });
          setSelect("");
        },
        {},
        [select, boxes]
      );

      const BoxCompnent = ({
        box,
        selected,
        onClick,
        onUpdate,
      }: {
        box: any;
        selected: boolean;
        onClick: (name: string) => void;
        onUpdate: ({
          top,
          left,
          width,
          height,
        }: {
          top: number;
          left: number;
          width: number;
          height: number;
        }) => void;
      }) => {
        const _ref = useRef<any>(null);
        const posRef = useRef<any>({});
        const [select, setSelect] = useState<any>(null);
        const [data, setData] = useState<any>({ dx: 0, dy: 0, dt: 0, dl: 0 });
        const [move, setMove] = useState(false);
        const list: {
          top: CSSProperties["top"];
          left: CSSProperties["left"];
          curosr: CSSProperties["cursor"];
          transform: CSSProperties["transform"];
          onMouseMove?: (e: MouseEvent) => void;
        }[] = [
          {
            top: 0,
            left: 0,
            curosr: "nw-resize",
            transform: "translate(-50%,-50%)",
            onMouseMove: (e) => {
              const dx = posRef.current.x - e.clientX;
              const dy = posRef.current.y - e.clientY;
              setData({ dx, dy, dt: dy, dl: dx });
            },
          },
          {
            top: 0,
            left: "50%",
            curosr: "n-resize",
            transform: "translate(-50%,-50%)",
            onMouseMove: (e) => {
              const dy = posRef.current.y - e.clientY;
              setData({ dx: 0, dy, dt: dy, dl: 0 });
            },
          },
          {
            top: 0,
            left: "100%",
            curosr: "ne-resize",
            transform: "translate(-50%,-50%)",
            onMouseMove: (e) => {
              const dx = e.clientX - posRef.current.x;
              const dy = posRef.current.y - e.clientY;
              setData({ dx, dy, dt: dy, dl: 0 });
            },
          },
          {
            top: "50%",
            left: "100%",
            curosr: "e-resize",
            transform: "translate(-50%,-50%)",
            onMouseMove: (e) => {
              const dx = e.clientX - posRef.current.x;
              setData({ dx, dy: 0, dt: 0, dl: 0 });
            },
          },
          {
            top: "100%",
            left: "100%",
            curosr: "se-resize",
            transform: "translate(-50%,-50%)",
            onMouseMove: (e) => {
              const dx = e.clientX - posRef.current.x;
              const dy = e.clientY - posRef.current.y;
              setData({ dx, dy, dt: 0, dl: 0 });
            },
          },
          {
            top: "100%",
            left: "50%",
            curosr: "s-resize",
            transform: "translate(-50%,-50%)",
            onMouseMove: (e) => {
              const dy = e.clientY - posRef.current.y;
              setData({ dx: 0, dy, dt: 0, dl: 0 });
            },
          },
          {
            top: "100%",
            left: "0%",
            curosr: "sw-resize",
            transform: "translate(-50%,-50%)",
            onMouseMove: (e) => {
              const dx = posRef.current.x - e.clientX;
              const dy = e.clientY - posRef.current.y;
              setData({ dx, dy, dt: 0, dl: dx });
            },
          },
          {
            top: "50%",
            left: "0%",
            curosr: "w-resize",
            transform: "translate(-50%,-50%)",
            onMouseMove: (e) => {
              const dx = posRef.current.x - e.clientX;
              setData({ dx, dy: 0, dt: 0, dl: dx });
            },
          },
        ];
        useEffect(() => {
          if (props.data?.__sync) return;
          setBoxes([...props.data.boxes]);
        }, [props.data?.boxes]);

        useEffect(() => {
          if (select) {
            window.addEventListener("mousemove", select.onMouseMove);
            const handleMouseUp = (e: any) => {
              e.stopPropagation();
              e.preventDefault();
              setSelect(null);
              posRef.current = {};
              const div = _ref.current as HTMLElement;
              const computed = div.computedStyleMap();
              onUpdate({
                top: (computed.get("top") as any)?.value,
                left: (computed.get("left") as any)?.value,
                width: box.width + data.dx,
                height: box.height + data.dy,
              });
              setData({ dx: 0, dy: 0, dt: 0, dl: 0 });
            };
            window.addEventListener("mouseup", handleMouseUp);
            return () => {
              window.removeEventListener("mousemove", select.onMouseMove);
              window.removeEventListener("mouseup", handleMouseUp);
            };
          }
        }, [select, data]);
        useEffect(() => {
          if (move) {
            const handleMouseUp = (e: MouseEvent) => {
              e.stopPropagation();
              e.preventDefault();
              setMove(false);
              const div = _ref.current as HTMLElement;
              const computed = div.computedStyleMap();

              let top = computed.get("top") as any;
              // const bottom = top.value + div.getBoundingClientRect().height;

              if (top.value < 0) {
                top.value = 0;
              } else if (
                top.value >
                (div.parentNode as HTMLElement).getBoundingClientRect().height +
                  12
              ) {
                top.value =
                  (div.parentNode as HTMLElement).getBoundingClientRect()
                    .height - div.getBoundingClientRect().height;
              }
              let left = computed.get("left") as any;
              const maxWidth: number = (
                div.parentNode as HTMLElement
              ).getBoundingClientRect().width;
              const right = left.value + div.getBoundingClientRect().width;
              if (left.value < 0) left.value = 0;
              else if (right > maxWidth) {
                left.value = maxWidth - div.getBoundingClientRect().width;
              }
              onUpdate({
                top: top?.value,
                left: left?.value,
                width: box.width + data.dx,
                height: box.height + data.dy,
              });
              posRef.current = { x: 0, y: 0 };
              setData({ dx: 0, dy: 0, dt: 0, dl: 0 });
            };
            const handleMouseMove = (e: MouseEvent) => {
              let dx = posRef.current.x - e.clientX;
              const dy = posRef.current.y - e.clientY;
              setData({ dx: 0, dy: 0, dt: dy, dl: dx });
            };
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("mousemove", handleMouseMove);
            return () => {
              window.removeEventListener("mouseup", handleMouseUp);
              window.removeEventListener("mousemove", handleMouseMove);
            };
          }
        }, [move]);
        return (
          <FlexChild
            Ref={_ref}
            position="absolute"
            width={box.width + data.dx}
            height={box.height + data.dy}
            top={box.y - data.dt}
            left={box.x - data.dl}
            border={"1px solid green"}
            cursor={selected ? "move" : "pointer"}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClick(box.id);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!selected) return;
              setMove(true);
              posRef.current = {
                x: e.clientX,
                y: e.clientY,
              };
            }}
          >
            <FlexChild padding={6} position="relative" justifyContent="center">
              <input
                id={`${props?.name}_${box.id}`}
                type="checkbox"
                name={props?.name}
                value={box.value}
                hidden
              />
              <Image
                src={
                  box?.disabled
                    ? props?.data?.style?.disabled
                    : box?.checked
                    ? props?.data?.style?.on
                    : props?.data?.style?.off
                }
                width={"100%"}
                height={"100%"}
              />
              <FlexChild
                hidden={!selected}
                position="absolute"
                width={box.width + data.dx}
                height={box.height + data.dy}
                border={"1px solid blue"}
              >
                <FlexChild position="relative" height={"100%"}>
                  {list.map((l, index) => (
                    <Div
                      key={index}
                      width={10}
                      height={10}
                      border={"1px solid blue"}
                      backgroundColor="#fff"
                      position="absolute"
                      top={l.top}
                      left={l.left}
                      transform={l.transform}
                      cursor={l.curosr}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSelect(l);
                        posRef.current = {
                          x: e.clientX,
                          y: e.clientY,
                        };
                      }}
                    />
                  ))}
                  <Div
                    width={20}
                    height={20}
                    position="absolute"
                    zIndex={1}
                    top={"50%"}
                    left={"150%"}
                    transform="translate(-50%,-50%)"
                    cursor="pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const div = _ref.current as HTMLElement;
                      const computed = div.computedStyleMap();
                      const width = div.getBoundingClientRect().width;
                      const height = div.getBoundingClientRect().height;
                      let top = computed.get("top") as any;
                      let left = computed.get("left") as any;
                      left.value = left.value + width;
                      const right =
                        left.value + div.getBoundingClientRect().width;
                      if (
                        right >
                        (div.parentNode as HTMLElement).getBoundingClientRect()
                          .width
                      ) {
                        left.value =
                          (
                            div.parentElement as HTMLElement
                          ).getBoundingClientRect().width - width;
                      }
                      let number = 1;
                      while (true) {
                        if (!boxes.some((box) => box.value === `체크${number}`))
                          break;
                        else number++;
                      }

                      const _boxes = [
                        ...boxes,
                        {
                          id: uuid(),
                          disabled: false,
                          checked: false,
                          text: "",
                          value: `체크${number}`,
                          x: left.value,
                          y: top.value,
                          width,
                          height,
                        },
                      ];
                      setBoxes(_boxes);
                      props.onChange?.({ boxes: _boxes });
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <Icon src="contract/" name="add-circle" type="svg" />
                  </Div>
                  <Div
                    width={20}
                    height={20}
                    position="absolute"
                    zIndex={1}
                    top={"150%"}
                    left={"50%"}
                    transform="translate(-50%,-50%)"
                    cursor="pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const div = _ref.current as HTMLElement;
                      const computed = div.computedStyleMap();
                      const width = div.getBoundingClientRect().width;
                      const height = div.getBoundingClientRect().height;
                      let top = computed.get("top") as any;
                      top.value = top.value + height;
                      const bottom =
                        top.value + div.getBoundingClientRect().height;
                      if (
                        bottom >
                        (div.parentNode as HTMLElement).getBoundingClientRect()
                          .height
                      ) {
                        top.value =
                          (
                            div.parentNode as HTMLElement
                          ).getBoundingClientRect().height - height;
                      }

                      let left = computed.get("left") as any;

                      let number = 1;
                      while (true) {
                        if (!boxes.some((box) => box.value === `체크${number}`))
                          break;
                        else number++;
                      }

                      const _boxes = [
                        ...boxes,
                        {
                          id: uuid(),
                          disabled: false,
                          checked: false,
                          text: "",
                          value: `체크${number}`,
                          x: left.value,
                          y: top.value,
                          width,
                          height,
                        },
                      ];
                      setBoxes(_boxes);
                      props.onChange?.({ boxes: _boxes });
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <Icon src="contract/" name="add-circle" type="svg" />
                  </Div>
                </FlexChild>
              </FlexChild>
            </FlexChild>
          </FlexChild>
        );
      };
      useEffect(() => {
        if (select) {
          const handelCancel = (e: MouseEvent) => {
            const extra = document.getElementById(`extra_${props.name}`);
            if (extra?.contains(e.target as HTMLElement)) {
              return;
            } else setSelect("");
          };
          window.addEventListener("mousedown", handelCancel);
          return () => window.removeEventListener("mousedown", handelCancel);
        }
      }, [select]);
      return (
        <FlexChild
          id={`extra_${props.name}`}
          padding={5}
          height={"100%"}
          width={"100%"}
          onMouseDown={() => setSelect("")}
        >
          <FlexChild position="relative" height={"100%"} width={"100%"}>
            {boxes.map((box, index) => (
              <BoxCompnent
                key={box.id}
                box={box}
                selected={select === box.id}
                onClick={(id) => setSelect(id)}
                onUpdate={({ top, left, width, height }) => {
                  boxes[index] = _.merge(boxes[index] || {}, {
                    y: top,
                    x: left,
                    width,
                    height,
                  });
                  setBoxes([...boxes]);
                  props.onChange?.({
                    boxes,
                  });
                }}
              />
            ))}
          </FlexChild>
        </FlexChild>
      );
    }
  );

  public isValid(data: any, value: any): boolean {
    return data?.min <= value?.boxes?.filter((box: any) => box.checked).length;
  }
  public Write = forwardRef(
    (
      props: {
        value?: any;
        data?: any;
        onChange?: (data: any) => void;
        name?: string;
        width: number;
        height: number;
      },
      ref: any
    ) => {
      const boxes = props.value?.boxes || props?.data?.boxes || [];
      const BoxCompnent = ({ box, boxes }: { box: any; boxes: any[] }) => {
        return (
          <FlexChild
            position="absolute"
            width={box.width}
            height={box.height}
            top={box.y}
            left={box.x}
            border={"1px solid transparent"}
            cursor="pointer"
          >
            <FlexChild padding={6} position="relative" justifyContent="center">
              <input
                id={`${props?.name}_${box.id}`}
                type="checkbox"
                name={props?.name}
                value={box.value}
                hidden
              />
              <Image
                src={
                  box?.disabled
                    ? props?.data?.style?.disabled
                    : box?.checked
                    ? props?.data?.style?.on
                    : props?.data?.style?.off
                }
                width={"100%"}
                height={"100%"}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  if (
                    !box.disabled &&
                    (boxes.filter((f) => f.checked).length < props.data.max ||
                      boxes.some((f) => f.value === box.value && f.checked))
                  ) {
                    box.checked = !box.checked;
                    props?.onChange?.({
                      boxes,
                    });
                  }
                }}
              />
            </FlexChild>
          </FlexChild>
        );
      };

      return (
        <FlexChild padding={5} height={"100%"} width={"100%"}>
          <FlexChild position="relative" height={"100%"} width={"100%"}>
            {boxes.map((box: any, index: number) => (
              <BoxCompnent key={box.id} box={box} boxes={boxes} />
            ))}
          </FlexChild>
        </FlexChild>
      );
    }
  );
  public initData() {
    return {
      style: {
        disabled: "/resources/contract/checkbox_disabled1.png",
        on: "/resources/contract/checkbox_on1.png",
        off: "/resources/contract/checkbox_off1.png",
      },
      boxes: [
        {
          id: uuid(),
          disabled: false,
          checked: false,
          value: "체크1",
          x: 0,
          y: 0,
          width: 18 + 6 * 2,
          height: 18 + 6 * 2,
        },
      ],
    };
  }
  public Setting = forwardRef(
    (
      {
        name: pre_name,
        users,
        data = {},
      }: { name: string; users: ContractUserDataFrame[]; data: any },
      ref
    ) => {
      const [name, setName] = useState<string>(pre_name || "");
      const [assign, setAssign] = useState<string[]>([]);
      const [require, setRequire] = useState<string[]>([]);
      const [loaded, setLoaded] = useState<boolean>(false);
      const [tooltip, setTooltip] = useState<string>(data?.tooltip || "");
      const [boxes, setBoxes] = useState<any[]>(data?.boxes || []);
      const [min, setMin] = useState<number>(data?.min || 0);
      const [max, setMax] = useState<number>(data?.max || 100);
      const [style, setStyle] = useState<any>(data?.style);
      useEffect(() => {
        if (data?.assign) {
          data?.assign?.forEach?.((assign: string) =>
            document.getElementById(`${assign}_assign`)?.click()
          );
        }
        if (data?.require) {
          data?.require?.forEach?.((require: string) =>
            document.getElementById(`${require}_require`)?.click()
          );
        }
        if (data?.icon) {
          document.getElementById("icon")?.click();
        }

        setLoaded(true);
      }, []);
      useImperativeHandle(ref, () => ({
        getValue() {
          return {
            data: {
              assign: assign.map((ass) => ass.replace("_assign", "")),
              require: require.map((req) => req.replace("_require", "")),
              tooltip,
              min,
              max,
              boxes,
            },
            name,
          };
        },
        isValid() {
          return !!name;
        },
      }));
      return (
        <FlexChild>
          <HorizontalFlex alignItems="stretch">
            <FlexChild
              borderRight={"1px solid #d0d0d0"}
              paddingRight={6}
              marginRight={6}
              height={"100%"}
            >
              <VerticalFlex width={400} padding={"0 20px"}>
                <FlexChild padding={"12px 0"}>
                  <P fontSize={20} fontWeight={700}>
                    ID
                  </P>
                </FlexChild>
                <FlexChild>
                  <Input
                    width={"100%"}
                    style={{ padding: "6px 12px" }}
                    value={name}
                    onChange={(value) => setName(value as string)}
                  />
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    작성권한
                  </P>
                </FlexChild>
                <FlexChild>
                  <HorizontalFlex>
                    <FlexChild>
                      <VerticalFlex gap={6}>
                        <FlexChild />
                        {users.map((user) => (
                          <FlexChild key={user.name}>
                            <P fontSize={14}>{user.name}</P>
                          </FlexChild>
                        ))}
                      </VerticalFlex>
                    </FlexChild>
                    <FlexChild width={60}>
                      <CheckboxGroup
                        name="assign"
                        onChange={(values) => {
                          const removed = assign.filter(
                            (f) => !values.includes(f)
                          );
                          require
                            .filter((f) =>
                              removed.some((r) =>
                                r.startsWith(f.replace("_require", ""))
                              )
                            )
                            .forEach((req) =>
                              document.getElementById(req)?.click()
                            );
                          setAssign(values);
                        }}
                      >
                        <VerticalFlex gap={6}>
                          <P fontSize={14}>할당 대상</P>
                          {users.map((user) => (
                            <CheckboxChild
                              size={14}
                              width={14}
                              height={14}
                              key={user.name}
                              id={`${user.name}_assign`}
                            />
                          ))}
                        </VerticalFlex>
                      </CheckboxGroup>
                    </FlexChild>
                    <FlexChild width={60}>
                      <CheckboxGroup
                        name="require"
                        onChange={(values) => {
                          setRequire(values);
                          if (values.length > 0) {
                            setMin(1);
                            if (max < 1) setMax(1);
                          } else {
                            setMin(0);
                          }
                        }}
                      >
                        <VerticalFlex gap={6}>
                          <P fontSize={14}>필수</P>
                          {users.map((user) => (
                            <CheckboxChild
                              size={14}
                              width={14}
                              height={14}
                              disabled={
                                loaded &&
                                !assign.some((f) => f.startsWith(user.name))
                              }
                              key={user.name}
                              id={`${user.name}_require`}
                            />
                          ))}
                        </VerticalFlex>
                      </CheckboxGroup>
                    </FlexChild>
                  </HorizontalFlex>
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    툴팁 텍스트
                  </P>
                </FlexChild>
                <FlexChild>
                  <InputTextArea
                    width={"100%"}
                    onChange={(value) => setTooltip(value)}
                    value={data.tooltip}
                  />
                </FlexChild>
              </VerticalFlex>
            </FlexChild>
            <FlexChild height={"100%"}>
              <VerticalFlex width={400} padding={"0 20px"}>
                <FlexChild padding={"12px 0"}>
                  <P fontSize={20} fontWeight={700}>
                    아이템 리스트
                  </P>
                </FlexChild>
                <FlexChild>
                  <CheckboxGroup
                    name="boxes"
                    values={boxes
                      .filter((box) => box.checked)
                      .map((box) => box.value)}
                    initialValues={boxes
                      .filter((box) => box.checked)
                      .map((box) => box.value)}
                  >
                    <HorizontalFlex alignItems="stretch">
                      {[
                        {
                          label: "선택",
                          Display: ({
                            box,
                            index,
                          }: {
                            box: any;
                            index: number;
                          }) => (
                            <FlexChild
                              border={"1px solid #d0d0d0"}
                              padding={6}
                              height={"100%"}
                              justifyContent="center"
                            >
                              <CheckboxChild
                                id={box.value}
                                onChange={(e) => {
                                  boxes[index].checked = !e.target.checked;
                                  setBoxes([...boxes]);
                                }}
                              />
                            </FlexChild>
                          ),
                          width: "30%",
                        },
                        {
                          label: "값",
                          Display: ({
                            box,
                            index,
                          }: {
                            box: any;
                            index: number;
                          }) => (
                            <FlexChild
                              padding={6}
                              height={"100%"}
                              border={"1px solid #d0d0d0"}
                              position="relative"
                            >
                              <Input
                                width={"inherit"}
                                value={box.value}
                                style={{
                                  padding: 0,
                                  outline: "none",
                                  border: "none",
                                }}
                                onChange={(value) => {
                                  boxes[index].value = value;
                                  setBoxes(boxes);
                                }}
                              />

                              {/* 삭제 버튼 */}
                              <Div
                                width={16}
                                height={16}
                                position="absolute"
                                right={4}
                                top={"50%"}
                                transform="translateY(-50%)"
                                cursor="pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  const newList = boxes.filter(
                                    (_, i) => i !== index
                                  );
                                  setBoxes([...newList]);
                                }}
                              >
                                <Icon src="contract/" name="close" type="svg" />
                              </Div>
                            </FlexChild>
                          ),
                          width: "70%",
                        },
                      ].map((str) => (
                        <FlexChild
                          key={str.label}
                          width={str?.width}
                          minWidth={str?.width}
                        >
                          <VerticalFlex
                            height={"100%"}
                            justifyContent="stretch"
                          >
                            <FlexChild
                              padding={6}
                              backgroundColor={"#f1f1f166"}
                              color="#666"
                              border={"1px solid #d0d0d0"}
                              borderBottom={"none"}
                              justifyContent="center"
                            >
                              <P>{str.label}</P>
                            </FlexChild>
                            {boxes.map((box, index) => (
                              <str.Display
                                index={index}
                                key={box.id}
                                box={box}
                              />
                            ))}
                          </VerticalFlex>
                        </FlexChild>
                      ))}
                    </HorizontalFlex>
                  </CheckboxGroup>
                </FlexChild>

                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    제한
                  </P>
                </FlexChild>
                <FlexChild paddingBottom={6} justifyContent="space-between">
                  <P>최소 선택필수 개수</P>
                  <InputNumber
                    width={60}
                    hideArrow
                    value={min}
                    onChange={(value) => setMin(value)}
                    min={0}
                    max={max}
                  />
                </FlexChild>
                <FlexChild paddingBottom={6} justifyContent="space-between">
                  <P>최대 선택가능 개수</P>
                  <InputNumber
                    width={60}
                    hideArrow
                    value={max}
                    onChange={(value) => setMax(value)}
                    min={min}
                    max={100}
                  />
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    선택 스타일
                  </P>
                </FlexChild>
                <FlexChild paddingBottom={6}>
                  <Select
                    zIndex={10080}
                    styles={{
                      display: { color: "#111" },
                    }}
                    value={style?.on}
                    onChange={(value) => {
                      style.on = value;
                      setStyle(style);
                    }}
                    options={[
                      {
                        display: (
                          <Image src="/resources/contract/checkbox_on1.png" />
                        ),
                        value: "/resources/contract/checkbox_on1.png",
                      },
                      {
                        display: (
                          <Image src="/resources/contract/checkbox_on2.png" />
                        ),
                        value: "/resources/contract/checkbox_on2.png",
                      },
                      {
                        display: (
                          <Image src="/resources/contract/checkbox_on3.png" />
                        ),
                        value: "/resources/contract/checkbox_on3.png",
                      },
                      {
                        display: (
                          <Image src="/resources/contract/checkbox_on4.png" />
                        ),
                        value: "/resources/contract/checkbox_on4.png",
                      },
                    ]}
                  />
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    비선택 스타일
                  </P>
                </FlexChild>
                <FlexChild paddingBottom={6}>
                  <Select
                    zIndex={10080}
                    styles={{
                      display: { color: "#111" },
                    }}
                    value={style?.off}
                    onChange={(value) => {
                      style.off = value;
                      setStyle(style);
                    }}
                    options={[
                      {
                        display: (
                          <Image src="/resources/contract/checkbox_off1.png" />
                        ),
                        value: "/resources/contract/checkbox_off1.png",
                      },
                      {
                        display: (
                          <Image src="/resources/contract/checkbox_off2.png" />
                        ),
                        value: "/resources/contract/checkbox_off2.png",
                      },
                      {
                        display: (
                          <Image src="/resources/contract/checkbox_off3.png" />
                        ),
                        value: "/resources/contract/checkbox_off3.png",
                      },
                      {
                        display: (
                          <Image src="/resources/contract/checkbox_off4.png" />
                        ),
                        value: "/resources/contract/checkbox_off4.png",
                      },
                    ]}
                  />
                </FlexChild>
              </VerticalFlex>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
      );
    }
  );
}
if (!ContractInput.getList().some((input) => input.key === key))
  new CheckboxInput();
