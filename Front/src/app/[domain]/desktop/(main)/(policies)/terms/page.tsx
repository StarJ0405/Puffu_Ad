import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import Link from "next/link";
import clsx from "clsx";
import style from './page.module.css';
import TermContent from '@/components/agreeContent/TermContent'
import PrivacyContent from "@/components/agreeContent/privacyContent";


export default async function () {

  return (
    <section className='root desktop_container'>
      <FlexChild paddingTop={60}>
         <TermContent size={10} />
         <PrivacyContent size={10} />
      </FlexChild>
    </section>
  )
}
