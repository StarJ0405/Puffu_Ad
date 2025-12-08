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
import Input from "@/components/inputs/Input";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;


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

export function MapFrame({ initOfflineStore, initCondition }: { initOfflineStore: Pageable, initCondition: any }) {
    const { userData } = useContext(AuthContext);
    const listItemRefs = useRef<HTMLDivElement[]>([]);

    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
    const [toggle, setToggle] = useState(false);
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [recentStores, setRecentStores] = useState<any[]>([]);
    const [q, setQ] = useState(initCondition.q ?? "");


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



    const {
        offlineStore: pageData,
        page,
        setPage,
        maxPage,
        mutate,
    } = usePageData(
        "offlineStore",
        (pageNumber) => ({
            pageNumber,
        }),
        (cond) => {
            const pageNumber = cond.pageNumber ?? 0;

            const finalCond: any = {
                ...initCondition,
                pageNumber,
            };

            if (q && q.trim()) {
                finalCond.q = q.trim();
            } else {
                delete finalCond.q;
            }

            return requester.getOfflineStores(finalCond);
        },
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

    useEffect(() => {
        if (!offlineStores || offlineStores.length === 0) return;

        if (offlineStores.length === 1) {
            const store = offlineStores[0];
            if (store.lat && store.lng) {
                setCenter({ lat: Number(store.lat), lng: Number(store.lng) });
            }
            return;
        }

        const validStores = offlineStores.filter(
            (s: any) => s.lat && s.lng
        );

        if (validStores.length === 0) return;

        const latSum = validStores.reduce((acc: number, s: any) => acc + Number(s.lat), 0);
        const lngSum = validStores.reduce((acc: number, s: any) => acc + Number(s.lng), 0);

        const avgLat = latSum / validStores.length;
        const avgLng = lngSum / validStores.length;

        setCenter({ lat: avgLat, lng: avgLng });
    }, [offlineStores]);







    const handleSearch = () => {
        if (page !== 0) {
            setPage(0);
        } else {
            mutate();
        }
    };

    const selectStore = (store: any, index: number) => {
        if (store.lat && store.lng) {
            setCenter({ lat: Number(store.lat), lng: Number(store.lng) });
        }
        setSelectedStoreId(store.id);
        if (index >= 0) {
            listItemRefs.current.forEach((el) => {
                if (!el) return;
                el.classList.remove(styles.activeStoreItem);
            });
            const listEl = listItemRefs.current[index];
            if (listEl) {
                listEl.classList.add(styles.activeStoreItem);
            }
        }
    };





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
            <VerticalFlex>

                <FlexChild>
                    <HorizontalFlex >
                        <FlexChild className={styles.sidebar} width="320px">
                            <Div
                                padding="16px"
                                overflowY="auto"
                                borderRight="1px solid #eee"
                                height="100%"
                            >
                                <VerticalFlex gap={16}>
                                    <FlexChild>
                                        <Input
                                            type="search"
                                            value={q}
                                            onChange={(v) => setQ(v as string)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    if (page !== 0) {
                                                        setPage(0);
                                                    } else {
                                                        mutate();
                                                    }
                                                }
                                            }}
                                            placeHolder="매장명, 주소 등으로 검색해 주세요."
                                        />
                                    </FlexChild>
                                    <FlexChild>
                                        <button
                                            type="button"
                                            className={styles.searchButton}
                                            onClick={handleSearch}
                                        >
                                            검색
                                        </button>
                                    </FlexChild>
                                    <FlexChild>
                                        <P size={14} color="#666" className={styles.recentStoresLabel}>
                                            최근 이용 매장
                                        </P>
                                        {recentStores.length === 0 && (
                                            <P size={13} color="#aaa">
                                                최근 이용한 매장이 없습니다.
                                            </P>
                                        )}
                                        {recentStores.map((item: any, idx: number) => {
                                            const store = item?.offline_store;
                                            if (!store) return null;
                                            return (
                                                <button
                                                    key={store.id ?? idx}
                                                    type="button"
                                                    className={styles.recentStoreChip}
                                                    onClick={() => {
                                                        selectStore(store, offlineStores.findIndex((s: any) => s.id === store.id));
                                                    }}
                                                >
                                                    {store.name}
                                                </button>
                                            );
                                        })}
                                    </FlexChild>
                                    <FlexChild>
                                        <HorizontalFlex
                                            alignItems="center"
                                            justifyContent="space-between"
                                            className={styles.wishlistHeader}
                                            onClick={() => setToggle((prev) => !prev)}
                                        >
                                            <P size={16} weight={600}>
                                                관심 매장
                                            </P>
                                            <button
                                                type="button"
                                                className={styles.chevronButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setToggle((prev) => !prev);
                                                }}
                                            >
                                                {toggle ? "접기" : "펼치기"}
                                            </button>
                                        </HorizontalFlex>

                                        {toggle && (
                                            <>
                                                {!userData?.id && (
                                                    <Div margin="8px 0 16px" className={styles.loginNotice}>
                                                        <P size={14} color="#999">
                                                            관심 매장을 사용하려면 로그인이 필요합니다.
                                                        </P>
                                                        <button className={styles.loginButton}>
                                                            로그인하기
                                                        </button>
                                                    </Div>
                                                )}

                                                {userData?.id && (
                                                    <Div
                                                        margin="8px 0 16px"
                                                        className={styles.wishlistList}
                                                    >
                                                        {wishlist.length === 0 && (
                                                            <P size={14} color="#888">
                                                                등록된 관심 매장이 없습니다.
                                                            </P>
                                                        )}
                                                        {wishlist.map((item, idx) => (
                                                            <Div
                                                                key={item.offline_store?.id ?? idx}
                                                                padding="10px 8px"
                                                                borderRadius="8px"
                                                                cursor="pointer"
                                                                className={styles.wishlistItem}
                                                                onClick={() => {
                                                                    const wishlistStore = item.offline_store;
                                                                    if (!wishlistStore?.id) return;
                                                                    const storeIndex = offlineStores.findIndex(
                                                                        (s: any) => s.id === wishlistStore.id
                                                                    );

                                                                    if (storeIndex >= 0) {
                                                                        selectStore(offlineStores[storeIndex], storeIndex);
                                                                    } else {
                                                                        selectStore(wishlistStore, -1);
                                                                    }
                                                                }}
                                                            >
                                                                <P weight={500}>{item.offline_store?.name}</P>
                                                                <P color="#666" size={13}>
                                                                    {item.offline_store?.address}
                                                                </P>
                                                            </Div>
                                                        ))}

                                                    </Div>
                                                )}
                                            </>
                                        )}
                                    </FlexChild>

                                    {/* 매장 목록 */}
                                    <FlexChild>
                                        <P size={15} weight={600} className={styles.storeListTitle}>
                                            매장 목록
                                        </P>
                                        <Div className={styles.storeList}>
                                            {offlineStores.map((store: any, idx: number) => {
                                                const inWishlist = wishlist.some(
                                                    (item) => item?.offline_store?.id === store.id
                                                );
                                                const isActive = selectedStoreId === store.id;

                                                return (
                                                    <Div
                                                        key={store.id}
                                                        Ref={(el: HTMLDivElement | null) => {
                                                            if (el) listItemRefs.current[idx] = el;
                                                        }}
                                                        padding="10px 8px"
                                                        borderRadius="10px"
                                                        cursor="pointer"
                                                        className={clsx(
                                                            styles.storeItem,
                                                            isActive && styles.storeItemActive
                                                        )}
                                                        onClick={() => selectStore(store, idx)}
                                                    >
                                                        <FlexChild>
                                                            <HorizontalFlex
                                                                alignItems="center"
                                                                justifyContent="space-between"
                                                            >
                                                                <P weight={500}>{store.name}</P>
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
                                                            </HorizontalFlex>
                                                        </FlexChild>
                                                        <FlexChild>
                                                            <P color="#666" size={13}>
                                                                {store.address}
                                                            </P>
                                                        </FlexChild>
                                                        {store?.metadata?.businessHours && (
                                                            <FlexChild>
                                                                <P color="#888" size={12}>
                                                                    영업시간 : {store.metadata.businessHours}
                                                                </P>
                                                            </FlexChild>
                                                        )}
                                                        <FlexChild>
                                                            <P size={12} color="#00a400">
                                                                {store?.status === "operating" && "영업중"}
                                                            </P>
                                                            <P size={12} color="#ff9800">
                                                                {store?.status === "maintenance" && "점검중"}
                                                            </P>
                                                        </FlexChild>
                                                    </Div>
                                                );
                                            })}

                                            {offlineStores.length === 0 && (
                                                <P size={14} color="#999" style={{ marginTop: 8 }}>
                                                    등록된 오프라인 매장이 없습니다.
                                                </P>
                                            )}
                                        </Div>
                                    </FlexChild>
                                </VerticalFlex>
                            </Div>
                        </FlexChild>
                        {selectedStoreId && (
                            <FlexChild className={styles.detailPanel} width="320px">
                                <Div padding="16px" borderLeft="1px solid #eee">
                                    <OfflineStoreDetail storeId={selectedStoreId} />
                                </Div>
                            </FlexChild>
                        )}
                        <FlexChild className={styles.mapArea}>
                            <VerticalFlex>
                                <Div>
                                    <GoogleMap
                                        zoom={15}
                                        mapContainerStyle={{
                                            width: "100%",
                                            height: "60vh",
                                        }}
                                        center={center}
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
                                                    getPixelPositionOffset={(
                                                        width: number,
                                                        height: number
                                                    ) => ({
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
                </FlexChild>
            </VerticalFlex>
        </Container>
    );

}
