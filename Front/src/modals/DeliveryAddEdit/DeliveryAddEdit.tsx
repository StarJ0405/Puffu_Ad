"use client";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Span from "@/components/span/Span";

import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import style from "./page.module.css";
import Button from "@/components/buttons/Button";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import { useDaumPostcodePopup } from "react-daum-postcode";

import InputNumber from "@/components/inputs/InputNumber";


interface DeliveryAddEditProps {
  address?: AddressDataFrame;
}

export interface DeliveryAddEditRef {
  getFormData: () => AddressDataFrame;
}

const DeliveryAddEdit = forwardRef<DeliveryAddEditRef, DeliveryAddEditProps>(
  ({ address }, ref) => {
    const [formData, setFormData] = useState<Partial<AddressDataFrame>>({
      name: "",
      phone: "",
      postal_code: "",
      address1: "",
      address2: "",
      default: false,
    });

    useEffect(() => {
      if (address) {
        setFormData({
          name: address.name ?? "",
          phone: address.phone ?? "",
          postal_code: address.postal_code ?? "",
          address1: address.address1 ?? "",
          address2: address.address2 ?? "",
          default: address.default ?? false,
        });
      }
    }, [address]);

    // [디버깅 로그 1] Props가 변경될 때마다 확인
    useEffect(() => {
      console.log("DeliveryAddEdit Props:", address);
    }, [address]);

    useImperativeHandle(ref, () => ({
      getFormData: () => formData as AddressDataFrame,
    }));

    const openPostcode = useDaumPostcodePopup();

    const handleComplete = (data: any) => {
      console.log(data);
      let fullAddress = data.address;
      let extraAddress = "";

      if (data.addressType === "R") {
        if (data.bname !== "") {
          extraAddress += data.bname;
        }
        if (data.buildingName !== "") {
          extraAddress +=
            extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
        }
        fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
      }

      handleFormChange("postal_code", data.zonecode);
      handleFormChange("address1", fullAddress);
    };

    const handleFormChange = (key: string, value: any) => {
      // Determine the actual value based on the input type
      let actualValue;
      if (value && typeof value === "object" && value.target) {
        // It's likely an event
        const target = value.target;
        actualValue =
          target.type === "checkbox" ? target.checked : target.value;
      } else {
        // It's a raw value
        actualValue = value;
      }

      // [디버깅 로그 2] State가 변경될 때마다 확인
      console.log(`State 변경: key=${key}, value=`, actualValue);

      let processedValue = actualValue;

      if (key === "phone") {
        // Ensure we're working with a string for the replace/slice operations
        const phoneString = String(actualValue || "");
        const onlyNums = phoneString.replace(/[^0-9]/g, "").slice(0, 11);

        if (onlyNums.length <= 3) {
          processedValue = onlyNums;
        } else if (onlyNums.length <= 7) {
          processedValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
        } else {
          processedValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(
            3,
            7
          )}-${onlyNums.slice(7)}`;
        }
      }

      setFormData((prev) => ({
        ...prev,
        [key]: processedValue,
      }));
    };

    const checkboxValues = useMemo(
      () => (formData.default ? ["delivery_check"] : []),
      [formData.default]
    );

    return (
      <VerticalFlex className="modal_edit_info">
        <FlexChild className="title" justifyContent="center">
          <P size={25} weight={600}>
            {
              1 > 0 ? (
                '배송지 추가'
              ) : (
                '배송지 수정'
              )
            }
          </P>
        </FlexChild>

        {/* 배송지 추가 / 배송지 수정 */}
        <FlexChild>
          <VerticalFlex alignItems="start" gap={30}>
            <VerticalFlex className={"input_box"} alignItems="start" gap={10}>
              <P size={16} color="#333" weight={600}>
                이름
              </P>
              <Input
                type="text"
                width={"100%"}
                placeHolder="받은 분의 이름을 입력해 주세요."
                name="name"
                value={formData.name}
                onChange={(value) => handleFormChange("name", value)}
              />
            </VerticalFlex>

            <VerticalFlex className={"input_box"} alignItems="start" gap={10}>
              <P size={16} color="#333" weight={600}>
                휴대폰번호
              </P>
              <Input
                type="tel" // 'tel' 타입 사용
                width={"100%"}
                placeHolder="휴대폰 번호를 입력해 주세요."
                name="phone"
                value={formData.phone} // formData.phone은 이미 문자열이므로 변환 불필요
                onChange={(value) => handleFormChange("phone", value)}
                maxLength={13}
              />
            </VerticalFlex>

            <VerticalFlex className={"input_box"} alignItems="start" gap={10}>
              <P size={16} color="#333" weight={600}>
                주소
              </P>
              <VerticalFlex gap={10}>
                <FlexChild gap={10}>
                  <Input
                    type="text"
                    width={"100%"}
                    placeHolder="우편번호"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={(value) => handleFormChange("postal_code", value)}
                    readOnly
                  />
                  <Button
                    backgroundColor="var(--main-color2)"
                    padding={"7px 5px"}
                    width={130}
                    onClick={() => openPostcode({ onComplete: handleComplete })}
                  >
                    <P color="#fff" fontSize={14}>
                      우편번호 찾기
                    </P>
                  </Button>
                </FlexChild>
                <FlexChild>
                  <Input
                    type="text"
                    width={"100%"}
                    placeHolder="주소"
                    name="address1"
                    value={formData.address1}
                    onChange={(value) => handleFormChange("address1", value)}
                    readOnly
                  />
                </FlexChild>
                <FlexChild>
                  <Input
                    type="text"
                    width={"100%"}
                    placeHolder="상세주소"
                    name="address2"
                    value={formData.address2}
                    onChange={(value) => handleFormChange("address2", value)}
                  />
                </FlexChild>
              </VerticalFlex>
              <label htmlFor="delivery_check" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  id="delivery_check"
                  name="default"
                  checked={!!formData.default}
                  onChange={(e) => handleFormChange("default", e.target.checked)}
                  style={{ marginRight: '5px' }}
                />
                <P size={14} color="#333">
                  기본 배송지로 설정
                </P>
              </label>
            </VerticalFlex>
          </VerticalFlex>
        </FlexChild>
      </VerticalFlex>
    );
  }
);

export default DeliveryAddEdit;