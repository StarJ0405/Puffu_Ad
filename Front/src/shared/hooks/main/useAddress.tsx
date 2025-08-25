import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { requester } from "@/shared/Requester";
import { KeyedMutator } from "swr";
import useData from "../data/useData";
import useClientEffect from "../useClientEffect";

const useAddress = (
  fallbackData?: AddressData[]
): {
  addresses: AddressData[];
  mutate: KeyedMutator<any>;
} => {
  const { userData } = useAuth();
  const { addresses, mutate } = useData(
    "addresses",
    {},
    (condition) => requester.getAddresses(condition),
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData,
      revalidateOnMount: !fallbackData,
      refresh: {
        keepPreviousData: true,
      },
    }
  );
  useClientEffect(() => {
    mutate();
  }, [userData]);

  return {
    addresses,
    mutate,
  };
};

export default useAddress;
