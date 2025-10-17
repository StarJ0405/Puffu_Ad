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
    name: "문의 관리",
    path: "/qa",
    navs: [
      {
        name: "관리자 채팅",
        to: "/chat",
        icon: "/resources/images/sideNav_chat_admin.png",
      },
      {
        name: "문의 관리",
        to: "/inquiry",
        icon: "/resources/images/sideNav_chat_admin.png",
      },
    ],
  },
  {
    name: "주문관리",
    path: "/order",
    navs: [
      // {
      //   name: "주문관리",
      //   to: "/",
      //   icon: "/resources/images/sideNav_order_management.png",
      // },
      {
        name: "전체주문 조회",
        to: "/management",
        icon: "/resources/images/sideNav_order_search.png",
      },
      {
        name: "입금 대기중",
        to: "/management/awaiting",
        icon: "/resources/images/sideNav_order_payment_awaiting.png",
      },
      {
        name: "상품 준비중",
        to: "/management/product",
        icon: "/resources/images/sideNav_order_ready.png",
      },
      {
        name: "배송대기",
        to: "/management/ready",
        icon: "/resources/images/sideNav_order_awaiting.png",
      },
      {
        name: "배송중",
        to: "/management/shipping",
        icon: "/resources/images/sideNav_order_shipped.png",
      },
      {
        name: "배송완료",
        to: "/management/completed",
        icon: "/resources/images/sideNav_order_completed.png",
      },
      {
        name: "주문 취소",
        to: "/management/cancel",
        icon: "/resources/images/sideNav_order_cancel.png",
      },
      {
        name: "상품 교환",
        to: "/management/exchange",
        icon: "/resources/images/sideNav_order_change.png",
      },
      {
        name: "환불",
        to: "/management/refund",
        icon: "/resources/images/sideNav_order_refund.png",
      },
    ],
  },
  {
    name: "상품관리",
    path: "/product",
    navs: [
      {
        name: "대시보드",
        to: "/",
        icon: "/resources/images/sideNav_product_management.png",
      },
      {
        name: "조회 및 관리",
        to: "/management",
        icon: "/resources/images/sideNav_product_serach.png",
      },
      {
        name: "상품등록",
        to: "/regist",
        icon: "/resources/images/sideNav_product_add.png",
      },
      {
        name: "재고관리",
        to: "/stock",
        icon: "/resources/images/sideNav_product_stock.png",
      },
      {
        name: "프로모션 등록",
        to: "/promotion/regist",
        icon: "/resources/images/sideNav_promotion_add.png",
      },
      {
        name: "프로모션 조회 및 관리",
        to: "/promotion/management",
        icon: "/resources/images/sideNav_promotion_search.png",
      },
      {
        name: "쿠폰 등록",
        to: "/coupon/regist",
        icon: "/resources/images/sideNav_coupon_add.png",
      },
      {
        name: "쿠폰 조회 및 관리",
        to: "/coupon/management",
        icon: "/resources/images/sideNav_coupon_search.png",
      },
      {
        name: "구독 등록",
        to: "/subscribe/regist",
        icon: "/resources/images/sideNav_subscribe_add.png",
      },
      {
        name: "구독 조회 및 관리",
        to: "/subscribe/management",
        icon: "/resources/images/sideNav_subscribe_search.png",
      },
    ],
  },
  {
    name: "입점사 관리",
    path: "/brand",
    navs: [
      {
        name: "조회 및 관리",
        to: "/management",
        icon: "/resources/images/sideNav_brand_management.png",
      },
      {
        name: "입점사 등록",
        to: "/regist",
        icon: "/resources/images/sideNav_brand_add.png",
      },
    ],
  },
  {
    name: "스토어 관리",
    path: "/store",
    navs: [
      {
        name: "조회 및 관리",
        to: "/management",
        icon: "/resources/images/sideNav_store_management.png",
      },
      {
        name: "스토어등록",
        to: "/regist",
        icon: "/resources/images/sideNav_store_add.png",
      },
      {
        name: "배너 관리",
        to: "/banners/management",
        icon: "/resources/images/sideNav_banner_search.png",
      },
      {
        name: "배너 등록",
        to: "/banners/regist",
        icon: "/resources/images/sideNav_banner_add.png",
      },
      {
        name: "공지 관리",
        to: "/notices/management",
        icon: "/resources/images/sideNav_notice_add.png",
      },
      {
        name: "공지 등록",
        to: "/notices/regist",
        icon: "/resources/images/sideNav_notice_search.png",
      },
    ],
  },
  {
    name: "회원 관리",
    path: "/user",
    navs: [
      {
        name: "대시보드",
        to: "/",
        icon: "/resources/images/sideNav_member_profile.png",
      },
      {
        name: "조회 및 관리",
        to: "/management",
        icon: "/resources/images/sideNav_member_search.png",
      },
    ],
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
