// app/.../map/client.tsx
"use client";

import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import P from "@/components/P/P";
import { GoogleMap, OverlayView, useLoadScript } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import styles from "./page.module.css";
import Div from "@/components/div/Div";
import useData from "@/shared/hooks/data/useData";
import clsx from "clsx";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;

const PAGE_SIZE = 12;
const key = "offlineStore";

type OfflineStoreDetailProps = {
    storeId: string;
};

function OfflineStoreDetail({ storeId }: OfflineStoreDetailProps) {
    const detailKey = `offline-store:${storeId}`;

    const { [detailKey]: offlineStore } = useData(
        detailKey,
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
        <VerticalFlex gap={12} >
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
    const listItemRefs = useRef<HTMLDivElement[]>([]);

    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
    const [center, setCenter] = useState(() => {
        const first = initOfflineStore?.content?.[0] as any;
        if (first?.lat && first?.lng) {
            return { lat: Number(first.lat), lng: Number(first.lng) };
        }
        return { lat: 37.5665, lng: 126.978 };
    });


    // 구글맵 api 훅
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    const {
        [key]: pageData,
        page,
        setPage,
        maxPage,
    } = usePageData(
        key,
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

    if (loadError) {
        return <div>지도를 불러오는 중 오류가 발생했습니다.</div>;
    }

    if (!isLoaded) {
        return <div>지도를 불러오는 중입니다...</div>;
    }

    return (
        <Container>
            <HorizontalFlex backgroundColor={"#fff"}>
                <FlexChild width={"10%"}>
                    <Div
                        padding={"16px"}
                        overflowY={"auto"}
                        borderRight={"1px solid #eee"}
                    >
                        <VerticalFlex>
                            <FlexChild>
                                <P color={"black"}>매장 목록</P>
                            </FlexChild>

                            {offlineStores.map((store: any, idx: number) => (
                                <Div
                                    key={store.id}
                                    Ref={(el: HTMLDivElement | null) => {
                                        if (el) listItemRefs.current[idx] = el;
                                    }}
                                    className={styles.storeItem}
                                    padding={"10px 8px"}
                                    marginBottom={"8px"}
                                    borderRadius={"8px"}
                                    cursor={"pointer"}
                                    onClick={() => selectStore(store, idx)}
                                >
                                    <P>{store.name}</P>
                                    <P color={"#666"}>{store.address}</P>
                                    <P color={"#888"}>
                                        영업시간 : {store?.metadata?.businessHours}
                                    </P>
                                    <P>{store?.status === "operating" && "영업중"}</P>
                                    <P>{store?.status === "maintenance" && "점검중"}</P>
                                </Div>
                            ))}

                            {offlineStores.length === 0 && (
                                <P>등록된 오프라인 매장이 없습니다.</P>
                            )}
                        </VerticalFlex>
                    </Div>
                </FlexChild>
                {selectedStoreId && (
                    <FlexChild width={"10%"}>
                        <Div padding={"16px"} borderTop={"1px solid #eee"}>
                            <OfflineStoreDetail storeId={selectedStoreId} />
                        </Div>
                    </FlexChild>
                )}
                <FlexChild width={"85%"}>
                    <VerticalFlex>
                        <Div height={"80vh"}>
                            <GoogleMap
                                center={center}
                                zoom={14}
                                options={{
                                    disableDefaultUI: true,
                                    streetViewControl: false,
                                    zoomControl: true,
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
                                        >
                                            <Div
                                                className={clsx(
                                                    styles.markerBubble,
                                                    isActive && styles.markerBubbleActive
                                                )}
                                                onClick={() => selectStore(store, offlineStores.indexOf(store))}
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
        </Container >
    );
}
