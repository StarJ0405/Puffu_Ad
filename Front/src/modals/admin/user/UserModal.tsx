import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import { dateToString } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef } from "react";
import ModalBase from "../../ModalBase";
import styles from "./UserModal.module.css";
const UserModal = NiceModal.create(({ user }: { user: UserData }) => {
  const [withHeader, withFooter] = [true, false];
  const [width, height] = ["min(95%, 900px)", "auto"];
  const withCloseButton = true;
  const clickOutsideToClose = true;
  const title = "회원 상세정보";
  const buttonText = "close";
  const modal = useRef<any>(null);
  useEffect(() => {
    if (!user) {
      modal.current.close();
    }
  }, [user]);
  return (
    <ModalBase
      borderRadius={10}
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
    >
      <VerticalFlex padding={"10px 20px"}>
        <FlexChild justifyContent="center">
          <Image
            className={styles.image}
            src={user?.thumbnail || "/resources/images/no-img.png"}
            size={200}
          />
        </FlexChild>
        <FlexChild>
          <HorizontalFlex>
            <FlexChild className={styles.head}>
              <P>uuid</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{user.id}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex>
            <FlexChild className={styles.head}>
              <P>이메일</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{user.username}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex>
            <FlexChild className={styles.head}>
              <P>이름</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{user.name}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        {user.nickname && (
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>닉네임</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <P>{user.nickname}</P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
        )}
        <FlexChild>
          <HorizontalFlex>
            <FlexChild className={styles.head}>
              <P>전화번호</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{`${user?.phone?.slice(0, 3)}-${user?.phone?.slice(
                3,
                7
              )}-${user?.phone?.slice(7)}`}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex>
            <FlexChild className={styles.head}>
              <P>생일</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{new Date(user.birthday).toLocaleDateString()}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex>
            <FlexChild className={styles.head}>
              <P>성인</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <Image
                src={
                  user.adult
                    ? "/resources/images/checkbox_on.png"
                    : "/resources/images/checkbox_off.png"
                }
              />
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex>
            <FlexChild className={styles.head}>
              <P>생성일</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{dateToString(new Date(user?.created_at), true, true)}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        {user?.deleted_at && (
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>탈퇴일</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <P>{dateToString(new Date(user.deleted_at), true, true)}</P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
        )}
        <FlexChild>
          <HorizontalFlex>
            <FlexChild className={styles.head}>
              <P>연동확인</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              {user.accounts?.length === 0 ? (
                <P>연동된 계정이 없습니다.</P>
              ) : (
                <VerticalFlex></VerticalFlex>
              )}
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>

        <FlexChild justifyContent="center" gap={5}>
          <Button
            styleType="white"
            padding={"12px 20px"}
            fontSize={18}
            onClick={() => modal.current.close()}
          >
            닫기
          </Button>
        </FlexChild>
      </VerticalFlex>
    </ModalBase>
  );
});

export default UserModal;
