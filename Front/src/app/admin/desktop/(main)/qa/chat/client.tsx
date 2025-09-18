"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputTextArea from "@/components/inputs/InputTextArea";
import P from "@/components/P/P";
import { useAdminAuth } from "@/providers/AdminAuthPorivder/AdminAuthPorivderClient";
import { adminRequester } from "@/shared/AdminRequester";
import { fileRequester } from "@/shared/FileRequester";
import useInfiniteData from "@/shared/hooks/data/useInfiniteData";
import useSubscriptionData from "@/shared/hooks/data/useSubscriptionData";
import { requester } from "@/shared/Requester";
import { socketRequester } from "@/shared/SocketRequester";
import { dateToString } from "@/shared/utils/Functions";
import clsx from "clsx";
import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

export default function ({
  initChatrooms,
  initCondition,
}: {
  initCondition: any;
  initChatrooms: any;
}) {
  const inputRef = useRef<any>(null);
  const [condition, setCondition] = useState(initCondition);
  const [room, setRoom] = useState<string>();
  const [date, setDate] = useState<Date>(new Date());
  const { chatrooms, mutate: reload_read } = useInfiniteData(
    "chatrooms",
    (pageNumber) => ({
      ...condition,
      room_id: room,
      pageNumber,
    }),
    (condition) => adminRequester.getMyChatrooms(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initChatrooms,
    }
  );
  const onSearch = () => {
    const q: string = inputRef.current.getValue();
    if (q.trim()) {
      setCondition({ ...initCondition, q });
    } else {
      setCondition(initCondition);
    }
  };

  useEffect(() => {
    socketRequester.subscribe("admin_chatrooms", (res) => {
      document.getElementById("reload_read")?.click();
    });
    return () => socketRequester.unSubscribe("admin_chatrooms");
  }, []);
  return (
    <FlexChild className={styles.wrapper}>
      <button hidden id="reload_read" onClick={() => reload_read()} />
      <HorizontalFlex gap={20}>
        <FlexChild width={350}>
          <VerticalFlex className={styles.roomList}>
            <FlexChild position="sticky" top={0}>
              <FlexChild className={styles.inputWrapper}>
                <Input
                  ref={inputRef}
                  className={styles.input}
                  placeHolder="Search..."
                  width={"100%"}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch();
                  }}
                />
                <Image
                  src="/resources/icons/search_gray.png"
                  size={16}
                  position="absolute"
                  right={8}
                  onClick={onSearch}
                  cursor="pointer"
                />
              </FlexChild>
            </FlexChild>
            {chatrooms.map((chatroom: ChatroomData) => {
              const user = chatroom.users
                ?.map((u) => u.user)
                .find((f) => f?.role === "member");
              return (
                <FlexChild
                  key={chatroom.id}
                  className={clsx(styles.room, {
                    [styles.selected]: chatroom.id === room,
                  })}
                  onClick={() => {
                    if (room === chatroom.id) {
                      setRoom("");
                    } else setRoom(chatroom.id);
                    setDate(new Date());
                  }}
                >
                  <HorizontalFlex gap={10}>
                    <FlexChild className={styles.avatar}>
                      <P>{user?.name.slice(0, 1)}</P>
                      <FlexChild
                        hidden={!chatroom?.unread}
                        className={styles.roomRead}
                      >
                        <P>{chatroom.unread}</P>
                      </FlexChild>
                    </FlexChild>
                    <FlexChild>
                      <VerticalFlex>
                        <FlexChild>
                          <P>{user?.name}님의 문의</P>
                        </FlexChild>
                        <FlexChild>
                          <P>{dateToString(chatroom.updated_at, true, true)}</P>
                        </FlexChild>
                      </VerticalFlex>
                    </FlexChild>
                  </HorizontalFlex>
                </FlexChild>
              );
            })}
          </VerticalFlex>
        </FlexChild>
        <ChatspaceWrapper
          room={chatrooms.find((f: ChatroomData) => f.id === room)}
          starts_at={date}
        />
      </HorizontalFlex>
    </FlexChild>
  );
}

