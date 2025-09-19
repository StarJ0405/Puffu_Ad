"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { fileRequester } from "@/shared/FileRequester";
import useData from "@/shared/hooks/data/useData";
import useInfiniteData from "@/shared/hooks/data/useInfiniteData";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { requester } from "@/shared/Requester";
import { socketRequester } from "@/shared/SocketRequester";
import clsx from "clsx";
import _ from "lodash";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./adminChat.module.css";

export default function AdminChat({
  onClose,
  starts_at,
  reload,
}: {
  onClose: () => void;
  starts_at: Date;
  reload: () => void;
}) {
  const initRef = useRef<boolean>(true);
  const { userData } = useAuth();
  const pathname = usePathname();
  const { chatroom, mutate: reload_read } = useData(
    "chatroom",
    {},
    () => requester.getChatroom(),
    {
      onReprocessing: (data) => data?.content,
    }
  );
  useClientEffect(() => {
    if (initRef.current === false) {
      onClose();
    } else {
      initRef.current = true;
    }
  }, [pathname]);
  useClientEffect(() => {
    if (!userData?.id) onClose();
  }, [userData]);
  useEffect(() => {
    if (
      chatroom &&
      starts_at.getTime() < new Date(chatroom?.created_at).getTime()
    ) {
      reload();
    }
  }, [starts_at, chatroom]);
  return (
    <>
      <button hidden id="reload_read" onClick={() => reload_read()} />
      <ChatBox chatroom={chatroom} onClose={onClose} starts_at={starts_at} />
    </>
  );
}

function ChatBox({
  chatroom,
  onClose,
  starts_at,
}: {
  chatroom: ChatroomData;
  starts_at: Date;
  onClose: () => void;
}) {
  const { userData } = useAuth();
  const inputRef = useRef<any>(null);

  const {
    chats: preChats,
    isLoading,
    maxPage,
    page,
    Load,
  } = useInfiniteData(
    "chats",
    (pageNumber) => ({
      id: chatroom.id,
      pageSize: 50,
      pageNumber,
      created_at: starts_at,
      relations: ["user"],
    }),
    (condition) => {
      const id = condition.id;
      delete condition.id;
      return requester.getChats(id, condition);
    },
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content,
    }
  );
  const [newChats, setNewChats] = useState<any[]>([]);
  useEffect(() => {
    socketRequester.subscribe(`/${chatroom?.id}/chats`, (res) => {
      document.getElementById("reload_read")?.click();
      setNewChats((prev) => _.uniqBy([...prev, res.chat], (chat) => chat.id));
    });
    return () => socketRequester.unSubscribe(`/${chatroom?.id}/chats`);
  }, [chatroom]);

  return (
    <VerticalFlex className={styles.chat_modal}>
      <FlexChild className={styles.title_header}>
        <P>관리자 문의하기</P>

        <Image
          src={"/resources/icons/modal_close_icon.png"}
          cursor="pointer"
          width={20}
          onClick={onClose}
        />
      </FlexChild>
      <Chats
        Load={Load}
        isLoading={isLoading}
        maxPage={maxPage}
        newChats={newChats}
        page={page}
        preChats={preChats}
        users={chatroom?.users || []}
      />

      <FlexChild className={styles.write_board}>
        <FlexChild>
          <Image
            cursor="pointer"
            src={"/resources/icons/board/chat_file_upload.png"}
            width={39}
            onClick={() => document.getElementById("upload")?.click()}
          />
        </FlexChild>
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
                .upload(form, `/chatroom/${chatroom?.id}/${userData?.id}`)
                .then(({ urls }: { urls?: string[] }) => {
                  if (urls && urls?.length > 0)
                    socketRequester.publish(`/users/me/chatrooms`, {
                      room_id: chatroom.id,
                      user_id: userData?.id,
                      message: urls[0],
                      type,
                    });
                });
            }
            e.target.value = "";
          }}
        />
        <FlexChild className={styles.chat_input}>
          <Input
            ref={inputRef}
            type="text"
            width={"100%"}
            placeHolder="메시지를 입력하세요..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = inputRef.current.getValue();
                if (value?.trim())
                  socketRequester.publish(`/users/me/chatrooms`, {
                    room_id: chatroom.id,
                    user_id: userData?.id,
                    message: value.trim(),
                    type: "message",
                  });
                inputRef.current.empty();
              }
            }}
          />
        </FlexChild>
        <FlexChild>
          <Button
            className={styles.chat_btn}
            onClick={() => {
              const value = inputRef.current.getValue();
              if (value?.trim())
                socketRequester.publish(`/users/me/chatrooms`, {
                  room_id: chatroom.id,
                  user_id: userData?.id,
                  message: value.trim(),
                  type: "message",
                });
              inputRef.current.empty();
            }}
          >
            전송
          </Button>
        </FlexChild>
      </FlexChild>
    </VerticalFlex>
  );
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
  const observer = useRef<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalChat, setTotalChat] = useState<ChatData[]>([]);
  useEffect(() => {
    setTotalChat([...preChats.reverse(), ...newChats]);
  }, [preChats, newChats]);
  const moveToEnd = () => {
    const chatScroll = document.getElementById("chat");
    if (chatScroll) {
      chatScroll.scrollTop = chatScroll.scrollHeight - chatScroll?.clientHeight;
    }
  };
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
  return (
    <FlexChild className={styles.scroll_body} id="chat">
      <VerticalFlex className={styles.chat_body}>
        {totalChat.map((chat) => (
          <Chat key={chat.id} chat={chat} users={users} />
        ))}
      </VerticalFlex>
    </FlexChild>
  );
}

function Chat({ chat, users }: { chat: ChatData; users?: ChatroomUserData[] }) {
  const read = users?.filter(
    (f) => new Date(f.last_read).getTime() < new Date(chat.created_at).getTime()
  ).length;
  if (chat?.user?.role === "admin") {
    return (
      <FlexChild className={clsx(styles.admin_chat, styles.bubble_wrap)}>
        <FlexChild className={styles.chat_bubble}>
          <Message message={chat.message} type={chat.type} />
        </FlexChild>

        <FlexChild className={styles.date}>
          <P>{dateToString(chat.created_at)}</P>
        </FlexChild>
      </FlexChild>
    );
  } else {
    return (
      <FlexChild className={clsx(styles.user_chat, styles.bubble_wrap)}>
        <FlexChild className={styles.chat_bubble}>
          <Message message={chat.message} type={chat.type} />
        </FlexChild>

        <FlexChild className={styles.date}>
          <P>{dateToString(chat.created_at)}</P>
        </FlexChild>
      </FlexChild>
    );
  }
}

const dateToString = (date: string | Date) => {
  date = new Date(date);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${
    date.getHours() < 12 ? "A.M" : "P.M"
  } ${String(date.getHours() % 12).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
};
function Message({
  message,
  type,
}: {
  message: string;
  type: ChatData["type"];
}) {
  switch (type) {
    case "image":
      return (
        <Image src={message} maxWidth={"70vw"} height={"auto"} width={"100%"} />
      );
  }
  return <P>{message}</P>;
}
