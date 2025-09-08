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
import style from './page.module.css'
import boardStyle from '../../boardGrobal.module.css'

import { SelectBox } from "./client";
import ChoiceChild from "@/components/choice/ChoiceChild";
import ChoiceGroup from "@/components/choice/ChoiceGroup";

import BoardHeader from './boardHeader'
import NoticeBoard from './notice/notice'
import InquiryBoard from './inquiry/inquiry'
import EventBoard from './event/event'


import PhotoReview from './(community)/photoReview/photoReview'

export default async function BoardPage({params} : { params: {boardType: string}}) {

   return (
      <>
         {
            params.boardType !== 'photoReview' && (
               <BoardHeader />
            )
         }
         {
            params.boardType === 'notice' && (
               <NoticeBoard />
            )
         }
         {
            params.boardType === 'photoReview' && (
               <PhotoReview />
            )
         }
         {
            params.boardType === 'inquiry' && (
               <InquiryBoard />
            )
         }
         {
            params.boardType === 'event' && (
               <EventBoard />
            )
         }
      </>
   )


}