function ChatspaceWrapper({
  room,
  starts_at,
}: {
  room?: ChatroomData;
  starts_at: Date;
}) {
  if (!room)
    return (
      <FlexChild>
        <VerticalFlex className={styles.chatspaceWrapper}>
          <FlexChild className={styles.titleWrapper} gap={10} />
          <FlexChild>
            <VerticalFlex
              alignItems="center"
              gap={10}
              className={styles.chatspaceinnerWrapper}
              justifyContent="center"
            >
              <Image src="/resources/images/no_chat_img.png" size={100} />
              <P className={styles.noChat}>채팅을 입력해주세요.</P>
            </VerticalFlex>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
    );
  return <ChatSpace room={room} starts_at={starts_at} />;
}
function ChatSpace({
  room,
  starts_at,
}: {
  room: ChatroomData;
  starts_at: Date;
}) {
  const { userData } = useAdminAuth();
  const user = room?.users
    ?.map((u) => u.user)
    .find((f) => f?.role === "member");
  const inputRef = useRef<any>(null);
  const {
    chats: preChats,
    isLoading,
    page,
    maxPage,
    Load,
  } = useInfiniteData(
    "chats",
    (pageNumber) => ({
      pageSize: 50,
      pageNumber,
      created_at: starts_at,
      relations: ["user"],
    }),
    (condition) => requester.getChats(room?.id, condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
    }
  );
  const { [`/${room?.id}/chats`]: newChats } = useSubscriptionData(
    `/${room?.id}/chats`,
    (key, { next }) => {
      socketRequester.subscribe(key, (res) => {
        document.getElementById("reload_read")?.click();
        next(null, (pre: any[]) => {
          return [...(pre || []), res.chat];
        });
      });
      return () => socketRequester.unSubscribe(key);
    },
    {
      fallbackData: [],
    }
  );
  return (
    <FlexChild>
      <VerticalFlex
        className={styles.chatspaceWrapper}
        alignItems="flex-start"
        // overflow="scroll"
        overflowY="scroll"
        height={"100%"}
        position="relative"
        justifyContent="flex-start"
        hideScrollbar
      >
        <FlexChild className={styles.titleWrapper} gap={10}>
          <FlexChild className={styles.avatar}>
            <P>{user?.name.slice(0, 1)}</P>
          </FlexChild>
          <FlexChild>
            <P>{user?.name}님의 문의</P>
          </FlexChild>
        </FlexChild>
        <Chats
          isLoading={isLoading}
          preChats={preChats}
          newChats={newChats}
          users={room?.users}
          page={page}
          maxPage={maxPage}
          Load={Load}
        />
        <input
          id="upload"
          type="file"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              let type = "file";
              if (file.type.includes("image")) {
                type = "image";
              }
              const form = new FormData();
              form.set("files", file);
              fileRequester
                .upload(form, `/chatroom/${room?.id}/${userData?.id}`)
                .then(({ urls }: { urls?: string[] }) => {
                  if (urls && urls?.length > 0)
                    socketRequester.publish(`/users/me/chatrooms`, {
                      room_id: room.id,
                      user_id: userData?.id,
                      message: urls[0],
                      type,
                    });
                });
            }
            e.target.value = "";
          }}
        />
        <FlexChild className={styles.footerWrapper}>
          <Button className={styles.button}>
            <Icon
              name="plus"
              type="svg"
              size={16}
              onClick={() => document.getElementById("upload")?.click()}
            />
          </Button>
          <InputTextArea
            ref={inputRef}
            className={styles.input2}
            width={"100%"}
            placeHolder="메시지를 입력하세요"
          />
          <Icon
            name="upload"
            type="svg"
            size={36}
            onClick={() => {
              socketRequester.publish(`/users/me/chatrooms`, {
                room_id: room.id,
                user_id: userData?.id,
                message: inputRef.current.getValue(),
                type: "message",
              });
              inputRef.current.empty();
            }}
          />
        </FlexChild>
      </VerticalFlex>
    </FlexChild>
  );
}
interface Chat {
  date: string;
  chats: ChatData[];
}

