"use client";

import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import { useNiceModal } from "@/providers/ModalProvider/ModalProviderClient";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CSSProperties,
  Dispatch,
  JSX,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./header.module.css";

interface Nav {
  name: string;
  to?: string;
  icon?: JSX.Element | string;
}
interface NavParent extends Nav {
  navs?: Nav[];
  path?: string;
}
const SidebarNav: NavParent[] = [
  {
    name: "홈",
    to: "/",
    icon: "/resources/images/sideNav_home.png",
  },
  {
    name: "전자문서 관리",
    path: "/contract",
    navs: [
      {
        name: "계약 관리",
        to: "/",
        icon: "",
      },
    ]
  },
];

export default function ({
  headerHeight,
}: {
  headerHeight: CSSProperties["height"];
}) {
  const { modal } = useNiceModal();
  const [openFix, setOpenFix] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const pathname = usePathname();
  const [sidebar, setSideBar] = useState(
    SidebarNav?.filter((f) => !!f.path).find((f) =>
      pathname.startsWith(f.path || "")
    )?.name || ""
  );
  const closeRef = useRef<any>(null);
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const open = 10;
      const close = 350;
      if (modal) {
        setIsOpen(false);
        return;
      }
      if (event.clientX <= open && !isOpen) {
        setIsOpen(true);
      } else if (event.clientX > close && isOpen) {
        setIsOpen(false);
      }
    };
    if (modal) setIsOpen(false);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isOpen, modal]);
  return (
    <>
      <Div onClick={() => setOpenFix((prev) => !prev)}>
        <Image
          src={
            openFix || isOpen || hover
              ? "/resources/images/hamburgerBtnRed.png"
              : "/resources/images/hamburgerBtn.png"
          }
          cursor="pointer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      </Div>
      {
        <VerticalFlex
          height={`calc(100dvh - ${
            typeof headerHeight === "number"
              ? `${headerHeight}px`
              : headerHeight
          })`}
          width={isOpen || openFix ? 300 : 0}
          top={headerHeight}
          className={clsx(styles.sidebar, {
            [styles.toggle]: isOpen || openFix,
          })}
          onMouseEnter={() => {
            if (closeRef.current) clearTimeout(closeRef.current);
          }}
          onMouseLeave={() => {
            closeRef.current = setTimeout(() => {
              setIsOpen(false);
            }, 1000 * 1);
          }}
        >
          {SidebarNav?.map((nav, index) => (
            <NavListComponent
              key={`sidebar_${index}`}
              nav={nav}
              index={index}
              sidebar={sidebar}
              setSideBar={setSideBar}
              pathname={pathname}
            />
          ))}
        </VerticalFlex>
      }
    </>
  );
}
const NavListComponent = ({
  nav,
  index,
  sidebar,
  setSideBar,
  pathname,
}: {
  nav: NavParent;
  index: number;
  sidebar: string;
  setSideBar: Dispatch<SetStateAction<string>>;
  pathname: string;
}) => {
  if (!nav.navs || nav.navs?.length === 0)
    return (
      <NavCompnent nav={nav} className={styles.navItem} pathname={pathname} />
    );

  const display = (
    <HorizontalFlex
      cursor="pointer"
      justifyContent="flex-start"
      onClick={() => setSideBar((prev) => (prev === nav.name ? "" : nav.name))}
    >
      {nav?.icon &&
        (typeof nav?.icon === "string" ? (
          <Image src={nav.icon} className={styles.icon} />
        ) : (
          nav.icon
        ))}
      <P>{nav.name}</P>
      <Image
        src={
          nav.name === sidebar
            ? "/resources/images/minusWhite.png"
            : "/resources/images/plusWhite.png"
        }
        className={styles.icon}
        marginLeft={"auto"}
      />
    </HorizontalFlex>
  );
  return (
    <FlexChild className={styles.navList}>
      <VerticalFlex>
        <FlexChild className={styles.navHeader}>
          {nav.to ? <Link href={nav.to}>{display}</Link> : <>{display}</>}
        </FlexChild>
        <FlexChild>
          <VerticalFlex className={styles.navChildren}>
            {(sidebar === nav.name || sidebar === "*") &&
              nav.navs.map((child, idx) => (
                <NavCompnent
                  key={`sidebar_${index}_${idx}`}
                  nav={child}
                  className={styles.navChild}
                  pathname={pathname}
                  path={nav.path}
                />
              ))}
          </VerticalFlex>
        </FlexChild>
      </VerticalFlex>
    </FlexChild>
  );
};
const NavCompnent = ({
  nav,
  className,
  pathname,
  path = "",
}: {
  nav: Nav;
  className: React.HTMLAttributes<HTMLElement>["className"];
  pathname: string;
  path?: string;
}) => {
  const display = (
    <HorizontalFlex justifyContent="flex-start">
      {nav?.icon &&
        (typeof nav?.icon === "string" ? (
          <Image src={nav.icon} className={styles.icon} />
        ) : (
          nav.icon
        ))}
      <P>{nav.name}</P>
    </HorizontalFlex>
  );

  const combine = (path: string, to?: string) => {
    const combine = `${path ? `/${path}` : ""}/${to}`.replaceAll("//", "/");
    if (combine.endsWith("/")) return combine.slice(0, combine.length - 1);
    return combine;
  };

  return (
    <FlexChild
      className={clsx(className, {
        [styles.selected]: pathname === combine(path, nav.to),
      })}
    >
      {nav.to ? (
        <Link href={combine(path, nav.to)}>{display}</Link>
      ) : (
        <>{display}</>
      )}
    </FlexChild>
  );
};
