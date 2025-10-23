"use client";

import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import { requester } from "@/shared/Requester";
import { useRef, useState } from "react";
interface Chat {
  date: Date;
  mine: boolean;
  chat: string;
}
export default function () {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const input = useRef<any>(null);
  const onSearch = () => {
    if (isLoading) return;
    const value = input.current.getValue();
    if (value) {
      setChats([...chats, { mine: true, date: new Date(), chat: value }]);
      setLoading(true);
      requester.queryChatbot({ question: value }, (response: any) => {
        if (response.answer) {
          setChats((prev) => [
            ...prev,
            {
              date: new Date(),
              chat: response.answer,
              mine: false,
            },
          ]);
        }
        setLoading(false);
      });
      input.current.empty();
    }
  };
  return (
    <VerticalFlex>
      <P fontWeight={700} fontSize={24} padding={6}>
        챗봇과 테스트해보는 주소
      </P>
      <FlexChild
        height={"60dvh"}
        backgroundColor="#aaa"
        border={"1px solid #d0d0d0"}
      >
        <VerticalFlex>
          {chats.map((chat) => (
            <FlexChild
              key={chat.date.getTime().toString()}
              justifyContent={chat.mine ? "flex-end" : "flex-start"}
              padding={20}
            >
              <P
                padding={10}
                backgroundColor="#fff"
                border={"1px solid #d0d0d0"}
                borderRadius={5}
                color="#111"
                whiteSpace="pre-wrap"
              >
                {chat.chat}
              </P>
            </FlexChild>
          ))}
          {isLoading && (
            <FlexChild padding={20}>
              <P
                padding={10}
                backgroundColor="#fff"
                border={"1px solid #d0d0d0"}
                borderRadius={5}
                color="#111"
                whiteSpace="pre-wrap"
              >
                질문에 대해 생각중..
              </P>
            </FlexChild>
          )}
        </VerticalFlex>
      </FlexChild>
      <FlexChild position="relative">
        <Input
          ref={input}
          placeHolder={
            isLoading ? "봇이 생각중입니다.." : "채팅을 입력하세요..."
          }
          width={"100%"}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
          disabled={isLoading}
        />
        <Image
          top={15}
          right={12}
          position="absolute"
          src="/resources/images/search35.png"
          size={21}
          cursor="pointer"
          onClick={onSearch}
        />
      </FlexChild>
    </VerticalFlex>
  );
}
