"use client";
import useClientEffect from "@/shared/hooks/useClientEffect";
import useNavigate from "@/shared/hooks/useNavigate";
import clsx from "clsx";
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Select.module.css";

// 옵션의 데이터 타입 정의
interface SelectOption<T extends string | number> {
  value: T;
  display: React.ReactNode;
  disabled?: boolean;
  to?: LocationTo;
}
interface LocationTo {
  url: string;
  new?: boolean;
}

// CheckIcon 컴포넌트 (내부 사용)
const CheckIcon: React.FC = () => (
  <svg viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// Select 컴포넌트의 Props 타입 정의
interface SelectProps<T extends string | number> {
  id?: string;
  options: SelectOption<T>[];
  value?: T | T[];
  placeholder?: string;
  multiple?: boolean;
  onChange?: (selectedValue: T | T[] | undefined) => void;
  height?: React.CSSProperties["height"];
  minHeight?: React.CSSProperties["maxHeight"];
  maxHeight?: React.CSSProperties["maxHeight"];
  width?: React.CSSProperties["width"];
  maxWidth?: React.CSSProperties["maxWidth"];
  minWidth?: React.CSSProperties["maxWidth"];
  classNames?: {
    line?: React.HTMLAttributes<HTMLElement>["className"];
    placeholder?: React.HTMLAttributes<HTMLElement>["className"];
    arrow?: React.HTMLAttributes<HTMLElement>["className"];
    search?: React.HTMLAttributes<HTMLElement>["className"];
    header?: React.HTMLAttributes<HTMLElement>["className"];
  };
  disabled?: boolean;
  /**
   * 다중 선택(multiple=true) 시, 선택 가능한 최대 항목 개수입니다.
   * 이 제한을 초과하여 선택하려고 하면 해당 항목은 선택되지 않습니다.
   * @default undefined (제한 없음)
   */
  maxSelectionLimit?: number; // maxSelectionLimit prop 추가
  searchable?: boolean;
  zIndex?: number;
  cancelable?: boolean;
  scrollMarginTop?: CSSProperties["scrollMarginTop"];
  onOpenChange?: (isOpen: boolean) => void;
  isOpen?: boolean;
  inside?: boolean; // true시 포탈 대신 박스 아래에 연장됨
  hideScroll?: boolean;
  onClick?: ({
    disabled,
    isOpen,
    actives,
  }: {
    disabled: boolean;
    isOpen: boolean;
    actives: any[];
  }) => void;
}

function Select<T extends string | number>({
  id,
  options,
  value,
  placeholder = "선택하세요",
  multiple = false,
  onChange,
  width = "250px",
  minWidth,
  maxWidth,
  hideScroll,
  height,
  minHeight,
  maxHeight = "200px",
  classNames,
  disabled = false,
  maxSelectionLimit, // maxSelectionLimit prop 받기
  searchable = false,
  zIndex,
  cancelable = false,
  scrollMarginTop,
  onOpenChange,
  isOpen: props_isOpen,
  inside = false,
  onClick,
}: SelectProps<T>) {
  const [keyword, setKeyword] = useState<string>("");
  const [isOpen, setIsOpen] = useState(props_isOpen || false);
  const selectRef = useRef<HTMLDivElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
  const [currentSelectedValues, setCurrentSelectedValues] = useState<Set<T>>(
    () =>
      new Set(Array.isArray(value) ? value : value !== undefined ? [value] : [])
  );
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const navigate = useNavigate();

  const calculateDropdownPosition = useCallback(() => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, []);
  const handleHeaderClick = () => {
    onClick?.({ disabled, isOpen, actives: Array.from(currentSelectedValues) });
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = useCallback(
    (option: SelectOption<T>) => {
      if (option.disabled || disabled) return;

      if (multiple) {
        setCurrentSelectedValues((prevSelectedValues) => {
          const newSelectedValues = new Set(prevSelectedValues);
          if (newSelectedValues.has(option.value)) {
            // 이미 선택된 항목은 제한 없이 해제 가능
            if (cancelable) newSelectedValues.delete(option.value);
          } else {
            // 새 항목을 추가할 때만 제한 검사
            if (
              maxSelectionLimit === undefined ||
              newSelectedValues.size < maxSelectionLimit
            ) {
              newSelectedValues.add(option.value);
            } else {
              // 제한을 초과하면 선택되지 않음 (여기서 사용자에게 알림을 줄 수도 있음)
              console.warn(`최대 ${maxSelectionLimit}개까지 선택 가능합니다.`);
              return prevSelectedValues; // 상태 변경 없이 이전 값 반환
            }
          }
          onChange?.(Array.from(newSelectedValues));
          return newSelectedValues;
        });
      } else {
        // 단일 선택 모드 (이전과 동일)
        if (currentSelectedValues.has(option.value)) {
          if (cancelable) {
            setCurrentSelectedValues(new Set());
            onChange?.(undefined);
          }
        } else {
          setCurrentSelectedValues(new Set([option.value]));
          onChange?.(option.value);
        }
        setIsOpen(false);
      }
    },
    [multiple, onChange, disabled, maxSelectionLimit, currentSelectedValues] // maxSelectionLimit 의존성 추가
  );
  useEffect(() => {
    if (!isOpen) {
      setKeyword("");
    }
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  }, [isOpen]);
  useClientEffect(() => {
    if (typeof props_isOpen !== "undefined") setIsOpen(props_isOpen);
  }, [props_isOpen]);
  const getDisplayValue = () => {
    const currentSelected = Array.from(currentSelectedValues);
    if (currentSelected.length === 0) {
      return (
        <span className={clsx(styles.placeholder, classNames?.placeholder)}>
          {placeholder}
        </span>
      );
    }

    const selectedDisplays = options
      .filter((option) => currentSelected.includes(option.value))
      .map((option) => option.display);

    if (multiple) {
      if (selectedDisplays.length === 0)
        return (
          <span className={clsx(styles.placeholder, classNames?.placeholder)}>
            {placeholder}
          </span>
        );
      return (
        <span className={clsx(styles.placeholder, classNames?.placeholder)}>
          {selectedDisplays.length > 1
            ? `${selectedDisplays.length}개 선택됨`
            : selectedDisplays[0]}
        </span>
      );
    } else {
      return (
        selectedDisplays[0] || (
          <span className={clsx(styles.placeholder, classNames?.placeholder)}>
            {placeholder}
          </span>
        )
      );
    }
  };
  const Options = () => {
    return (
      <>
        {options.length === 0 ? (
          <div
            className={clsx(styles.optionItem, classNames?.line)}
            style={{ cursor: "default" }}
          >
            옵션이 없습니다.
          </div>
        ) : (
          options
            .filter((f) => {
              return !searchable || String(f.display).includes(keyword);
            })
            .map((option, index) => (
              <div
                key={String(option?.value) + index}
                className={clsx(
                  styles.optionItem,
                  classNames?.line,
                  currentSelectedValues.has(option.value) && styles.selected,
                  option.disabled && styles.disabled,
                  // maxSelectionLimit에 도달했고, 이 옵션이 현재 선택되어 있지 않다면 비활성화 클래스 추가
                  multiple &&
                    maxSelectionLimit !== undefined &&
                    currentSelectedValues.size >= maxSelectionLimit &&
                    !currentSelectedValues.has(option.value) &&
                    styles.disabled
                )}
                onClick={() => {
                  handleOptionClick(option);
                  if (option.to) {
                    navigate(option.to.url, {
                      type: option.to.new ? "new" : "move",
                    });
                  }
                }}
                role="option"
                aria-selected={currentSelectedValues.has(option.value)}
                // ARIA disabled 속성도 제한에 따라 적용
                aria-disabled={
                  option.disabled ||
                  (multiple &&
                    maxSelectionLimit !== undefined &&
                    currentSelectedValues.size >= maxSelectionLimit &&
                    !currentSelectedValues.has(option.value))
                }
              >
                {multiple && (
                  <span className={styles.checkboxIcon}>
                    {currentSelectedValues.has(option.value) && <CheckIcon />}
                  </span>
                )}
                {option.display}
              </div>
            ))
        )}
      </>
    );
  };
  const dropdownContent = isOpen && portalNode && (
    <div
      ref={optionsContainerRef}
      className={clsx(styles.optionsContainer, isOpen && styles.open)}
      style={{
        position: "absolute",
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        maxHeight: maxHeight,
        zIndex: zIndex ? zIndex : undefined,
        scrollbarWidth: hideScroll ? "none" : undefined,
      }}
    >
      <Options />
    </div>
  );

  useEffect(() => {
    setCurrentSelectedValues(
      new Set(Array.isArray(value) ? value : value !== undefined ? [value] : [])
    );
  }, [value]);
  useEffect(() => {
    setPortalNode(document.body);
  }, []);
  useLayoutEffect(() => {
    calculateDropdownPosition();
  }, [isOpen, calculateDropdownPosition]);

  useEffect(() => {
    const handleScrollOrResize = () => calculateDropdownPosition();
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [calculateDropdownPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        optionsContainerRef.current &&
        !optionsContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return inside ? (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        ref={selectRef}
        className={clsx(styles.selectContainer)}
        style={{ width, height, minWidth }}
      >
        <div
          id={id}
          className={clsx(
            styles.selectHeader,
            isOpen && styles.open,
            disabled && styles.disabled,
            classNames?.header
          )}
          onClick={handleHeaderClick}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-disabled={disabled}
          style={{
            padding: searchable && isOpen ? 0 : undefined,
            scrollMarginTop,
          }}
        >
          {searchable && isOpen ? (
            <input
              className={clsx(styles.search, classNames?.search)}
              placeholder="내용을 검색해주세요"
              onClick={(e) => {
                e.stopPropagation();
              }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          ) : (
            <div className={styles.selectedItemsDisplay}>
              {getDisplayValue()}
            </div>
          )}
          <span
            className={clsx(
              styles.arrow,
              isOpen && styles.up,
              classNames?.arrow
            )}
            style={{
              marginRight: isOpen && searchable ? 15 : undefined,
            }}
          />
        </div>
      </div>
      <div
        className={styles.inline}
        style={{
          height: isOpen ? `${36 * options.length}px` : 0,
          opacity: isOpen ? 1 : 0,
          pointerEvents: !isOpen ? "none" : undefined,
        }}
      >
        <Options />
      </div>
    </div>
  ) : (
    <div style={{position: 'relative'}}>
      <div
        ref={selectRef}
        className={clsx(styles.selectContainer)}
        style={{ width, height, minWidth }}
      >
        <div
          id={id}
          className={clsx(
            styles.selectHeader,
            isOpen && styles.open,
            disabled && styles.disabled,
            classNames?.header
          )}
          onClick={handleHeaderClick}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-disabled={disabled}
          style={{
            padding: searchable && isOpen ? 0 : undefined,
            scrollMarginTop,
          }}
        >
          {searchable && isOpen ? (
            <input
              style={{
                width: "calc(100% - 11.05px)",
                height: "100%",
                border: "none",
                padding: "10px 0px 10px 15px",
              }}
              placeholder="내용을 검색해주세요"
              onClick={(e) => {
                e.stopPropagation();
              }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          ) : (
            <div className={styles.selectedItemsDisplay}>
              {getDisplayValue()}
            </div>
          )}
          <span
            className={clsx(
              styles.arrow,
              isOpen && styles.up,
              classNames?.arrow
            )}
            style={{
              marginRight: isOpen && searchable ? 15 : undefined,
            }}
          />
        </div>
      </div>
      {portalNode && createPortal(dropdownContent, portalNode)}
    </div>
  );
}

export default Select;
