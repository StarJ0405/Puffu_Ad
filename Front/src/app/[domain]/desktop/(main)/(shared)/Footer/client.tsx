"use client";
import Image from "@/components/Image/Image";
import Button from "@/components/buttons/Button";
import TopButton from "@/components/buttons/TopButton";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Link from "next/link";
import styles from "./footer.module.css";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import FlexChild from "@/components/flex/FlexChild";
import AdminChat from "@/modals/adminChat/adminChat";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { useState } from "react";


