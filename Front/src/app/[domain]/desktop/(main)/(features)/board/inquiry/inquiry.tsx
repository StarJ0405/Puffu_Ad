import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import Container from "@/components/container/Container";
import Center from "@/components/center/Center";
import Input from "@/components/inputs/Input";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Link from "next/link";

import clsx from "clsx";
import style from './notice.module.css'

import { SelectBox } from "./client";
import ChoiceChild from "@/components/choice/ChoiceChild";
import ChoiceGroup from "@/components/choice/ChoiceGroup";

export default async function () {

   const cart = [
      {
         title: '여성용) 핑크색 일본 st 로제 베일 가운',
         thumbnail: '/resources/images/dummy_img/product_07.png',
         brand: '푸푸토이',
         price: '20,000',
         option: [
            {title: '여성용) 핑크색 일본 컬러 레드', price: '0'},
            {title: '여성용) 핑크색 일본 1+1 증정', price: '1,000'},
         ],
         delivery: '/resources/icons/cart/cj_icon.png',
      },
      {
         title: '여성용) 핑크색 일본 st 로제 베일 가운',
         thumbnail: '/resources/images/dummy_img/product_07.png',
         brand: '푸푸토이',
         price: '20,000',
         option: [
            {title: '여성용) 핑크색 일본 컬러 레드', price: '0'},
            {title: '여성용) 핑크색 일본 1+1 증정', price: '1,000'},
         ],
         delivery: '/resources/icons/cart/cj_icon.png',
      }
   ]

   return (
      <>
         <Container className={clsx('desktop_container', style.container)} marginTop={50}>
            
         </Container>
      </>
   )


}