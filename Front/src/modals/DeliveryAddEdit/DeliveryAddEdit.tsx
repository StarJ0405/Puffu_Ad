"use client";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import { useState } from "react";
import style from "./page.module.css";
import { useCart } from "@/providers/StoreProvider/StorePorivderClient";
import ChoiceChild from "@/components/choice/ChoiceChild";
import ChoiceGroup from "@/components/choice/ChoiceGroup";
import NoContent from "@/components/noContent/noContent";
import Button from "@/components/buttons/Button";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import Image from "@/components/Image/Image";
import InputNumber from "@/components/inputs/InputNumber";
import ConfirmModal from "@/modals/confirm/ConfirmModal";
import clsx from "clsx";
import NiceModal from "@ebay/nice-modal-react";
import TermContent from "@/components/agreeContent/TermContent";
import PrivacyContent from "@/components/agreeContent/privacyContent";


export default function DeliveryAddEdit() {
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
                />
              </VerticalFlex>

              <VerticalFlex className={"input_box"} alignItems="start" gap={10}>
                <P size={16} color="#333" weight={600}>
                  휴대폰번호
                </P>
                <Input
                  type="text"
                  width={"100%"}
                  placeHolder="휴대폰 번호를 입력해 주세요."
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
                    />
                    <Button backgroundColor="var(--main-color2)" padding={'7px 5px'} width={130}>
                      <P color="#fff" fontSize={14}>우편번호 찾기</P>
                    </Button>
                  </FlexChild>
                  <FlexChild>
                    <Input
                      type="text"
                      width={"100%"}
                      placeHolder="주소"
                    />
                  </FlexChild>
                  <FlexChild>
                    <Input
                      type="text"
                      width={"100%"}
                      placeHolder="상세주소"
                    />
                  </FlexChild>
                </VerticalFlex>
                <CheckboxGroup name="delivery_save">
                  <FlexChild gap={5}>
                    <CheckboxChild id="delivery_check" />
                    <P size={14} color="#333">기본 배송지로 설정</P>
                  </FlexChild>
                </CheckboxGroup>
              </VerticalFlex>
            </VerticalFlex>
          </FlexChild>
      </VerticalFlex>
   )
}