import { useContext } from "react";
import { GraphQLClient } from "graphql-request";
import { useQuery } from "@tanstack/react-query";

import { FIND_DAO } from "../utils/queries";
import type { DaoItem, DaoProfile } from "../utils/types";
import { addParsedContent } from "../utils/yeeter-data-helpers";
import { getGraphUrl } from "../utils/endpoints";
import { DaoHooksContext } from "../DaoHooksContext";

export const useDao = ({
  chainid,
  daoid,
}: {
  chainid?: string;
  daoid?: string;
}) => {
  const hookContext = useContext(DaoHooksContext);

  if (!hookContext || !hookContext.config.graphKey) {
    console.error(
      "useDao: DaoHooksContext must be used within a DaoHooksProvider"
    );
  }

  const dhUrl = getGraphUrl({
    chainid: chainid || "",
    graphKey: hookContext?.config.graphKey || "",
    subgraphKey: "DAOHAUS",
  });

  const graphQLClient = new GraphQLClient(dhUrl);

  const { data, ...rest } = useQuery({
    queryKey: [`get-dao`, { chainid, daoid }],
    enabled: Boolean(chainid && daoid),
    queryFn: async (): Promise<{
      dao: DaoItem;
    }> => {
      const now = String(Math.floor(Date.now() / 1000));
      const daores = (await graphQLClient.request(FIND_DAO, {
        daoid,
        now,
      })) as {
        dao: DaoItem;
      };
      const profile = addParsedContent<DaoProfile>(daores.dao.rawProfile[0]);

      return {
        dao: { ...daores.dao, profile },
      };
    },
  });

  return {
    dao: data?.dao,
    ...rest,
  };
};
