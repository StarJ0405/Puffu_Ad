"use client";

import { RowInterface } from "@/modals/context/ContextMenuModal";
import useInfiniteData from "@/shared/hooks/data/useInfiniteData";
import usePageData from "@/shared/hooks/data/usePageData";
import useClientEffect from "@/shared/hooks/useClientEffect";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import _ from "lodash";
import {
  CSSProperties,
  Dispatch,
  forwardRef,
  JSX,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import CheckboxAll from "../choice/checkbox/CheckboxAll";
import CheckboxChild from "../choice/checkbox/CheckboxChild";
import CheckboxGroup from "../choice/checkbox/CheckboxGroup";
import FlexChild from "../flex/FlexChild";
import HorizontalFlex from "../flex/HorizontalFlex";
import VerticalFlex from "../flex/VerticalFlex";
import Image from "../Image/Image";
import P from "../P/P";
import styles from "./Table.module.css";

interface Styling {
  className?: React.HTMLAttributes<HTMLElement>["className"];
  style?: CSSProperties;
}
export interface Column {
  label?: string;
  code?: string;
  styling?: {
    header?: Styling;
    column?: Styling;
    common?: Styling;
  };
  Label?: ({
    data,
    setCondition,
    index,
  }: {
    data: any;
    setCondition: Dispatch<any>;
    index: number;
  }) => JSX.Element | string;
  Cell?: ({
    row,
    cell,
    index,
  }: {
    row: any;
    cell: any;
    index: number;
  }) => JSX.Element | string;
}
const Table = forwardRef(
  (
    {
      name,
      type = "page",
      indexing = true,
      height,
      maxHeight,
      minHeight,
      initLimit,
      initData,
      initCondition = {},
      columns,
      styling,
      onSearch = () => {},
      onMaxPage = () => 0,
      onReprocessing = (data: any) => data,
      onTableClick,
      onRowClick,
      selectable = true,
      ContextMenu,
      onChange,
    }: {
      name: string;
      type?: "page" | "scroll" | "autoScroll";
      indexing?: boolean;
      height?: CSSProperties["height"];
      maxHeight?: CSSProperties["maxHeight"];
      minHeight?: CSSProperties["minHeight"];
      initLimit: number;
      initData?: any;
      initCondition?: any;
      columns: Column[];
      styling?: {
        table?: Styling; // 테이블 전체
        header?: Styling; // 테이블 header
        row?: Styling; // 테이블 column
        common?: Styling; // 테이블 header와 column 두개 모두 적용
        selected: Styling;
      };
      selectable?: boolean;
      onSearch?: (condition: any) => any;
      onMaxPage?: (data: any) => number;
      onTableClick?: (e: React.MouseEvent) => void;
      onRowClick?: (e: React.MouseEvent, row: any) => void;
      onReprocessing?: (data: any) => any;
      ContextMenu?: ({
        row,
        ridx,
        x,
        y,
        label,
      }: {
        row?: any;
        ridx?: number;
        x: number;
        y: number;
        label?: string;
      }) => { x: number; y: number; rows: RowInterface[] };
      onChange?: ({
        data,
        page,
        maxPage,
        limit,
        origin,
      }: {
        data: any;
        page: number;
        maxPage: number;
        limit: number;
        origin: any;
      }) => void;
    },
    ref
  ) => {
    const rows = useRef<any[]>([]);
    useEffect(() => {
      if (ContextMenu) {
        rows.current = [];
        function registKey(row: RowInterface | RowInterface[]) {
          if (Array.isArray(row)) {
            row.forEach((r) => registKey(r));
          } else {
            if (row?.rows && row?.rows?.length > 0)
              row.rows?.forEach((r) => registKey(r));
            if (row.key && (row.onHotKey || row.onClick)) {
              rows.current = [
                ...rows.current,
                {
                  key: String(row.key).toLowerCase(),
                  onKey: row.onHotKey || row.onClick,
                },
              ];
            }
          }
        }
        const _rows = ContextMenu({ x: 0, y: 0 }).rows;
        if (_rows?.length > 0) registKey(_rows);
      }
    }, [ContextMenu]);
    useHotkeys("*", (e) => {
      rows.current.forEach(({ key, onKey }) => {
        const ctrl = key.includes("ctrl");
        const alt = key.includes("alt");
        const shift = key.includes("shift");
        if (
          ctrl === e.ctrlKey &&
          alt === e.altKey &&
          shift === e.shiftKey &&
          key.endsWith(e.key) &&
          onKey
        ) {
          onKey();
          e.preventDefault();
        }
      });
    });
    return type === "page" ? (
      <PageableTable
        ref={ref}
        name={name}
        indexing={indexing}
        height={height}
        maxHeight={maxHeight}
        minHeight={minHeight}
        initLimit={initLimit}
        initData={initData}
        initCondition={initCondition}
        columns={columns}
        styling={styling}
        onSearch={onSearch}
        onMaxPage={onMaxPage}
        onReprocessing={onReprocessing}
        onTableClick={onTableClick}
        onRowClick={onRowClick}
        selectable={selectable}
        ContextMenu={ContextMenu}
        onChange={onChange}
      />
    ) : (
      <ScrollableTable
        ref={ref}
        name={name}
        auto={type === "autoScroll"}
        indexing={indexing}
        height={height}
        maxHeight={maxHeight}
        minHeight={minHeight}
        initLimit={initLimit}
        initData={initData}
        initCondition={initCondition}
        columns={columns}
        styling={styling}
        onSearch={onSearch}
        onMaxPage={onMaxPage}
        onReprocessing={onReprocessing}
        onTableClick={onTableClick}
        onRowClick={onRowClick}
        selectable={selectable}
        ContextMenu={ContextMenu}
        onChange={onChange}
      />
    );
  }
);
function TableHeader({
  data,
  columns,
  setCondition,
  ContextMenu,
}: {
  data: any;
  columns: Column[];
  setCondition: Dispatch<any>;
  ContextMenu?: ({
    row,
    ridx,
    x,
    y,
    label,
  }: {
    row?: any;
    ridx?: number;
    x: number;
    y: number;
    label?: string;
  }) => { x: number; y: number; rows: RowInterface[] };
}) {
  return columns.map((column: Column, index: number) => {
    let displayValue: React.ReactNode;
    const label =
      column?.Label?.({ data, setCondition, index }) ||
      column?.label ||
      column?.code;
    if (typeof label === "string" || typeof label === "number") {
      displayValue = (
        <P
          fontSize={"inherit"}
          size={"inherit"}
          weight={"inherit"}
          textAlign={"inherit"}
        >
          {label}
        </P>
      );
    } else if (typeof label === "undefined") {
      displayValue = (
        <P
          fontSize={"inherit"}
          size={"inherit"}
          weight={"inherit"}
          textAlign={"inherit"}
        >
          데이터없음
        </P>
      );
    } else if (typeof label === "boolean") {
      displayValue = (
        <Image
          src={
            label
              ? "/resources/images/checkbox_on.png"
              : "/resources/images/checkbox_off.png"
          }
        />
      );
    } else displayValue = label;
    const style = _.merge(
      {},
      column?.styling?.common?.style,
      column.styling?.header?.style
    );
    if (style.width) {
      style.minWidth = style.width;
    }
    return (
      <FlexChild
        key={`header_${index}_${column.label || column.code}`}
        className={clsx(
          styles.cell,
          styles.headerCell,
          column?.styling?.common?.className,
          column?.styling?.header?.className
        )}
        {...style}
        onContextMenu={(e) => {
          if (ContextMenu) {
            e.preventDefault();
            e.stopPropagation();
            NiceModal.show(
              "contextMenu",
              ContextMenu({
                x: e.pageX,
                y: e.pageY,
                ridx: -1,
                label: column?.label || column.code || "데이터 없음",
              })
            );
          }
        }}
      >
        {displayValue}
      </FlexChild>
    );
  });
}
function TableRow({
  row,
  columns,
  ridx,
  ContextMenu,
}: {
  row: any;
  columns: Column[];
  ridx: number;
  ContextMenu?: ({
    row,
    ridx,
    x,
    y,
    label,
  }: {
    row?: any;
    ridx?: number;
    x: number;
    y: number;
    label?: string;
  }) => { x: number; y: number; rows: RowInterface[] };
}) {
  return columns.map((column: Column, index: any) => {
    let displayValue: React.ReactNode;
    const label =
      column?.Cell?.({ row, cell: row?.[column.code || ""], index: ridx }) ||
      row?.[column.code || ""];
    if (typeof label === "string" || typeof label === "number") {
      displayValue = (
        <P
          fontSize={"inherit"}
          size={"inherit"}
          weight={"inherit"}
          textAlign={"inherit"}
        >
          {label}
        </P>
      );
    } else if (typeof label === "boolean") {
      displayValue = (
        <Image
          src={
            label
              ? "/resources/images/checkbox_on.png"
              : "/resources/images/checkbox_off.png"
          }
        />
      );
    } else if (typeof label === "undefined") {
      displayValue = (
        <P
          fontSize={"inherit"}
          size={"inherit"}
          weight={"inherit"}
          textAlign={"inherit"}
        >
          데이터없음
        </P>
      );
    } else displayValue = label;

    return (
      <FlexChild
        key={`cell_${ridx}_${index}`}
        className={clsx(
          styles.cell,
          styles.columnCell,
          column?.styling?.common?.className,
          column?.styling?.column?.className
        )}
        {..._.merge(
          {},
          column?.styling?.common?.style,
          column.styling?.column?.style
        )}
        onContextMenu={(e) => {
          if (ContextMenu) {
            e.preventDefault();
            e.stopPropagation();
            NiceModal.show(
              "contextMenu",
              ContextMenu({
                x: e.pageX,
                y: e.pageY,
                ridx: ridx,
                label: column?.label || column.code || "데이터 없음",
                row: row,
              })
            );
          }
        }}
      >
        {displayValue}
      </FlexChild>
    );
  });
}
const PageableTable = forwardRef(
  (
    {
      name,
      indexing = true,
      height,
      maxHeight,
      minHeight,
      initLimit,
      initData,
      initCondition = {},
      columns,
      styling,
      onSearch = () => {},
      onMaxPage = () => 0,
      onReprocessing = (data: any) => data,
      onTableClick,
      onRowClick,
      selectable = true,
      ContextMenu,
      onChange,
    }: {
      name: string;
      indexing?: boolean;
      type?: "page" | "scroll";
      height?: CSSProperties["height"];
      maxHeight?: CSSProperties["maxHeight"];
      minHeight?: CSSProperties["minHeight"];
      initLimit: number;
      initData?: any;
      initCondition?: any;
      columns: Column[];
      styling?: {
        table?: Styling; // 테이블 전체
        header?: Styling; // 테이블 header
        row?: Styling; // 테이블 column
        common?: Styling; // 테이블 header와 column 두개 모두 적용
        selected: Styling;
      };
      selectable?: boolean;
      onSearch?: (condition: any) => any;
      onMaxPage?: (data: any) => number;
      onTableClick?: (e: React.MouseEvent) => void;
      onRowClick?: (e: React.MouseEvent, row: any) => void;
      onReprocessing?: (data: any) => any;
      ContextMenu?: ({
        row,
        ridx,
        x,
        y,
        label,
      }: {
        row?: any;
        ridx?: number;
        x: number;
        y: number;
        label?: string;
      }) => { x: number; y: number; rows: RowInterface[] };
      onChange?: ({
        data,
        page,
        maxPage,
        limit,
        origin,
      }: {
        data: any;
        page: number;
        maxPage: number;
        limit: number;
        origin: any;
      }) => void;
    },
    ref
  ) => {
    const [limit, setLimit] = useState(initLimit);
    const [selected, setSelected] = useState<any[][]>([]);
    const [condition, setCondition] = useState(initCondition || {});
    const {
      [name]: data,
      page,
      origin,
      setPage,
      isLoading,
      mutate,
      maxPage,
    } = usePageData(
      name,
      (index) => ({
        ...condition,
        pageSize: limit,
        pageNumber: index,
      }),
      onSearch,
      onMaxPage,
      {
        fallbackData: initData,
        onReprocessing: (data) => onReprocessing(data),
        revalidateOnMount: true,
      }
    );
    useClientEffect(() => {
      if (onChange) {
        onChange({ data, page, maxPage, limit, origin });
      }
    }, [onChange, data, page, maxPage, limit, origin]);
    useImperativeHandle(ref, () => ({
      reset() {
        setPage(0);
        setCondition(initCondition || {});
      },
      getCondition() {
        return condition;
      },
      setCondition(value: any, init: boolean = true) {
        if (init) value = _.merge({}, initCondition || {}, value);
        setCondition(value);
        setPage(0);
      },
      addCondition(value: any) {
        setCondition(_.merge({}, condition, value));
        setPage(0);
      },
      getPage() {
        return page;
      },
      setPage(page: number) {
        setPage(Math.min(Math.max(0, page), maxPage));
      },
      getMaxPage() {
        return maxPage;
      },
      getLimit() {
        return limit;
      },
      setLimit(limit: number) {
        setLimit(limit);
        setPage(0);
      },
      research() {
        mutate();
      },
      getCurrentData() {
        return data;
      },
      getData() {
        let _data = selectable ? selected.flat() : data;
        if (Array.isArray(_data)) _data = _data.filter(Boolean);
        return _data;
      },
      async getAllData() {
        const data = await onSearch(condition);
        return onReprocessing ? onReprocessing(data) : data;
      },
      async getPageData(pageNumber: number, pageSize?: number) {
        const data = await onSearch(
          _.merge(condition || {}, {
            pageNumber: pageNumber || 0,
            pageSize: pageSize || limit,
          })
        );
        return onReprocessing ? onReprocessing(data) : data;
      },
      // getSelectCount() {
      //   return selected.reduce((acc, now) => {
      //     return acc + now.length;
      //   }, 0);
      // },
    }));
    return (
      <FlexChild
        key={name}
        onClick={onTableClick}
        className={clsx(styles.table, styling?.table?.className)}
        {...styling?.table?.style}
        onContextMenu={(e) => {
          if (ContextMenu) {
            e.preventDefault();
            e.stopPropagation();
            NiceModal.show(
              "contextMenu",
              ContextMenu({
                x: e.pageX,
                y: e.pageY,
              })
            );
          }
        }}
      >
        <VerticalFlex>
          {selectable ? (
            <CheckboxGroup
              name="select"
              onChange={(values) =>
                setSelected((prev) => {
                  prev[page] = data
                    .map((d: any, index: number) => ({
                      ...d,
                      _index: page * limit + index,
                    }))
                    .filter((f: any) => values.includes(String(f._index)));
                  return [...prev];
                })
              }
              values={
                selected?.[page]?.map?.((d: any) => String(d._index)) || []
              }
            >
              <VerticalFlex
                overflow="auto"
                height={height}
                maxHeight={maxHeight}
                minHeight={minHeight}
              >
                <FlexChild
                  position="sticky"
                  top={0}
                  zIndex={1}
                  onContextMenu={(e) => {
                    if (ContextMenu) {
                      e.preventDefault();
                      e.stopPropagation();
                      NiceModal.show(
                        "contextMenu",
                        ContextMenu({
                          x: e.pageX,
                          y: e.pageY,
                          ridx: -1,
                        })
                      );
                    }
                  }}
                >
                  <HorizontalFlex
                    className={clsx(
                      styles.common,
                      styles.header,
                      styling?.common?.className,
                      styling?.header?.className
                    )}
                    {..._.merge(
                      {},
                      styling?.common?.style,
                      styling?.header?.style
                    )}
                  >
                    <FlexChild
                      className={clsx(
                        styles.cell,
                        styles.headerCell,
                        styles.checkbox
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CheckboxAll />
                    </FlexChild>
                    {indexing && (
                      <FlexChild
                        className={clsx(
                          styles.cell,
                          styles.headerCell,
                          styles.index
                        )}
                      >
                        <P>No.</P>
                      </FlexChild>
                    )}
                    <TableHeader
                      data={data}
                      columns={columns}
                      setCondition={setCondition}
                    />
                  </HorizontalFlex>
                </FlexChild>
                {data?.map((row: any, ridx: number) => {
                  return (
                    <FlexChild
                      key={`row_${page * limit + ridx}`}
                      zIndex={0}
                      onContextMenu={(e) => {
                        if (ContextMenu) {
                          e.preventDefault();
                          e.stopPropagation();
                          NiceModal.show(
                            "contextMenu",
                            ContextMenu({
                              x: e.pageX,
                              y: e.pageY,
                              ridx: page * limit + ridx,
                              row,
                            })
                          );
                        }
                      }}
                      onClick={(e) => onRowClick?.(e, row)}
                    >
                      <HorizontalFlex
                        className={clsx(
                          styles.common,
                          styles.row,
                          styling?.common?.className,
                          styling?.row?.className,
                          {
                            [styles.selected]: selected?.[page]?.some(
                              (s) => s._index === page * limit + ridx
                            ),
                          },
                          selected?.[page]?.some(
                            (s) => s._index === page * limit + ridx
                          )
                            ? styling?.selected.className
                            : undefined
                        )}
                        {..._.merge(
                          {},
                          styling?.common?.style,
                          styling?.row?.style,
                          false ? styling?.selected.style : {}
                        )}
                      >
                        <FlexChild
                          className={clsx(
                            styles.cell,
                            styles.columnCell,
                            styles.checkbox
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CheckboxChild id={String(page * limit + ridx)} />
                        </FlexChild>
                        {indexing && (
                          <FlexChild
                            className={clsx(
                              styles.cell,
                              styles.columnCell,
                              styles.index
                            )}
                          >
                            <P>{page * limit + ridx + 1}</P>
                          </FlexChild>
                        )}
                        <TableRow
                          row={row}
                          columns={columns}
                          ridx={page * limit + ridx}
                          ContextMenu={ContextMenu}
                        />
                      </HorizontalFlex>
                    </FlexChild>
                  );
                })}
              </VerticalFlex>
            </CheckboxGroup>
          ) : (
            <VerticalFlex
              overflow="auto"
              height={height}
              maxHeight={maxHeight}
              minHeight={minHeight}
            >
              <FlexChild
                position="sticky"
                top={0}
                zIndex={1}
                onContextMenu={(e) => {
                  if (ContextMenu) {
                    e.preventDefault();
                    e.stopPropagation();
                    NiceModal.show(
                      "contextMenu",
                      ContextMenu({
                        x: e.pageX,
                        y: e.pageY,
                        ridx: -1,
                      })
                    );
                  }
                }}
              >
                <HorizontalFlex
                  className={clsx(
                    styles.common,
                    styles.header,
                    styling?.common?.className,
                    styling?.header?.className
                  )}
                  {..._.merge(
                    {},
                    styling?.common?.style,
                    styling?.header?.style
                  )}
                >
                  {indexing && (
                    <FlexChild
                      className={clsx(
                        styles.cell,
                        styles.headerCell,
                        styles.index
                      )}
                    >
                      <P>No.</P>
                    </FlexChild>
                  )}
                  <TableHeader
                    data={data}
                    columns={columns}
                    setCondition={setCondition}
                  />
                </HorizontalFlex>
              </FlexChild>
              {data?.map((row: any, ridx: number) => {
                return (
                  <FlexChild
                    key={`row_${page * limit + ridx}`}
                    zIndex={0}
                    onContextMenu={(e) => {
                      if (ContextMenu) {
                        e.preventDefault();
                        e.stopPropagation();
                        NiceModal.show(
                          "contextMenu",
                          ContextMenu({
                            x: e.pageX,
                            y: e.pageY,
                            ridx: page * limit + ridx,
                            row,
                          })
                        );
                      }
                    }}
                  >
                    <HorizontalFlex
                      className={clsx(
                        styles.common,
                        styles.row,
                        styling?.common?.className,
                        styling?.row?.className,
                        {
                          [styles.selected]: selected?.[page]?.some(
                            (s) => s._index === page * limit + ridx
                          ),
                        },
                        selected?.[page]?.some(
                          (s) => s._index === page * limit + ridx
                        )
                          ? styling?.selected.className
                          : undefined
                      )}
                      {..._.merge(
                        {},
                        styling?.common?.style,
                        styling?.row?.style,
                        false ? styling?.selected.style : {}
                      )}
                    >
                      {indexing && (
                        <FlexChild
                          className={clsx(
                            styles.cell,
                            styles.columnCell,
                            styles.index
                          )}
                        >
                          <P>{page * limit + ridx + 1}</P>
                        </FlexChild>
                      )}
                      <TableRow
                        row={row}
                        columns={columns}
                        ridx={page * limit + ridx}
                        ContextMenu={ContextMenu}
                      />
                    </HorizontalFlex>
                  </FlexChild>
                );
              })}
            </VerticalFlex>
          )}

          {maxPage > 0 && (
            <FlexChild className={styles.pageLine}>
              <HorizontalFlex
                width={"max-content"}
                justifyContent="center"
                gap={10}
              >
                <FlexChild
                  className={clsx(
                    styles.pageButton,
                    styles.arrow,
                    styles.arrowTwice
                  )}
                  onClick={() => setPage(0)}
                />
                <FlexChild
                  className={clsx(styles.pageButton, styles.arrow)}
                  onClick={() => setPage(Math.max(0, page - 1))}
                />
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                  .map((index) => page - (page % 10) + index)
                  .filter((index) => index <= maxPage)
                  .map((index) => (
                    <FlexChild
                      key={`page_${index}`}
                      className={clsx(styles.pageButton, {
                        [styles.selected]: index === page,
                      })}
                      onClick={() => setPage(index)}
                    >
                      <P width={"100%"}>{index + 1}</P>
                    </FlexChild>
                  ))}
                <FlexChild
                  className={clsx(
                    styles.pageButton,
                    styles.arrow,
                    styles.arrowNext
                  )}
                  onClick={() => setPage(Math.min(maxPage, page + 1))}
                />
                <FlexChild
                  className={clsx(
                    styles.pageButton,
                    styles.arrow,
                    styles.arrowNext,
                    styles.arrowTwice
                  )}
                  onClick={() => setPage(Math.min(maxPage))}
                />
              </HorizontalFlex>
            </FlexChild>
          )}
        </VerticalFlex>
      </FlexChild>
    );
  }
);
const ScrollableTable = forwardRef(
  (
    {
      name,
      auto,
      indexing,
      height,
      maxHeight,
      minHeight,
      initLimit,
      initData,
      initCondition = {},
      columns,
      styling,
      onSearch = () => {},
      onMaxPage = () => 0,
      onReprocessing = (data: any) => data,
      onTableClick,
      onRowClick,
      selectable = true,
      ContextMenu,
      onChange,
    }: {
      name: string;
      auto: boolean;
      indexing: boolean;
      height?: CSSProperties["height"];
      maxHeight?: CSSProperties["maxHeight"];
      minHeight?: CSSProperties["minHeight"];
      initLimit: number;
      initData?: any;
      initCondition?: any;
      columns: Column[];
      styling?: {
        table?: Styling; // 테이블 전체
        header?: Styling; // 테이블 header
        row?: Styling; // 테이블 column
        common?: Styling; // 테이블 header와 column 두개 모두 적용
        selected: Styling;
      };
      selectable?: boolean;
      onSearch?: (condition: any) => any;
      onMaxPage?: (data: any) => number;
      onTableClick?: (e: React.MouseEvent) => void;
      onRowClick?: (e: React.MouseEvent, row: any) => void;
      onReprocessing?: (data: any) => any;
      ContextMenu?: ({
        row,
        ridx,
        x,
        y,
        label,
      }: {
        row?: any;
        ridx?: number;
        x: number;
        y: number;
        label?: string;
      }) => { x: number; y: number; rows: RowInterface[] };
      onChange?: ({
        data,
        page,
        maxPage,
        limit,
        origin,
      }: {
        data: any;
        page: number;
        maxPage: number;
        limit: number;
        origin: any;
      }) => void;
    },
    ref
  ) => {
    const observer = useRef<any>(null);
    const [limit, setLimit] = useState(initLimit);
    const [selected, setSelected] = useState<any[]>([]);
    const [condition, setCondition] = useState(initCondition || {});
    const {
      [name]: data,
      page,
      origin,
      setPage,
      Load,
      isLoading,
      mutate,
      maxPage,
    } = useInfiniteData(
      name,
      (index) => ({
        ...condition,
        pageSize: limit,
        pageNumber: index,
      }),
      onSearch,
      onMaxPage,
      {
        fallbackData: initData,
        onReprocessing: (data) => onReprocessing(data),
        revalidateOnMount: true,
      }
    );
    useClientEffect(() => {
      if (onChange) {
        onChange({ data, page, maxPage, limit, origin });
      }
    }, [onChange, data, page, maxPage, limit, origin]);
    useImperativeHandle(ref, () => ({
      reset() {
        setPage(0);
        setCondition(initCondition || {});
      },
      getCondition() {
        return condition;
      },
      setCondition(value: any, init: boolean = true) {
        if (init) value = _.merge({}, initCondition || {}, value);
        setCondition(value);
        setPage(0);
      },
      addCondition(value: any) {
        setCondition(_.merge({}, condition, value));
        setPage(0);
      },
      getPage() {
        return page;
      },
      setPage(page: number) {
        setPage(Math.min(Math.max(0, page), maxPage));
      },
      getMaxPage() {
        return maxPage;
      },
      getLimit() {
        return limit;
      },
      setLimit(limit: number) {
        setLimit(limit);
        setPage(0);
      },
      research() {
        mutate();
      },
      getCurrentData() {
        return data;
      },
      getData() {
        return selectable ? selected.flat() : data;
      },
      async getAllData() {
        return await onSearch(condition);
      },
      Load() {
        Load();
      },
    }));

    return (
      <FlexChild
        key={name}
        onClick={onTableClick}
        className={clsx(styles.table, styling?.table?.className)}
        {...styling?.table?.style}
        onContextMenu={(e) => {
          if (ContextMenu) {
            e.preventDefault();
            e.stopPropagation();
            NiceModal.show(
              "contextMenu",
              ContextMenu({
                x: e.pageX,
                y: e.pageY,
              })
            );
          }
        }}
      >
        <VerticalFlex>
          {selectable ? (
            <CheckboxGroup
              name="select"
              onChange={(values) =>
                setSelected((prev) => {
                  prev = data
                    .map((d: any, index: number) => ({
                      ...d,
                      _index: index,
                    }))
                    .filter((f: any) => values.includes(String(f._index)));
                  return [...prev];
                })
              }
              values={selected?.map?.((d: any) => String(d._index)) || []}
            >
              <VerticalFlex
                overflow="auto"
                height={height}
                maxHeight={maxHeight}
                minHeight={minHeight}
              >
                <FlexChild
                  position="sticky"
                  top={0}
                  zIndex={1}
                  onContextMenu={(e) => {
                    if (ContextMenu) {
                      e.preventDefault();
                      e.stopPropagation();
                      NiceModal.show(
                        "contextMenu",
                        ContextMenu({
                          x: e.pageX,
                          y: e.pageY,
                          ridx: -1,
                        })
                      );
                    }
                  }}
                >
                  <HorizontalFlex
                    className={clsx(
                      styles.common,
                      styles.header,
                      styling?.common?.className,
                      styling?.header?.className
                    )}
                    {..._.merge(
                      {},
                      styling?.common?.style,
                      styling?.header?.style
                    )}
                  >
                    <FlexChild
                      className={clsx(
                        styles.cell,
                        styles.headerCell,
                        styles.checkbox
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CheckboxAll />
                    </FlexChild>
                    {indexing && (
                      <FlexChild
                        className={clsx(
                          styles.cell,
                          styles.headerCell,
                          styles.index
                        )}
                      >
                        <P>No.</P>
                      </FlexChild>
                    )}
                    <TableHeader
                      data={data}
                      columns={columns}
                      setCondition={setCondition}
                    />
                  </HorizontalFlex>
                </FlexChild>
                {data?.map((row: any, ridx: number) => {
                  return (
                    <FlexChild
                      key={`row_${ridx}`}
                      zIndex={0}
                      onContextMenu={(e) => {
                        if (ContextMenu) {
                          e.preventDefault();
                          e.stopPropagation();
                          NiceModal.show(
                            "contextMenu",
                            ContextMenu({
                              x: e.pageX,
                              y: e.pageY,
                              ridx: ridx,
                              row,
                            })
                          );
                        }
                      }}
                      onClick={(e) => onRowClick?.(e, row)}
                    >
                      <HorizontalFlex
                        className={clsx(
                          styles.common,
                          styles.row,
                          styling?.common?.className,
                          styling?.row?.className,
                          {
                            [styles.selected]: selected?.some(
                              (s) => s._index === ridx
                            ),
                          },
                          selected?.some((s) => s._index === ridx)
                            ? styling?.selected.className
                            : undefined
                        )}
                        {..._.merge(
                          {},
                          styling?.common?.style,
                          styling?.row?.style,
                          false ? styling?.selected.style : {}
                        )}
                      >
                        <FlexChild
                          className={clsx(
                            styles.cell,
                            styles.columnCell,
                            styles.checkbox
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CheckboxChild id={String(ridx)} />
                        </FlexChild>
                        {indexing && (
                          <FlexChild
                            className={clsx(
                              styles.cell,
                              styles.columnCell,
                              styles.index
                            )}
                          >
                            <P>{ridx + 1}</P>
                          </FlexChild>
                        )}
                        <TableRow
                          row={row}
                          columns={columns}
                          ridx={ridx}
                          ContextMenu={ContextMenu}
                        />
                      </HorizontalFlex>
                    </FlexChild>
                  );
                })}
              </VerticalFlex>
            </CheckboxGroup>
          ) : (
            <VerticalFlex
              overflow="auto"
              height={height}
              maxHeight={maxHeight}
              minHeight={minHeight}
            >
              <FlexChild
                position="sticky"
                top={0}
                zIndex={1}
                onContextMenu={(e) => {
                  if (ContextMenu) {
                    e.preventDefault();
                    e.stopPropagation();
                    NiceModal.show(
                      "contextMenu",
                      ContextMenu({
                        x: e.pageX,
                        y: e.pageY,
                        ridx: -1,
                      })
                    );
                  }
                }}
              >
                <HorizontalFlex
                  className={clsx(
                    styles.common,
                    styles.header,
                    styling?.common?.className,
                    styling?.header?.className
                  )}
                  {..._.merge(
                    {},
                    styling?.common?.style,
                    styling?.header?.style
                  )}
                >
                  {indexing && (
                    <FlexChild
                      className={clsx(
                        styles.cell,
                        styles.headerCell,
                        styles.index
                      )}
                    >
                      <P>No.</P>
                    </FlexChild>
                  )}
                  <TableHeader
                    data={data}
                    columns={columns}
                    setCondition={setCondition}
                  />
                </HorizontalFlex>
              </FlexChild>
              {data?.map((row: any, ridx: number) => {
                return (
                  <FlexChild
                    key={`row_${ridx}`}
                    zIndex={0}
                    onContextMenu={(e) => {
                      if (ContextMenu) {
                        e.preventDefault();
                        e.stopPropagation();
                        NiceModal.show(
                          "contextMenu",
                          ContextMenu({
                            x: e.pageX,
                            y: e.pageY,
                            ridx: ridx,
                            row,
                          })
                        );
                      }
                    }}
                  >
                    <HorizontalFlex
                      className={clsx(
                        styles.common,
                        styles.row,
                        styling?.common?.className,
                        styling?.row?.className,
                        {
                          [styles.selected]: selected?.some(
                            (s) => s._index === ridx
                          ),
                        },
                        selected?.some((s) => s._index === ridx)
                          ? styling?.selected.className
                          : undefined
                      )}
                      {..._.merge(
                        {},
                        styling?.common?.style,
                        styling?.row?.style,
                        false ? styling?.selected.style : {}
                      )}
                    >
                      {indexing && (
                        <FlexChild
                          className={clsx(
                            styles.cell,
                            styles.columnCell,
                            styles.index
                          )}
                        >
                          <P>{ridx + 1}</P>
                        </FlexChild>
                      )}
                      <TableRow
                        row={row}
                        columns={columns}
                        ridx={ridx}
                        ContextMenu={ContextMenu}
                      />
                    </HorizontalFlex>
                  </FlexChild>
                );
              })}
            </VerticalFlex>
          )}

          {maxPage > 0 &&
            (auto ? (
              <div
                ref={useCallback(
                  (node: any) => {
                    if (observer.current) observer.current.disconnect();
                    observer.current = new IntersectionObserver(
                      (entries) => {
                        if (
                          entries[0].isIntersecting &&
                          page < maxPage - 1 &&
                          !isLoading
                        ) {
                          Load();
                        }
                      },
                      {
                        root: null,
                        rootMargin: "100px",
                        threshold: 0.1,
                      }
                    );
                    if (node) observer.current.observe(node);
                  },
                  [page, maxPage, isLoading]
                )}
              />
            ) : (
              <FlexChild className={styles.scrollButton} onClick={() => Load()}>
                <P width={"100%"}>더 불러오기</P>
              </FlexChild>
            ))}
        </VerticalFlex>
      </FlexChild>
    );
  }
);
export default Table;
