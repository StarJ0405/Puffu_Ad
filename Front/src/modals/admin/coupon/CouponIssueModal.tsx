import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import InputNumber from "@/components/inputs/InputNumber";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import Select from "@/components/select/Select";
import ModalBase from "@/modals/ModalBase";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import {
  downloadExcelFile,
  readExcelFile,
  toast,
} from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import _ from "lodash";
import { useRef, useState } from "react";
import styles from "./CouponIssueModal.module.css";

const CouponIssueModal = NiceModal.create(
  ({
    onConfirm,
    onCancel,
    message,
    cancelText,
    confirmText,
  }: {
    onConfirm: (data: any) => void;
    onCancel: () => void;
    message: React.ReactNode | string;
    cancelText: string;
    confirmText: string;
  }) => {
    const [withHeader, withFooter] = [false, false];
    const [width, height] = ["60vw", "auto"];
    const withCloseButton = false;
    const clickOutsideToClose = true;
    const title = "";
    const buttonText = "close";
    const modal = useRef<any>(null);
    const [isBlocked, setIsBlocked] = useState<boolean>(false);
    const [amount, setAmount] = useState<number>(1);
    const [condition, setCondition] = useState<string>("all");
    const [group, setGroup] = useState<string>();
    const [users, setUsers] = useState<UserData[]>([]);
    const { isMobile } = useBrowserEvent();
    const { groups } = useData(
      "groups",
      {},
      (condition) => adminRequester.getGroups(condition),
      {
        onReprocessing: (data) => data?.content || [],
      }
    );
    const onConfirmClick = async () => {
      if (isBlocked) return;
      if (condition === "group" && !group)
        return toast({ message: "회원그룹을 골라주세요" });
      else if (condition === "user" && !users.length)
        return toast({ message: "유저를 선택해주세요" });
      setIsBlocked(true);
      const data: any = {
        amount,
      };
      if (group) data.group_id = group;
      if (users?.length > 0) data.users = users.map((user) => user.username);
      if (onConfirm) {
        let isAsyncFn =
          onConfirm.constructor.name === "AsyncFunction" ? true : false;
        if (isAsyncFn) {
          await onConfirm(data);
          modal.current.close();
        } else {
          onConfirm(data);
          modal.current.close();
        }
      } else {
        modal.current.close();
      }
      setIsBlocked(false);
    };

    const onCancelClick = () => {
      if (onCancel) {
        onCancel();
      }
      modal.current.close();
    };
    return (
      <ModalBase
        zIndex={10055}
        ref={modal}
        width={width}
        height={height}
        withHeader={withHeader}
        withFooter={withFooter}
        withCloseButton={withCloseButton}
        clickOutsideToClose={clickOutsideToClose}
        title={title}
        buttonText={buttonText}
        borderRadius={6}
      >
        <FlexChild padding={"50px 24px 24px 24px"} height="100%">
          <VerticalFlex gap={10} height={"100%"}>
            <FlexChild>
              {typeof message === "string" ? (
                <P
                  width="100%"
                  textAlign="center"
                  size={isMobile ? 16 : 18}
                  color={"#111"}
                  weight={600}
                >
                  {message}
                </P>
              ) : (
                message
              )}
            </FlexChild>
            <FlexChild>
              <P>1회 발급 수량</P>
            </FlexChild>
            <FlexChild>
              <InputNumber
                width={270}
                value={amount}
                onChange={(value) => setAmount(value)}
                min={1}
                max={999}
              />
            </FlexChild>
            <FlexChild>
              <P>회원/조건 선택</P>
            </FlexChild>
            <FlexChild>
              <Select
                width={350}
                classNames={{
                  header: styles.select,
                }}
                zIndex={10080}
                value={condition}
                onChange={(value) => {
                  setCondition(value as string);
                  setGroup(undefined);
                  setUsers([]);
                }}
                options={[
                  {
                    display: "전체회원",
                    value: "all",
                  },
                  {
                    display: "회원그룹",
                    value: "group",
                  },
                  {
                    display: "특정회원",
                    value: "user",
                  },
                  {
                    display: "엑셀 등록",
                    value: "excel",
                  },
                ]}
              />
            </FlexChild>
            <FlexChild hidden={condition !== "group"}>
              <Select
                width={350}
                classNames={{
                  header: styles.select,
                }}
                zIndex={10080}
                value={group}
                onChange={(value) => setGroup(value as string)}
                options={groups.map((group: GroupData) => ({
                  display: group.name,
                  value: group.id,
                }))}
              />
            </FlexChild>
            <FlexChild hidden={condition !== "excel"} gap={20}>
              <Button
                border={"1px solid #d0d0d0"}
                color="#111"
                width={"100%"}
                type="file"
                onFileChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const result = await readExcelFile(file, [
                      {
                        attr: "username",
                        code: "id",
                      },
                    ]);
                    if (result.length === 0)
                      return toast({ message: "잘못된 엑셀입니다." });
                    setUsers(result as any);
                  }
                  e.target.value = "";
                }}
              >
                <P>파일선택</P>
              </Button>
              <Button
                border={"1px solid #d0d0d0"}
                color="#111"
                width={"100%"}
                onClick={() =>
                  downloadExcelFile(
                    [{ username: "admin" }, { username: "fjdgj" }],
                    "쿠폰 발급 엑셀 양식",
                    [],
                    [
                      {
                        text: "id",
                        code: "username",
                      },
                    ]
                  )
                }
              >
                <P>등록 폼 다운로드</P>
              </Button>
            </FlexChild>
            <FlexChild hidden={condition !== "user"}>
              <Button
                border={"1px solid #d0d0d0"}
                color="#111"
                width={"100%"}
                onClick={() =>
                  NiceModal.show("table", {
                    name: "user",
                    slideUp: false,
                    width: "60vw",
                    height: "60vh",
                    overflow: "scroll",
                    columns: [
                      {
                        label: "아이디",
                        code: "username",
                      },
                      {
                        label: "고객명",
                        code: "name",
                      },
                      {
                        label: "회원그룹",
                        code: "group",
                        Cell: ({ cell }: any) => cell?.name,
                      },
                      {
                        label: "휴대전화번호",
                        code: "phone",
                      },
                    ],
                    initCondition: {
                      relations: ["group"],
                    },
                    selectable: true,
                    search: true,
                    onMaxPage: (data: Pageable) => data?.totalPages || 0,
                    onReprocessing: (data: Pageable) => data?.content || [],
                    onSearch: (condition: any) =>
                      adminRequester.getUsers(condition),
                    onSelect: (values: UserData[]) =>
                      setUsers(
                        _.uniqBy([...users, ...values], (user) => user.id)
                      ),
                  })
                }
              >
                <P>회원추가</P>
              </Button>
            </FlexChild>
            <FlexChild hidden={condition !== "user"}>
              <VerticalFlex className={styles.body}>
                <FlexChild position="sticky" top={0} zIndex={1}>
                  <HorizontalFlex
                    className={styles.header}
                    alignItems="stretch"
                  >
                    <FlexChild
                      minWidth={50}
                      width={50}
                      className={styles.column}
                    >
                      <P
                        cursor="pointer"
                        color="red"
                        onClick={() => setUsers([])}
                      >
                        삭제
                      </P>
                    </FlexChild>
                    <FlexChild className={styles.column}>
                      <P>아이디</P>
                    </FlexChild>
                    <FlexChild className={styles.column}>
                      <P>고객명</P>
                    </FlexChild>
                    <FlexChild className={styles.column}>
                      <P>회원그룹</P>
                    </FlexChild>
                    <FlexChild className={styles.column}>
                      <P>휴대전화번호</P>
                    </FlexChild>
                  </HorizontalFlex>
                </FlexChild>
                {users.map((user) => (
                  <FlexChild key={user.id || user.username}>
                    <HorizontalFlex
                      className={styles.content}
                      alignItems="stretch"
                    >
                      <FlexChild
                        minWidth={50}
                        width={50}
                        className={styles.column}
                      >
                        <P
                          cursor="pointer"
                          color="red"
                          onClick={() =>
                            setUsers(users.filter((f) => f.id !== user.id))
                          }
                        >
                          삭제
                        </P>
                      </FlexChild>
                      <FlexChild className={styles.column}>
                        <P>{user.username}</P>
                      </FlexChild>
                      <FlexChild className={styles.column}>
                        <P>{user.name}</P>
                      </FlexChild>
                      <FlexChild className={styles.column}>
                        <P>{user.group?.name}</P>
                      </FlexChild>
                      <FlexChild className={styles.column}>
                        <P>{user.phone}</P>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                ))}
              </VerticalFlex>
            </FlexChild>
            <FlexChild marginTop={"auto"}>
              <HorizontalFlex justifyContent={"center"}>
                {cancelText && (
                  <FlexChild height={48} padding={3}>
                    <div
                      className={`${styles.confirmButton} ${styles.white}`}
                      onClick={onCancelClick}
                    >
                      <P
                        size={16}
                        textAlign="center"
                        color={"var(--admin-text-color)"}
                      >
                        {cancelText}
                      </P>
                    </div>
                  </FlexChild>
                )}
                <FlexChild height={48} padding={3}>
                  <div
                    className={`${styles.confirmButton} ${styles.red}`}
                    onClick={onConfirmClick}
                  >
                    {isBlocked && (
                      <FlexChild
                        position={"absolute"}
                        justifyContent={"center"}
                        hidden={!isBlocked}
                      >
                        <LoadingSpinner />
                      </FlexChild>
                    )}
                    <P size={16} textAlign="center" color={"#ffffff"}>
                      {confirmText}
                    </P>
                  </div>
                </FlexChild>
              </HorizontalFlex>
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
      </ModalBase>
    );
  }
);

export default CouponIssueModal;
