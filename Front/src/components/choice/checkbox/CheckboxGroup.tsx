"use client";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

// CheckboxGroup의 Context 타입 정의
interface CheckboxGroupContextType {
  name: string;
  value: Set<string>;
  toggleCheckbox: (id: string, checked: boolean) => void;
  registerCheckbox: (id: string) => void;
  unregisterCheckbox: (id: string) => void;
  allChecked: boolean;
  setAllChecked: (checked: boolean) => void;
  groupRefs: React.MutableRefObject<Set<string>>;
  groupImages?: {
    on?: string | React.ReactNode;
    off?: string | React.ReactNode;
    onHover?: string | React.ReactNode;
    offHover?: string | React.ReactNode;
  };
}

// CheckboxGroup Context 생성
export const CheckboxGroupContext = createContext<
  CheckboxGroupContextType | undefined
>(undefined);

// CheckboxGroupProps 인터페이스 정의
interface CheckboxGroupProps {
  name: string;
  children: ReactNode;
  initialValues?: string[];
  values?: string[];
  onChange?: (values: string[]) => void;
  className?: string;
  style?: React.CSSProperties;
  images?: {
    on?: string | React.ReactNode;
    off?: string | React.ReactNode;
    onHover?: string | React.ReactNode;
    offHover?: string | React.ReactNode;
  };
}

/**
 * CheckboxGroup 컴포넌트: 체크박스 그룹의 상태를 관리하고 하위 체크박스에 컨텍스트를 제공합니다.
 * @param {CheckboxGroupProps} props - name, children, initialValues, onChange, className, style, images
 */
export const defaultCheckboxImages = {
  on: "/resources/images/checkbox_on.png",
  off: "/resources/images/checkbox_off.png",
  // onHover: "/resources/images/checkbox_on.png",
  // offHover: "/resources/images/checkbox_hover.png",

  // off: "/resources/images/login_radio_off.png",
  // on: "/resources/icons/radio_on.svg",
  // off: (
  //   <Image
  //     src={"/resources/icons/radio_off.png"}
  //     width={"100%"}
  //     height={"100%"}
  //   />
  // ),
  // on: (
  //   <Icon
  //     type="svg"
  //     name="radio_on"
  //     fill="none"
  //     // src={"/resources/icons/radio_on.svg"}
  //     width={"100%"}
  //     height={"100%"}
  //   />
  // ),
};

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  name,
  children,
  initialValues = [],
  values,
  onChange,
  className,
  style,
  images = defaultCheckboxImages,
}) => {
  const isControlled = Array.isArray(values);
  const [innerSet, setInnerSet] = useState(new Set(initialValues));
  const currentSet = isControlled ? new Set(values!) : innerSet;
  const [lastEmittedKey, setLastEmittedKey] = useState<string>("");
  const groupRefs = React.useRef<Set<string>>(new Set()); // 그룹 내 모든 CheckboxChild ID를 관리

  // 모든 체크박스가 체크되었는지 확인
  const allChecked = React.useMemo(() => {
    const ids = Array.from(groupRefs.current);
    if (ids.length === 0) return false;
    return ids.every((id) => currentSet.has(id));
  }, [currentSet, groupRefs]);

  // 제어 모드에서는 내부 상태 동기화 불필요

  // CheckboxChild 상태 토글
  const toArraySorted = (s: Set<string>) => Array.from(s).sort();
  const toggleCheckbox = useCallback(
    (id: string, checked: boolean) => {
      if (isControlled) {
        const next = new Set(currentSet);
        if (checked) next.add(id);
        else next.delete(id);
        onChange?.(toArraySorted(next));
        return;
      }
      setInnerSet((prev) => {
        const next = new Set(prev);
        if (checked) next.add(id);
        else next.delete(id);
        return next;
      });
    },
    [isControlled, currentSet, onChange]
  );

  // CheckboxChild 등록
  const registerCheckbox = useCallback((id: string) => {
    groupRefs.current.add(id);
  }, []);

  // CheckboxChild 등록 해제
  const unregisterCheckbox = useCallback(
    (id: string) => {
      groupRefs.current.delete(id);
      if (!isControlled) {
        setInnerSet((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [isControlled]
  );

  // CheckboxAll 상태 변경
  const setAllChecked = useCallback(
    (checked: boolean) => {
      const next = new Set<string>();
      if (checked) groupRefs.current.forEach((id) => next.add(id));
      if (isControlled) {
        onChange?.(toArraySorted(next));
      } else {
        setInnerSet(next);
      }
    },
    [isControlled, onChange]
  );

  // 변경 알림은 비제어 모드에서만, 그리고 내용이 바뀐 경우에만
  useEffect(() => {
    if (!onChange || isControlled) return;
    const key = toArraySorted(currentSet).join("|");
    if (key !== lastEmittedKey) {
      setLastEmittedKey(key);
      onChange(Array.from(currentSet));
    }
  }, [currentSet, isControlled, onChange, lastEmittedKey]);

  const contextValue = {
    name,
    value: currentSet,
    toggleCheckbox,
    registerCheckbox,
    unregisterCheckbox,
    allChecked,
    setAllChecked,
    groupRefs,
    groupImages: images,
  };

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <div className={className} style={style}>
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
};
export default CheckboxGroup;
