// app/.../map/client.tsx
"use client";

import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import P from "@/components/P/P";
import { GoogleMap, OverlayView, useLoadScript } from "@react-google-maps/api";
import { useContext, useEffect, useRef, useState } from "react";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import styles from "./page.module.css";
import Div from "@/components/div/Div";
import useData from "@/shared/hooks/data/useData";
import clsx from "clsx";
import Image from "@/components/Image/Image";
import { AuthContext } from "@/providers/AuthPorivder/AuthPorivderClient";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;
const PAGE_SIZE = 12;


type OfflineStoreDetailProps = {
    storeId: string;
};

function OfflineStoreDetail({ storeId }: OfflineStoreDetailProps) {
    const { offlineStore } = useData(
        "offlineStore",
        { id: storeId },
        (cond) => {
            const { id, ...query } = cond;
            return requester.getOfflineStore(id, query);
        },
        {
            onReprocessing: (res: any) => res?.content ?? null,
            fallbackData: null,
            revalidateOnMount: true,
        }
    );

    if (!offlineStore) {
        return <P>매장 정보를 불러오는 중입니다...</P>;
    }

    const store = offlineStore as any;

    return (
        <VerticalFlex gap={12}>
            <FlexChild>
                <P size={18} weight={600}>
                    {store.name}
                </P>
            </FlexChild>
            <FlexChild>
                <P size={14} color="#666">
                    {store.address}
                </P>
            </FlexChild>
            <FlexChild>
                {store?.metadata?.businessHours && (
                    <P size={14} color="#888">
                        영업시간 : {store.metadata.businessHours}
                    </P>
                )}
            </FlexChild>
            <FlexChild>
                {store?.metadata?.phone && (
                    <P size={14} color="#888">
                        전화번호 : {store.metadata.phone}
                    </P>
                )}
            </FlexChild>
            <FlexChild>
                {store?.metadata?.description && (
                    <P size={14} color="#aaa" lineHeight={1.6}>
                        {store.metadata.description}
                    </P>
                )}
            </FlexChild>
        </VerticalFlex>
    );
}

