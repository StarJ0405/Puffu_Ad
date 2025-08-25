"use client";
import stringify from "json-stable-stringify";
import { useState } from "react";
import useSWR from "swr";
import {
  Middleware,
  PublicConfiguration,
  Revalidator,
  RevalidatorOptions,
  SWRConfiguration,
} from "swr/_internal";

/*
 * ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
 * ※ swr을 사용하여 기존 기능과 융합하여 사용할 수 있도록 가공한 기능  ※
 * ※ 기본적인 내용은 swr 공식 문서를 참조하여 익히길 바람             ※
 * ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
 *
 * 페이징 버전
 */

export interface SWRPageOption {
  refresh?: {
    revalidateOnFocus?: boolean; // 브라우저 창이나, 탭이 포커스시 데이터 재로딩 여부
    focusThrottleInterval?: number; // revalidateOnFocus일 때 해당 ms 이내에는 재검증 요청 비활성, 기본값 5000
    revalidateOnReconnect?: boolean; // 네트워크 재연결시 자동으로 재검증 여부
    refreshInterval?: number; // 자동 재검증 주기, ms단위로 0은 재검증 비활성, 기본값 0
    loadingTimeout?: number; // 데이터 로딩이 해당 ms초과시 onLoadingSLow 함수 호출, 기본값 3000
    onLoadingSlow?: (
      key: string,
      condition: any,
      config: Readonly<PublicConfiguration>
    ) => void;
    // keepPreviousData?: boolean; // 데이터 재호출시 변경전까지 데이터 유지 여부, false 시 깜빡임 현상, loading으로 로딩처리는 값에 영향 없음, 반드시 필수, 페이징시 자동으로 fallbackData가 보이므로 굳이 false할 이유가 없음
    suspense?: boolean; // 해당 컴포넌트에서 데이터 로딩시 suspense처리되게 하는 설정, 당연히 컴포넌트 상위에 Suspense 처리는 해야함
  };
  cache?: {
    revalidateIfStale?: boolean; // 오래된 캐시를 자동으로 재검증할지에 대한 여부
    shouldRetryOnError?: boolean; // fetcher 에러시 발생시 재시도 여부
    errorRetryInterval?: number; // 에러 발생시 ms단위로 재시도, 기본값 5000
    errorRetryCount?: number; // 에러시 재시도 최대 횟수, undefined는 무한시도
    compare?: (a: any | undefined, b: any | undefined) => boolean; // 캐싱을 비교하는 함수로 기본은 얕은 비교
    dedupingInterval?: number; // 같은 key에 대한 요청을 제거하는 시간, 해당 시간안에는 여러 요청도 한번의 요청으로 인식, 기본값 2000
  };
  callback?: {
    onSuccess?: (
      // 성공시 발생하는 함수
      data: any,
      key: string,
      condition: any,
      config: Readonly<PublicConfiguration>
    ) => void;
    onError?: (
      // 오류시 발생하는 함수
      err: Error,
      key: string,
      condition: any,
      config: Readonly<PublicConfiguration>
    ) => void;
    onErrorRetry?: (
      // 오류 재시도시 발생하는 함수
      err: Error,
      key: string,
      condition: any,
      config: Readonly<PublicConfiguration>,
      revalidate: Revalidator,
      revalidateOps: Required<RevalidatorOptions>
    ) => void;
    onDiscarded?: (key: string, condition: any) => void; // 페기된 요청에 대한 처리
  };
  use?: Middleware[];
  pause?: boolean; // 요청 및 재검증 중단 여부
  fallbackData?: any; // 초기 데이터 값
  onReprocessing?: (data: any) => any; // 요청된 결과값을 가공해서 출력하는 방법, 예시) 결과값 : {items, count, offset, limit}일때 내부 items만 필요한경우
  revalidateOnMount?: boolean; // 최초 로딩 여부
}

