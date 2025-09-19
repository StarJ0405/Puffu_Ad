"use client";
import Button from "@/components/buttons/Button";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import TopButton from "@/components/buttons/TopButton";
import styles from "./footer.module.css";
import Link from "next/link";
import clsx from "clsx";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import NiceModal, { useModal } from "@ebay/nice-modal-react";
import ModalBase from "@/modals/ModalBase";
// import AdminChatModal from "@/modals/adminChat/adminChat";
import { useState, useEffect } from "react";
import FlexChild from "@/components/flex/FlexChild";
import AdminChat from "@/modals/adminChat/adminChat";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";

