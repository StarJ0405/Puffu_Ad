"use client";
import CouponItemMobile from "@/components/coupon/couponItemMobile";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import ListPagination from "@/components/listPagination/ListPagination";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import { useMemo, useState, useRef, useEffect } from "react";
import mypage from "../mypage.module.css";
import styles from "./page.module.css";
import clsx from "clsx";
import Image from "@/components/Image/Image";



