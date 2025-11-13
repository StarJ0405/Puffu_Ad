import P from "@/components/P/P";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import ModalBase from "@/modals/ModalBase";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef, useState } from "react";
import styles from "./SelectContractUserModal.module.css";

const SelectContractUserModal = NiceModal.create(
  ({
    users = [],
    onSelect,
  }: {
    users: UserData[];
    onSelect: (user: UserData) => void;
  }) => {
    const modal = useRef<any>(null);
    const [query, setQuery] = useState("");

    // 검색 및 role 필터링
    const filtered = users.filter((u) => {
      const allowed = ["admin", "vendor"].includes(u.role);
      const match =
        u.name?.toLowerCase().includes(query.toLowerCase()) ||
        u.username?.toLowerCase().includes(query.toLowerCase()) ||
        u.phone?.includes(query);
      return allowed && match;
    });

    const handleSelect = (user: UserData) => {
      onSelect(user);
      modal.current?.close();
    };

    return (
      <ModalBase
        ref={modal}
        
        width={600}
        height={"80vh"}
        clickOutsideToClose
      >
        <VerticalFlex className={styles.container} gap={12}>
          <P className={styles.header}>참여자 선택</P>
          <input
            className={styles.search}
            placeholder="이름, 아이디, 연락처 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <VerticalFlex gap={6} className={styles.list}>
            {filtered.map((u) => (
              <FlexChild
                key={u.id}
                className={styles.item}
                onClick={() => handleSelect(u)}
              >
                <P className={styles.name}>
                  {u.name} ({u.username})
                </P>
                <P className={styles.sub}>
                  {u.role} · {u.phone}
                </P>
              </FlexChild>
            ))}

            {filtered.length === 0 && (
              <P className={styles.empty}>검색 결과가 없습니다.</P>
            )}
          </VerticalFlex>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default SelectContractUserModal;