export function MapFrame({ initOfflineStore }: { initOfflineStore: Pageable }) {
    const { userData } = useContext(AuthContext);
    const listItemRefs = useRef<HTMLDivElement[]>([]);

    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
    const [toggle, setToggle] = useState(false);
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [recentStores, setRecentStores] = useState<any[]>([]);

    const [center, setCenter] = useState(() => {
        const first = initOfflineStore?.content?.[0] as any;
        if (first?.lat && first?.lng) {
            return { lat: Number(first.lat), lng: Number(first.lng) };
        }
        return { lat: 37.5665, lng: 126.978 }; // 임시
    });

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    const {
        "offlineStore": pageData,
        page,
        setPage,
        maxPage,
    } = usePageData(
        "offlineStore",
        (pageNumber) => ({
            pageSize: PAGE_SIZE,
            pageNumber,
        }),
        (cond) => requester.getOfflineStores(cond),
        (d: Pageable) => Math.max(0, Number(d?.totalPages ?? 0) - 1),
        {
            onReprocessing: (d: any) => {
                const content = Array.isArray(d) ? d : d?.content ?? [];
                const total = Number(
                    (!Array.isArray(d) &&
                        (d.NumberOfTotalElements ?? d.totalElements ?? d.total)) ??
                    content.length
                );
                return { content, total };
            },
            fallbackData: {
                content: initOfflineStore?.content ?? [],
                total: initOfflineStore?.NumberOfTotalElements ?? 0,
                totalPages: initOfflineStore?.totalPages ?? 0,
            },
            revalidateOnMount: true,
        }
    );

    const offlineStores = pageData?.content ?? [];

    const selectStore = (store: any, index: number) => {
        if (store.lat && store.lng) {
            setCenter({ lat: Number(store.lat), lng: Number(store.lng) });
        }
        setSelectedStoreId(store.id);
        listItemRefs.current.forEach((el) => {
            if (!el) return;
            el.classList.remove(styles.activeStoreItem);
        });
        const listEl = listItemRefs.current[index];
        if (listEl) {
            listEl.classList.add(styles.activeStoreItem);
        }
    };

    useEffect(() => {
        if (!userData?.id) {
            setWishlist([]);
            return;
        }
        requester.getStoreWishlist(
            {
                pageSize: 12,
                pageNumber: 0,
                relations: ["offline_store"],
            },
            (res: any) => {
                setWishlist(res?.content);
            }
        );
    }, [userData?.id]);

    useEffect(() => {
        requester.getRecentStores(
            { relations: ["offline_store"] },
            (res: any) => {
                setRecentStores(res?.content);
            }
        );
    }, []);


    const createWishlist = async (store: any) => {
        if (!userData?.id) return;

        const storeId = store.id as string;
        const exists = wishlist.some(
            (item) => item?.offline_store?.id === storeId
        );
        if (exists) return;

        try {
            const res = await requester.createStoreWishlist(storeId, {
                offline_store_id: storeId,
                metadata: {},
                return_data: true,
            });
            if (res?.content) {
                setWishlist((prev) => [
                    { ...res.content, offline_store: store },
                    ...prev,
                ]);
            }
        } catch (e) { }
    };

    const deleteWishlist = async (store: any) => {
        if (!userData?.id) return;

        const storeId = store.id as string;
        const target = wishlist.find(
            (item) => item?.offline_store?.id === storeId
        );
        if (!target) return;

        const wishlistId = target.id as string;

        setWishlist((prev) =>
            prev.filter((item) => item?.offline_store?.id !== storeId)
        );

        try {
            await requester.deleteStoreWishlist(wishlistId);
        } catch (e) {
            setWishlist((prev) => [target, ...prev]);
        }
    };

    if (loadError) {
        return <div>지도를 불러오는 중 오류가 발생했습니다.</div>;
    }

    if (!isLoaded) {
        return <div>지도를 불러오는 중입니다...</div>;
    }

    return (
        <Container>
            <HorizontalFlex backgroundColor="#fff">
                <FlexChild width="10%">
                    <Div
                        padding="16px"
                        overflowY="auto"
                        borderRight="1px solid #eee"
                    >
                        <VerticalFlex>
                            <FlexChild>
                                <HorizontalFlex
                                    alignItems="center"
                                    justifyContent="space-between"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setToggle((prev) => !prev)}
                                >
                                    <P size={16} weight={600}>
                                        관심매장
                                    </P>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setToggle((prev) => !prev);
                                        }}
                                    >
                                        버튼
                                    </button>
                                </HorizontalFlex>

                                {toggle && (
                                    <>
                                        {!userData?.id && (
                                            <Div margin="8px 0 16px">
                                                <P size={14} color="#999">
                                                    로그인이 필요해요
                                                </P>
                                                <button>로그인하기</button>
                                            </Div>
                                        )}

                                        {userData?.id && (
                                            <Div margin="8px 0 16px">
                                                {wishlist.length === 0 && (
                                                    <P size={14} color="#888">
                                                        관심매장이 없습니다.
                                                    </P>
                                                )}
                                                {wishlist.map((item, idx) => (
                                                    <Div
                                                        key={item.offline_store?.id}
                                                        padding="10px 8px"
                                                        borderRadius="8px"
                                                        cursor="pointer"
                                                        onClick={() =>
                                                            selectStore(item.offline_store, idx)
                                                        }
                                                    >
                                                        <P>{item.offline_store.name}</P>
                                                        <P color="#666">
                                                            {item.offline_store.address}
                                                        </P>
                                                    </Div>
                                                ))}
                                            </Div>
                                        )}
                                    </>
                                )}
                            </FlexChild>

                            <FlexChild>
                                <P color="black">매장 목록</P>
                            </FlexChild>

                            <FlexChild>
                                <HorizontalFlex>
                                    <FlexChild>
                                        {offlineStores.map((store: any, idx: number) => {
                                            const inWishlist = wishlist.some(
                                                (item) =>
                                                    item?.offline_store?.id === store.id
                                            );

                                            return (
                                                <Div
                                                    key={store.id}
                                                    Ref={(el: HTMLDivElement | null) => {
                                                        if (el) listItemRefs.current[idx] = el;
                                                    }}
                                                    padding="10px 8px"
                                                    borderRadius="8px"
                                                    cursor="pointer"
                                                    onClick={() => selectStore(store, idx)}
                                                >
                                                    <FlexChild>
                                                        <P>{store.name}</P>
                                                    </FlexChild>
                                                    <FlexChild>
                                                        <P color="#666">{store.address}</P>
                                                    </FlexChild>
                                                    <FlexChild>
                                                        <P color="#888">
                                                            영업시간 : {store?.metadata?.businessHours}
                                                        </P>
                                                    </FlexChild>
                                                    <FlexChild>
                                                        <P>
                                                            {store?.status === "operating" && "영업중"}
                                                        </P>
                                                    </FlexChild>
                                                    <FlexChild>
                                                        <P>
                                                            {store?.status === "maintenance" &&
                                                                "점검중"}
                                                        </P>
                                                    </FlexChild>
                                                    <Image
                                                        src={
                                                            inWishlist
                                                                ? "/resources/icons/starIcon.svg"
                                                                : "/resources/icons/emptyStarIcon.svg"
                                                        }
                                                        width={20}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (inWishlist) {
                                                                deleteWishlist(store);
                                                            } else {
                                                                createWishlist(store);
                                                            }
                                                        }}
                                                    />
                                                </Div>
                                            );
                                        })}

                                        {offlineStores.length === 0 && (
                                            <P>등록된 오프라인 매장이 없습니다.</P>
                                        )}
                                    </FlexChild>
                                </HorizontalFlex>
                            </FlexChild>
                        </VerticalFlex>
                    </Div>
                </FlexChild>

                {selectedStoreId && (
                    <FlexChild width="10%">
                        <Div padding="16px" borderTop="1px solid #eee">
                            <OfflineStoreDetail storeId={selectedStoreId} />
                        </Div>
                    </FlexChild>
                )}
                <FlexChild>
                    <P>최근 이용 매장 : </P>
                    {recentStores.map((store) => (
                        <P >{store?.offline_store?.name}</P>
                    ))}
                </FlexChild>

                <FlexChild width="85%">
                    <VerticalFlex>
                        <Div height="80vh" >
                            <GoogleMap

                                center={center}
                                zoom={14}
                                mapContainerStyle={{ width: "100vw", height: "100vh", maxHeight: "60vh" }}
                                options={{
                                    disableDefaultUI: true,
                                    streetViewControl: false,
                                    zoomControl: true,
                                    gestureHandling: "greedy",
                                    scrollwheel: true,
                                }}
                            >
                                {offlineStores.map((store: any) => {
                                    if (!store.lat || !store.lng) return null;

                                    const position = {
                                        lat: Number(store.lat),
                                        lng: Number(store.lng),
                                    };

                                    const isActive = selectedStoreId === store.id;

                                    return (
                                        <OverlayView
                                            key={store.id}
                                            position={position}
                                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                            getPixelPositionOffset={(width: number, height: number) => ({
                                                x: -(width / 2),
                                                y: -height,
                                            })}
                                        >
                                            <Div
                                                className={clsx(
                                                    styles.markerBubble,
                                                    isActive && styles.markerBubbleActive
                                                )}
                                                onClick={() =>
                                                    selectStore(
                                                        store,
                                                        offlineStores.indexOf(store)
                                                    )
                                                }
                                            >
                                                <P size={14}>{store.name}</P>
                                            </Div>
                                        </OverlayView>
                                    );
                                })}
                            </GoogleMap>
                        </Div>
                    </VerticalFlex>
                </FlexChild>
            </HorizontalFlex>
        </Container>
    );
}
