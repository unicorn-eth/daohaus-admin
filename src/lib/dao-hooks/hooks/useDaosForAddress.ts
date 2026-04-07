import { GraphQLClient } from "graphql-request";

import { useQuery } from "@tanstack/react-query";
import { LIST_ALL_DAOS_FOR_ADDRESS } from "../utils/queries";
import type { DaoItem, DaoProfile, MemberItem } from "../utils/types";
import { addParsedContent } from "../utils/yeeter-data-helpers";
import { useContext } from "react";
import { DaoHooksContext } from "../DaoHooksContext";
import { getGraphUrl } from "../utils/endpoints";

type DaoWithMembers = DaoItem & { members: MemberItem[] };

export const useDaosForAddress = ({
  chainid,
  address,
}: {
  chainid?: string;
  address?: string;
}) => {
  const hookContext = useContext(DaoHooksContext);

  if (!hookContext || !hookContext.config.graphKey) {
    console.error(
      "useDaos: DaoHooksContext must be used within a DaoHooksProvider"
    );
  }

  const yeeterUrl = getGraphUrl({
    chainid: chainid || "",
    graphKey: hookContext?.config.graphKey || "",
    subgraphKey: "DAOHAUS",
  });

  const graphQLClient = new GraphQLClient(yeeterUrl);

  const { data, ...rest } = useQuery({
    queryKey: [`list-daos-address`, { chainid, address }],
    enabled: Boolean(chainid && address),
    queryFn: async (): Promise<{ daos: DaoWithMembers[] }> => {
      const res = await graphQLClient.request<{ daos: DaoWithMembers[] }>(
        LIST_ALL_DAOS_FOR_ADDRESS,
        { address }
      );
      return {
        daos: res.daos.map((dao) => ({
          ...dao,
          profile: addParsedContent<DaoProfile>(dao.rawProfile?.[0]),
        })),
      };
    },
  });

  return {
    daos: data?.daos,
    ...rest,
  };
};
