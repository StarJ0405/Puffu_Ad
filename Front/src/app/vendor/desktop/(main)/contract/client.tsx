"use client";

import { useEffect, useState } from "react";
import ContractCard from "@/components/card/ContractCard";
import VerticalFlex from "@/components/flex/VerticalFlex";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import P from "@/components/P/P";
import { vendorRequester } from "@/shared/VendorRequester";
import { useVendorAuth } from "@/providers/VendorAuthProiveder/VendorAuthProviderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import FlexChild from "@/components/flex/FlexChild";
import Input from "@/components/inputs/Input";
import Select from "@/components/select/Select";

export function Client() {
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const { userData } = useVendorAuth();
  const navigate = useNavigate();

  async function loadContracts() {
    try {
      const res = await vendorRequester.getMyContracts({
        relations: [
          "pages",
          "pages.input_fields",
          "contract_users",
          "contract_users.user",
        ],
        q: search,
        status: status,
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
  }, [search, status]);

  if (loading) return <P>로딩 중...</P>;

  return (
    <VerticalFlex gap={20} alignItems="flex-start">
      <P fontWeight={600} fontSize={25}>
        내가 참가한 계약
      </P>

      <HorizontalFlex gap={10}>
        <Input
          placeHolder="계약명 검색"
          value={search}
          onChange={(value) => setSearch(String(value))}
          width={250}
        />
        <Select
          width="160px"
          placeholder="전체 상태"
          options={[
            { display: "전체 상태", value: "" },
            { display: "진행 중", value: "pending" },
            { display: "완료", value: "complete" },
            { display: "파기", value: "delete" },
          ]}
          onChange={(v) => setStatus(String(v))}
        />
      </HorizontalFlex>

      <FlexChild
        width="100%"
        display="flex"
        flexWrap="wrap"
        gap={25}
        justifyContent="flex-start"
      >
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
            <FlexChild
              key={contract.id}
              flexBasis="calc(20% - 25px)"
              maxWidth="calc(20% - 25px)"
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexGrow={"unset"}
              width={"auto"}
            >
              <ContractCard
                image={contract.pages?.[0]?.image}
                title={contract.name}
                approveStatus={myUser?.approve}
                completed={!!contract.completed_at}
                deleted={!!contract.is_delete}
                senderReady={senderReady}
                onSign={() => navigate(`/contract/${contract.id}`)}
                onView={() =>
                  navigate(`/contract/${contract.id}?view=readonly`)
                }
              />
            </FlexChild>
          );
        })}
      </FlexChild>
    </VerticalFlex>
  );
}
