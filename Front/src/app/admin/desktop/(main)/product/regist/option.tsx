"use client";
"use client";
import Button from "@/components/buttons/Button";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputHashTag from "@/components/inputs/InputHashTag";
import InputImage from "@/components/inputs/InputImage";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { scrollTo, toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const Option = forwardRef(({ type }: { type: string }, ref) => {
  switch (type.toLowerCase()) {
    case "single":
      return <SingleOption ref={ref} />;
    case "simple":
      return <SimpleOption ref={ref} />;
    case "multiple":
      return <MultipleOption ref={ref} />;
  }
  return (
    <>
      <P>{type}</P>
    </>
  );
});

export default Option;

const SingleOption = forwardRef(({}: {}, ref) => {
  const [empty, setEmtpy] = useState(true);
  const inputs = useRef<any[]>([]);
  // const [radio, setRadio] = useState([true, true]);
  useImperativeHandle(ref, () => ({
    async isValid() {
      return (await validateInputs(inputs.current)).isValid;
    },
    getValue() {
      const stack = inputs.current[0].getValue();
      const data: VariantDataFrame = {
        extra_price: 0,
        stack,
        // visible: radio[0],
        // buyable: radio[1],
        visible: true,
        buyable: true,
      };
      return { variants: [data] };
    },
    isEmpty() {
      return empty;
    },
  }));
  return (
    <VerticalFlex border={"1px solid #c0c0c0"} padding={20}>
      <FlexChild>
        <HorizontalFlex gap={10}>
          <FlexChild
            width={"15%"}
            justifyContent="center"
            backgroundColor={"#3C4B64"}
            padding={15}
          >
            <P color="#fff">재고량</P>
          </FlexChild>
          <FlexChild>
            <InputNumber
              width={170}
              ref={(el) => {
                inputs.current[0] = el;
              }}
              onChange={() => setEmtpy(false)}
            />
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      {/* <FlexChild>
        <HorizontalFlex gap={10}>
          <FlexChild
            width={"15%"}
            justifyContent="center"
            backgroundColor={"#3C4B64"}
            padding={15}
          >
            <P color="#fff">진열상태</P>
          </FlexChild>
          <FlexChild>
            <RadioGroup
              name="vdisplay"
              value={radio[0] ? `display` : "undisplay"}
              onValueChange={(value) => {
                setRadio((prev) => {
                  prev[0] = value === "display";
                  return [...prev];
                });
                setEmtpy(false);
              }}
            >
              <HorizontalFlex justifyContent="flex-start" gap={20}>
                <FlexChild gap={6} width={"max-content"}>
                  <RadioChild id="display" />
                  <P>진열</P>
                </FlexChild>
                <FlexChild gap={6} width={"max-content"}>
                  <RadioChild id="undisplay" />
                  <P>미진열</P>
                </FlexChild>
              </HorizontalFlex>
            </RadioGroup>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild>
        <HorizontalFlex gap={10}>
          <FlexChild
            width={"15%"}
            justifyContent="center"
            backgroundColor={"#3C4B64"}
            padding={15}
          >
            <P color="#fff">판매상태</P>
          </FlexChild>
          <FlexChild>
            <RadioGroup
              name="vsale"
              value={radio[1] ? `sale` : "unsale"}
              onValueChange={(value) => {
                setRadio((prev) => {
                  prev[1] = value === "sale";
                  return [...prev];
                });
                setEmtpy(false);
              }}
            >
              <HorizontalFlex justifyContent="flex-start" gap={20}>
                <FlexChild gap={6} width={"max-content"}>
                  <RadioChild id="sale" />
                  <P>판매</P>
                </FlexChild>
                <FlexChild gap={6} width={"max-content"}>
                  <RadioChild id="unsale" />
                  <P>미판매</P>
                </FlexChild>
              </HorizontalFlex>
            </RadioGroup>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild> */}
    </VerticalFlex>
  );
});
const SimpleOption = forwardRef(({}: {}, ref) => {
  const [ids, setIds] = useState<string[]>([]);
  const options = useRef<any[]>([]);
  const handleAdd = () => {
    setIds((prev) => [...prev, String(new Date().getTime() + Math.random())]);
  };
  useImperativeHandle(ref, () => ({
    async isValid() {
      if (options.current.some((option) => option?.isEmpty?.()))
        return scrollTo("option", "작성중인 옵션이 있습니다.");
      if (options.current.length < 2)
        return scrollTo(
          "option",
          "옵션은 최소 2가지 등록해야합니다. 1가지만 등록할 경우 단일옵션을 선택해주세요."
        );

      return (await validateInputs(options.current.filter(Boolean))).isValid;
    },
    getValue() {
      return {
        variants: options.current.map((option) => option?.getValue?.()),
      };
    },
    isEmpty() {
      return options.current.every((option) => option?.isEmpty?.());
    },
  }));
  useClientEffect(
    () => {
      setIds([String(new Date().getTime() + Math.random())]);
    },
    [],
    true
  );
  const handleRemove = useCallback(
    (id: string) => {
      //   return toast({ message: "옵션이 1개일 때는 삭제할 수 없습니다." });
      const index = ids.findIndex((f) => f === id);
      setIds((prev) => prev.filter((f) => f !== id));

      options.current = options.current.filter((_, _index) => _index !== index);
      if (ids.length === 1) {
        setIds([String(new Date().getTime() + Math.random())]);
      }
    },
    [setIds, ids]
  );
  return (
    <VerticalFlex gap={10}>
      {ids.map((id, index) => (
        <SimpleOptionSlot
          key={id}
          id={id}
          ref={(el) => {
            options.current[index] = el;
          }}
          handleRemove={handleRemove}
        />
      ))}
      <Button
        id="option"
        scrollMarginTop={150}
        styleType="admin2"
        onClick={handleAdd}
      >
        <P>추가</P>
      </Button>
    </VerticalFlex>
  );
});
const SimpleOptionSlot = forwardRef(
  (
    { id, handleRemove }: { id: string; handleRemove: (id: string) => void },
    ref
  ) => {
    const [edit, setEdit] = useState(true);
    const [expand, setExpand] = useState(false);
    const [name, setName] = useState("");
    const [radio, setRadio] = useState([true, true]);
    const [empty, setEmpty] = useState(true);
    const nameRef = useRef<any>(null);
    const inputs = useRef<any[]>([]);
    const image = useRef<any>(null);
    useImperativeHandle(ref, () => ({
      async isValid() {
        if (!name) return scrollTo(`${id}_name`, "이름을 입력해주세요.");
        return (await validateInputs([...inputs.current, image.current]))
          .isValid;
      },
      getValue() {
        const extra_price = inputs.current[0].getValue();
        const stack = inputs.current[1].getValue();
        const thumbnail = image.current.getValue();
        const data: VariantDataFrame = {
          title: name,
          extra_price,
          stack,
          visible: radio[0],
          buyable: radio[1],
          thumbnail,
        };
        return data;
      },
      isEmpty() {
        return empty;
      },
    }));
    useClientEffect(() => {
      if (name.trim()) setEmpty(false);
    }, [name]);
    return (
      <VerticalFlex border={"1px solid #c0c0c0"} padding={20}>
        <FlexChild>
          {edit ? (
            <HorizontalFlex justifyContent="flex-start" gap={6}>
              <Input
                id={`${id}_name`}
                scrollMarginTop={150}
                ref={nameRef}
                value={name}
                width={300}
                placeHolder="실제로 표기될 옵션명을 입력해주세요!"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const _name = nameRef.current.getValue();
                    if (_name) {
                      if (!name) setExpand(true);
                      setName(_name);
                      setEdit(false);
                    } else toast({ message: "이름을 입력하세요." });
                  } else if (e.key === "Escape") {
                    if (name) setEdit(false);
                    else {
                      handleRemove(id);
                    }
                  }
                }}
              />
              <Image
                src={"/resources/images/check-mark.png"}
                size={20}
                cursor="pointer"
                onClick={() => {
                  const _name = nameRef.current.getValue();
                  if (_name) {
                    if (!name) setExpand(true);
                    setName(_name);
                    setEdit(false);
                  } else toast({ message: "이름을 입력하세요." });
                }}
              />
              <Image
                src={"/resources/images/closeBtn2x_2.png"}
                size={20}
                cursor="pointer"
                onClick={() => {
                  if (name) setEdit(false);
                  else {
                    handleRemove(id);
                  }
                }}
              />
            </HorizontalFlex>
          ) : (
            <HorizontalFlex
              justifyContent="flex-start"
              gap={6}
              paddingBottom={expand ? 10 : 0}
            >
              <Image
                src={
                  expand
                    ? "/resources/images/minus.png"
                    : "/resources/images/plus.png"
                }
                size={20}
                cursor="pointer"
                onClick={() => setExpand((prev) => !prev)}
              />
              <P
                id={`${id}_name`}
                scrollMarginTop={150}
                fontSize={18}
                fontWeight={600}
                textDecoration={!name ? "line-through" : undefined}
                color={!name ? "red" : undefined}
              >
                {name || "이름 없음"}
              </P>
              <Image
                src={"/resources/images/editing.png"}
                size={20}
                cursor="pointer"
                onClick={() => setEdit(true)}
              />
              <Image
                src={"/resources/images/closeBtn2x_2.png"}
                size={20}
                cursor="pointer"
                onClick={() => {
                  NiceModal.show("confirm", {
                    message: "삭제하시겠습니까?",
                    cancelText: "취소",
                    confirmText: "삭제",
                    onConfirm: () => {
                      handleRemove(id);
                    },
                  });
                }}
              />
            </HorizontalFlex>
          )}
        </FlexChild>
        <VerticalFlex hidden={!expand}>
          <FlexChild>
            <HorizontalFlex gap={10} alignItems="stretch">
              <FlexChild
                width={"15%"}
                justifyContent="center"
                backgroundColor={"#3C4B64"}
                padding={15}
              >
                <P color="#fff">썸네일</P>
              </FlexChild>
              <FlexChild>
                <InputImage
                  ref={(el) => {
                    image.current = el;
                  }}
                  name={"옵션_썸네일"}
                  path={"/product/variant"}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex gap={10}>
              <FlexChild
                width={"15%"}
                justifyContent="center"
                backgroundColor={"#3C4B64"}
                padding={15}
              >
                <P color="#fff">증감액</P>
              </FlexChild>
              <FlexChild>
                <InputNumber
                  width={170}
                  ref={(el) => {
                    inputs.current[0] = el;
                  }}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex gap={10}>
              <FlexChild
                width={"15%"}
                justifyContent="center"
                backgroundColor={"#3C4B64"}
                padding={15}
              >
                <P color="#fff">재고량</P>
              </FlexChild>
              <FlexChild>
                <InputNumber
                  width={170}
                  ref={(el) => {
                    inputs.current[1] = el;
                  }}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex gap={10}>
              <FlexChild
                width={"15%"}
                justifyContent="center"
                backgroundColor={"#3C4B64"}
                padding={15}
              >
                <P color="#fff">진열상태</P>
              </FlexChild>
              <FlexChild>
                <RadioGroup
                  name="vdisplay"
                  value={radio[0] ? `display` : "undisplay"}
                  onValueChange={(value) =>
                    setRadio((prev) => {
                      prev[0] = value === "display";
                      return [...prev];
                    })
                  }
                >
                  <HorizontalFlex justifyContent="flex-start" gap={20}>
                    <FlexChild gap={6} width={"max-content"}>
                      <RadioChild id="display" />
                      <P>진열</P>
                    </FlexChild>
                    <FlexChild gap={6} width={"max-content"}>
                      <RadioChild id="undisplay" />
                      <P>미진열</P>
                    </FlexChild>
                  </HorizontalFlex>
                </RadioGroup>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex gap={10}>
              <FlexChild
                width={"15%"}
                justifyContent="center"
                backgroundColor={"#3C4B64"}
                padding={15}
              >
                <P color="#fff">판매상태</P>
              </FlexChild>
              <FlexChild>
                <RadioGroup
                  name="vsale"
                  value={radio[1] ? `sale` : "unsale"}
                  onValueChange={(value) =>
                    setRadio((prev) => {
                      prev[1] = value === "sale";
                      return [...prev];
                    })
                  }
                >
                  <HorizontalFlex justifyContent="flex-start" gap={20}>
                    <FlexChild gap={6} width={"max-content"}>
                      <RadioChild id="sale" />
                      <P>판매</P>
                    </FlexChild>
                    <FlexChild gap={6} width={"max-content"}>
                      <RadioChild id="unsale" />
                      <P>미판매</P>
                    </FlexChild>
                  </HorizontalFlex>
                </RadioGroup>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
        </VerticalFlex>
      </VerticalFlex>
    );
  }
);
const MultipleOption = forwardRef(({}: {}, ref) => {
  const [group, setGroup] = useState<string[]>([]);
  const [ids, setIds] = useState<string[]>([]);
  const options = useRef<any[]>([]);
  const handleAdd = () => {
    setIds((prev) => [...prev, String(new Date().getTime() + Math.random())]);
  };
  useImperativeHandle(ref, () => ({
    async isValid() {
      if (group.length < 2)
        return scrollTo(
          "group",
          "옵션 카테고리는 최소 2가지 이상 등록해야합니다. 1가지만 등록할 경우는 단순 옵션을 선택해주세요"
        );
      if (options.current.some((option) => option?.isEmpty?.()))
        return scrollTo("option", "작성중인 옵션이 있습니다.");
      if (options.current.length < 2)
        return scrollTo(
          "option",
          "옵션은 최소 2가지 이상 등록해야합니다. 1가지만 등록할 경우 단일옵션을 선택해주세요."
        );
      return (await validateInputs(options.current.filter(Boolean))).isValid;
    },
    getValue() {
      const _options: OptionDataFrame[] = group.map((title) => ({ title }));
      const variants = options.current.map((option) => {
        const variant: VariantDataFrame = option?.getValue?.();
        variant.values = variant?.values?.map((value, index) => ({
          ...value,
          option: _options[index],
        }));
        return variant;
      });

      return {
        variants,
        options: _options,
      };
    },
    isEmpty() {
      return options.current.every((option) => option?.isEmpty?.());
    },
  }));
  useClientEffect(
    () => {
      setIds([String(new Date().getTime() + Math.random())]);
    },
    [],
    true
  );
  const handleRemove = useCallback(
    (id: string) => {
      const index = ids.findIndex((f) => f === id);
      setIds((prev) => prev.filter((f) => f !== id));

      options.current = options.current.filter((_, _index) => _index !== index);
      if (ids.length === 1)
        setIds([String(new Date().getTime() + Math.random())]);
    },
    [setIds, ids]
  );
  return (
    <VerticalFlex gap={20}>
      <FlexChild>
        <HorizontalFlex gap={10}>
          <FlexChild
            width={150}
            backgroundColor={"#3C4B64"}
            padding={15}
            justifyContent="center"
          >
            <P color="#fff">옵션 카테고리</P>
          </FlexChild>
          <FlexChild>
            <InputHashTag
              value={group}
              width={"100%"}
              onChange={(tags) => {
                setGroup(tags);
              }}
              placeHolder="추가 할 옵션 그룹명을 최소 2가지 입력해주세요 예) 사이즈, 색깔"
            />
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild>
        <VerticalFlex gap={10}>
          {ids.map((id, index) => (
            <MultipleOptionSlot
              key={id}
              id={id}
              ref={(el) => {
                options.current[index] = el;
              }}
              handleRemove={handleRemove}
              group={group}
            />
          ))}
          <Button
            id="option"
            scrollMarginTop={150}
            styleType="admin2"
            onClick={handleAdd}
          >
            <P>추가</P>
          </Button>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
});

const MultipleOptionSlot = forwardRef(
  (
    {
      id,
      handleRemove,
      group,
    }: { id: string; handleRemove: (id: string) => void; group: string[] },
    ref
  ) => {
    const [edit, setEdit] = useState(true);
    const [expand, setExpand] = useState(false);
    const [name, setName] = useState("");
    const [radio, setRadio] = useState([true, true]);
    const [empty, setEmpty] = useState(true);
    const nameRef = useRef<any>(null);
    const inputs = useRef<any[]>([]);
    const image = useRef<any>(null);
    const groupRef = useRef<any[]>([]);
    useImperativeHandle(ref, () => ({
      async isValid() {
        if (!name) return scrollTo(`${id}_name`, "이름을 입력해주세요.");
        if (groupRef.current.some((ref) => !ref.getValue()))
          return scrollTo(`${id}_group`, "옵션값을 전부 입력해주세요.");
        return (await validateInputs([...inputs.current, image.current]))
          .isValid;
      },
      getValue() {
        const extra_price = inputs.current[0].getValue();
        const stack = inputs.current[1].getValue();
        const thumbnail = image.current.getValue();
        const variant: VariantDataFrame = {
          title: name,
          extra_price,
          stack,
          visible: radio[0],
          buyable: radio[1],
          thumbnail,
        };
        const values: OptionValueDataFrame[] = groupRef.current.map((ref) => ({
          value: ref.getValue(),
          variant: { ...variant },
        }));
        variant.values = values;

        return variant;
      },
      isEmpty() {
        return empty;
      },
    }));
    useClientEffect(() => {
      if (name.trim()) setEmpty(false);
    }, [name]);
    return (
      <VerticalFlex border={"1px solid #c0c0c0"} padding={20}>
        <FlexChild>
          {edit ? (
            <HorizontalFlex justifyContent="flex-start" gap={6}>
              <Input
                id={`${id}_name`}
                scrollMarginTop={150}
                ref={nameRef}
                value={name}
                width={300}
                placeHolder="실제로 표기될 옵션명을 입력해주세요!"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const _name = nameRef.current.getValue();
                    if (_name) {
                      if (!name) setExpand(true);
                      setName(_name);
                      setEdit(false);
                    } else toast({ message: "이름을 입력하세요." });
                  } else if (e.key === "Escape") {
                    if (name) setEdit(false);
                    else {
                      handleRemove(id);
                    }
                  }
                }}
              />
              <Image
                src={"/resources/images/check-mark.png"}
                size={20}
                cursor="pointer"
                onClick={() => {
                  const _name = nameRef.current.getValue();
                  if (_name) {
                    if (!name) setExpand(true);
                    setName(_name);
                    setEdit(false);
                  } else toast({ message: "이름을 입력하세요." });
                }}
              />
              <Image
                src={"/resources/images/closeBtn2x_2.png"}
                size={20}
                cursor="pointer"
                onClick={() => {
                  if (name) setEdit(false);
                  else {
                    handleRemove(id);
                  }
                }}
              />
            </HorizontalFlex>
          ) : (
            <HorizontalFlex
              justifyContent="flex-start"
              gap={6}
              paddingBottom={expand ? 10 : 0}
            >
              <Image
                src={
                  expand
                    ? "/resources/images/minus.png"
                    : "/resources/images/plus.png"
                }
                size={20}
                cursor="pointer"
                onClick={() => setExpand((prev) => !prev)}
              />
              <P
                id={`${id}_name`}
                scrollMarginTop={150}
                fontSize={18}
                fontWeight={600}
                textDecoration={!name ? "line-through" : undefined}
                color={!name ? "red" : undefined}
              >
                {name || "이름 없음"}
              </P>
              <Image
                src={"/resources/images/editing.png"}
                size={20}
                cursor="pointer"
                onClick={() => setEdit(true)}
              />
              <Image
                src={"/resources/images/closeBtn2x_2.png"}
                size={20}
                cursor="pointer"
                onClick={() => {
                  NiceModal.show("confirm", {
                    message: "삭제하시겠습니까?",
                    cancelText: "취소",
                    confirmText: "삭제",
                    onConfirm: () => {
                      handleRemove(id);
                    },
                  });
                }}
              />
            </HorizontalFlex>
          )}
        </FlexChild>
        <VerticalFlex hidden={!expand}>
          {group.map((name, index) => (
            <FlexChild key={`${id}_${name}`}>
              <HorizontalFlex gap={10}>
                <FlexChild
                  width={"15%"}
                  justifyContent="center"
                  backgroundColor={"#3C4B64"}
                  padding={15}
                >
                  <P
                    id={index === 0 ? `${id}_group` : ""}
                    scrollMarginTop={index === 0 ? 150 : undefined}
                    color="#fff"
                  >
                    {name}
                  </P>
                </FlexChild>
                <FlexChild>
                  <Input
                    width={500}
                    ref={(el) => {
                      groupRef.current[index] = el;
                    }}
                    placeHolder={`${name}의 옵션 값을 입력해주세요`}
                  />
                </FlexChild>
              </HorizontalFlex>
            </FlexChild>
          ))}
          <FlexChild>
            <HorizontalFlex gap={10} alignItems="stretch">
              <FlexChild
                width={"15%"}
                justifyContent="center"
                backgroundColor={"#3C4B64"}
                padding={15}
              >
                <P color="#fff">썸네일</P>
              </FlexChild>
              <FlexChild>
                <InputImage
                  ref={(el) => {
                    image.current = el;
                  }}
                  name={"옵션_썸네일"}
                  path={"/product/variant"}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex gap={10}>
              <FlexChild
                width={"15%"}
                justifyContent="center"
                backgroundColor={"#3C4B64"}
                padding={15}
              >
                <P color="#fff">증감액</P>
              </FlexChild>
              <FlexChild>
                <InputNumber
                  width={170}
                  ref={(el) => {
                    inputs.current[0] = el;
                  }}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex gap={10}>
              <FlexChild
                width={"15%"}
                justifyContent="center"
                backgroundColor={"#3C4B64"}
                padding={15}
              >
                <P color="#fff">재고량</P>
              </FlexChild>
              <FlexChild>
                <InputNumber
                  width={170}
                  ref={(el) => {
                    inputs.current[1] = el;
                  }}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex gap={10}>
              <FlexChild
                width={"15%"}
                justifyContent="center"
                backgroundColor={"#3C4B64"}
                padding={15}
              >
                <P color="#fff">진열상태</P>
              </FlexChild>
              <FlexChild>
                <RadioGroup
                  name="vdisplay"
                  value={radio[0] ? `display` : "undisplay"}
                  onValueChange={(value) =>
                    setRadio((prev) => {
                      prev[0] = value === "display";
                      return [...prev];
                    })
                  }
                >
                  <HorizontalFlex justifyContent="flex-start" gap={20}>
                    <FlexChild gap={6} width={"max-content"}>
                      <RadioChild id="display" />
                      <P>진열</P>
                    </FlexChild>
                    <FlexChild gap={6} width={"max-content"}>
                      <RadioChild id="undisplay" />
                      <P>미진열</P>
                    </FlexChild>
                  </HorizontalFlex>
                </RadioGroup>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex gap={10}>
              <FlexChild
                width={"15%"}
                justifyContent="center"
                backgroundColor={"#3C4B64"}
                padding={15}
              >
                <P color="#fff">판매상태</P>
              </FlexChild>
              <FlexChild>
                <RadioGroup
                  name="vsale"
                  value={radio[1] ? `sale` : "unsale"}
                  onValueChange={(value) =>
                    setRadio((prev) => {
                      prev[1] = value === "sale";
                      return [...prev];
                    })
                  }
                >
                  <HorizontalFlex justifyContent="flex-start" gap={20}>
                    <FlexChild gap={6} width={"max-content"}>
                      <RadioChild id="sale" />
                      <P>판매</P>
                    </FlexChild>
                    <FlexChild gap={6} width={"max-content"}>
                      <RadioChild id="unsale" />
                      <P>미판매</P>
                    </FlexChild>
                  </HorizontalFlex>
                </RadioGroup>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
        </VerticalFlex>
      </VerticalFlex>
    );
  }
);
