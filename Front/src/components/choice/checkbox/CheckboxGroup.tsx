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
  // on: "/resources/images/checkbox_on.png",
  // off: "/resources/images/checkbox_off.png",
  // onHover: "/resources/images/checkbox_on.png",
  // offHover: "/resources/images/checkbox_hover.png",

  // off: "/resources/images/login_radio_off.png",
  // on: "/resources/icons/radio_on.svg",
  off: (
    <Image
      src={"/resources/icons/radio_off.png"}
      width={"100%"}
      height={"100%"}
    />
  ),
  on: (
    <Icon
      type="svg"
      name="radio_on"
      fill="none"
      // src={"/resources/icons/radio_on.svg"}
      width={"100%"}
      height={"100%"}
    />
  ),
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
  const [checkedValues, setCheckedValues] = useState(new Set(initialValues));
  const [allChecked, setAllCheckedState] = useState(false);
  const groupRefs = React.useRef<Set<string>>(new Set()); // 그룹 내 모든 CheckboxChild ID를 관리

  // 모든 체크박스가 체크되었는지 확인
  useEffect(() => {
    const areAllRegisteredChecked =
      groupRefs.current.size > 0 &&
      Array.from(groupRefs.current).every((id) => checkedValues.has(id));
    setAllCheckedState(areAllRegisteredChecked);
  }, [checkedValues]);
  useEffect(() => {
    if (
      values &&
      (values?.length !== checkedValues.size ||
        JSON.stringify(Array.from(checkedValues).sort()) !==
          JSON.stringify(Array.from(values).sort()))
    ) {
      setCheckedValues(new Set(values));
    }
  }, [values]);
  // CheckboxChild 상태 토글
  const toggleCheckbox = useCallback((id: string, checked: boolean) => {
    setCheckedValues((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  // CheckboxChild 등록
  const registerCheckbox = useCallback((id: string) => {
    groupRefs.current.add(id);
  }, []);

  // CheckboxChild 등록 해제
  const unregisterCheckbox = useCallback((id: string) => {
    groupRefs.current.delete(id);
    setCheckedValues((prev) => {
      const newSet = new Set(prev);
      if (!groupRefs.current.has(id)) {
        // Only delete if it's no longer registered
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  // CheckboxAll 상태 변경
  const setAllChecked = useCallback((checked: boolean) => {
    setCheckedValues(() => {
      const newSet = new Set<string>();
      if (checked) {
        groupRefs.current.forEach((id) => newSet.add(id));
      }
      return newSet;
    });
  }, []);
  useEffect(() => {
    if (onChange) onChange?.(Array.from(checkedValues));
  }, [checkedValues]);
  const contextValue = {
    name,
    value: checkedValues,
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