function usePageData(
  key: string,
  condition: (page: number) => any,
  method: (condition: any) => any | Promise<any>,
  onMaxPage: (data: any) => number,
  option?: SWRPageOption
) {
  const [page, setPage] = useState(0);
  const _option: SWRConfiguration & { pause?: boolean } = {
    keepPreviousData: true,
  };
  if (option?.refresh) {
    const refresh = option.refresh;
    if (refresh.revalidateOnFocus)
      _option.revalidateOnFocus = refresh.revalidateOnFocus;

    if (refresh?.focusThrottleInterval)
      _option.focusThrottleInterval = refresh.focusThrottleInterval;
    if (refresh?.focusThrottleInterval)
      _option.revalidateOnReconnect = refresh.revalidateOnReconnect;
    if (refresh?.refreshInterval)
      _option.refreshInterval = refresh.refreshInterval;
    if (refresh?.loadingTimeout)
      _option.loadingTimeout = refresh.loadingTimeout;
    if (refresh?.onLoadingSlow)
      _option.onLoadingSlow = (_key, config) => {
        refresh.onLoadingSlow?.(
          key,
          JSON.parse(_key.replace(`${key}_`, "")),
          config
        );
      };
    if (refresh?.suspense) _option.suspense = refresh.suspense;
  }
  if (option?.cache) {
    const cache = option.cache;
    if (cache?.revalidateIfStale)
      _option.revalidateIfStale = cache.revalidateIfStale;
    if (cache?.shouldRetryOnError)
      _option.shouldRetryOnError = cache.shouldRetryOnError;
    if (cache?.errorRetryInterval)
      _option.errorRetryInterval = cache.errorRetryInterval;
    if (cache?.errorRetryCount) _option.errorRetryCount = cache.errorRetryCount;
    if (cache?.compare) _option.compare = cache?.compare;
    if (cache?.dedupingInterval)
      _option.dedupingInterval = cache.dedupingInterval;
  }
  if (option?.callback) {
    const callback = option.callback;
    if (callback?.onSuccess)
      _option.onSuccess = (data, _key, config) =>
        callback.onSuccess?.(
          data,
          key,
          JSON.parse(_key.replace(`${key}_`, "")),
          config
        );

    if (callback?.onError)
      _option.onError = (err, _key, config) =>
        callback.onError?.(
          err,
          key,
          JSON.parse(_key.replace(`${key}_`, "")),
          config
        );

    if (callback?.onErrorRetry)
      _option.onErrorRetry = (err, _key, config, revalidate, revalidateOps) =>
        callback.onErrorRetry?.(
          err,
          key,
          JSON.parse(_key.replace(`${key}_`, "")),
          config,
          revalidate,
          revalidateOps
        );

    if (callback?.onDiscarded)
      _option.onDiscarded = (_key) =>
        callback.onDiscarded?.(key, JSON.parse(_key.replace(`${key}_`, "")));
  }
  if (option?.fallbackData) _option.fallbackData = option.fallbackData;
  if (option?.use) _option.use = option.use;
  if (option?.pause) _option.pause = option.pause;
  if (option?.revalidateOnMount)
    _option.revalidateOnMount = option.revalidateOnMount;
  else if (option?.fallbackData) _option.revalidateOnMount = false;
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `${key}_${stringify(condition(page))}`,
    () => method?.(condition(page)),
    _option
  );
  const maxPage = Math.max((onMaxPage?.(data) || 0) - 1, 0);
  return {
    [key]: option?.onReprocessing ? option?.onReprocessing(data) : data,
    origin: data,
    error,
    isLoading: isLoading || isValidating,
    mutate, // 인자 없는 경우 해당 요소 리로딩, key값 부여시 전역 리로딩
    page,
    setPage: (page: number) => setPage(Math.min(page, maxPage)),
    maxPage: maxPage,
    hasNext: page < maxPage,
  };
}

export default usePageData;
