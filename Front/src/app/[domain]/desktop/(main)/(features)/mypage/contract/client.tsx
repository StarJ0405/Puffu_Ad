"use client";

import { useEffect, useState } from "react";
import ContractCard from "@/components/card/ContractCard";
import VerticalFlex from "@/components/flex/VerticalFlex";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import P from "@/components/P/P";
import { requester } from "@/shared/Requester";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";

export function Client() {
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();
  const navigate = useNavigate();

  async function loadContracts() {
    try {
      const res = await requester.getMyContracts({
        relations: [
          "pages",
          "pages.input_fields",
          "contract_users",
          "contract_users.user",
        ],
      });

      const userId = userData?.id;
      const list: ContractData[] = (res as any)?.content ?? res ?? [];

      const userContracts = list.filter((c) =>
        c.contract_users?.some((u) => u.user_id === userId)
      );

      setContracts(userContracts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContracts();
  }, []);

  if (loading) return <P>로딩 중...</P>;

  return (
    <VerticalFlex gap={20} alignItems="flex-start">
      <P fontWeight={600}>내가 참가한 계약</P>

      <HorizontalFlex gap={20} flexWrap="wrap" width={"auto"}>
        {contracts.length === 0 && <P>참가 중인 계약이 없습니다.</P>}

        {contracts.map((contract) => {
          const myUser = contract.contract_users.find(
            (u) => u.user_id === userData?.id
          );

          const senderReady =
            contract.contract_users?.some(
              (u) =>
                u.user?.role?.toLowerCase() === "admin" &&
                u.approve?.toLowerCase() === "ready"
            ) ?? false;

          return (
            <ContractCard
              key={contract.id}
              image={contract.pages?.[0]?.image}
              title={contract.name}
              approveStatus={myUser?.approve}
              completed={!!contract.completed_at}
              deleted={!!contract.is_delete}
              senderReady={senderReady}
              onSign={() => navigate(`/mypage/contract/${contract.id}`)}
              onView={() => navigate(`/mypage/contract/${contract.id}`)}
            />
          );
        })}
      </HorizontalFlex>
    </VerticalFlex>
  );
}