function Chats({
  isLoading: preIsLoading,
  preChats,
  newChats,
  users,
  page,
  maxPage,
  Load,
}: {
  isLoading: boolean;
  preChats: ChatData[];
  newChats: ChatData[];
  users?: ChatroomUserData[];
  page: number;
  maxPage: number;
  Load: () => void;
}) {
  const initRef = useRef<boolean>(true);
  const heightRef = useRef<number>(0);
  const [totalChat, setTotalChat] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const observer = useRef<any>(null);
  useEffect(() => {
    const combined = [...(preChats || []).reverse(), ...newChats];
    const total = _.groupBy(combined, (chat: ChatData) => {
      const date = new Date(chat.created_at);
      return dateToString(date);
    });
    setTotalChat(
      Object.keys(total).map((key) => ({
        date: key,
        chats: total[key],
      }))
    );
  }, [preChats, newChats]);
  const moveToEnd = () => {
    const chatScroll = document.getElementById("chat");
    if (chatScroll) {
      chatScroll.scrollTop = chatScroll.scrollHeight - chatScroll?.clientHeight;
    }
  };
  const ref = useCallback(
    (node: any) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            page < maxPage &&
            !isLoading &&
            !preIsLoading
          ) {
            const chatScroll = document.getElementById("chat");
            if (chatScroll) {
              heightRef.current =
                chatScroll.scrollHeight - chatScroll.scrollTop;
            }
            Load();
            setIsLoading(true);
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
    [page, maxPage, isLoading, preIsLoading]
  );
  useEffect(() => {
    if (totalChat?.length > 0 && initRef.current) {
      moveToEnd();
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      initRef.current = false;
    }
  }, [totalChat]);
  useEffect(() => {
    if (!initRef.current)
      setTimeout(() => {
        const chatScroll = document.getElementById("chat");
        if (chatScroll && chatScroll.scrollHeight > heightRef.current) {
          chatScroll.scrollTop = chatScroll.scrollHeight - heightRef.current;
          setIsLoading(false);
        }
      }, 300);
  }, [preChats]);
  useEffect(() => {
    if (!initRef.current)
      setTimeout(() => {
        moveToEnd();
      }, 100);
  }, [newChats]);
  return (
    <VerticalFlex
      id="chat"
      overflow="scroll"
      overflowY="scroll"
      hideScrollbar
      className={clsx(styles.wrapper2, styles.chatspaceinnerWrapper)}
    >
      <div ref={ref} style={{ height: 1 }} />
      {totalChat.length === 0 && (
        <P className={styles.date}>{dateToString(new Date())}</P>
      )}
      {totalChat.map((total) => (
        <VerticalFlex key={total.date}>
          <P className={styles.date}>{total.date}</P>
          {total.chats.map((chat) => (
            <Chat key={chat.id} chat={chat} users={users} />
          ))}
        </VerticalFlex>
      ))}
    </VerticalFlex>
  );
}

function Chat({ chat, users }: { chat: ChatData; users?: ChatroomUserData[] }) {
  const read = users?.filter(
    (f) => new Date(f.last_read).getTime() < new Date(chat.created_at).getTime()
  ).length;
  if (chat?.user?.role === "member") {
    return (
      <FlexChild className={styles.chat}>
        <HorizontalFlex
          gap={9}
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Icon name="puffu" type="svg" size={32} />
          <FlexChild>
            <VerticalFlex alignItems="flex-start" gap={4}>
              <FlexChild className={styles.messageName}>
                <P>{chat?.user?.name}</P>
              </FlexChild>
              <FlexChild>
                <HorizontalFlex
                  justifyContent="flex-start"
                  gap={5}
                  alignItems="flex-end"
                >
                  <FlexChild className={clsx(styles.message, styles.admin)}>
                    <Message message={chat.message} type={chat.type} />
                  </FlexChild>
                  <FlexChild className={styles.messageTime}>
                    <P notranslate>{dateToTime(chat.created_at)}</P>
                  </FlexChild>
                  <FlexChild className={styles.messageRead} hidden={read === 0}>
                    <P>{read}</P>
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
            </VerticalFlex>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
    );
  } else {
    return (
      <FlexChild className={styles.chat}>
        <HorizontalFlex justifyContent="flex-end" gap={5} alignItems="flex-end">
          <FlexChild className={styles.messageRead} hidden={read === 0}>
            <P>{read}</P>
          </FlexChild>
          <FlexChild className={styles.messageTime}>
            <P notranslate>{dateToTime(chat.created_at)}</P>
          </FlexChild>
          <FlexChild className={clsx(styles.message, styles.user)}>
            <Message message={chat.message} type={chat.type} />
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
    );
  }
}
function Message({
  message,
  type,
}: {
  message: string;
  type: ChatData["type"];
}) {
  switch (type) {
    case "image":
      return <Image src={message} maxWidth={"70vw"} height={"auto"} />;
  }
  return <P>{message}</P>;
}
const dateToTime = (date: string | Date) => {
  date = new Date(date);
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
};
