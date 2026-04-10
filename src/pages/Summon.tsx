import { useState } from "react";
import { useAccount, useChainId } from "wagmi";

import { TXBuilder } from "@/lib/tx-builder";
import { ParMd } from "@/lib/ui";
import { getNetwork, isValidNetwork } from "@/lib/keychain-utils";
import { toHexChainId } from "@/utils/chainIds";

import { CenterLayout } from "@/components/Summon/FormLayouts";
import { SummonerForm } from "@/components/Summon/SummonerForm";
import { SummonerLoading } from "@/components/Summon/SummonerLoading";
import { SummonerSuccess } from "@/components/Summon/SummonerSuccess";
import { SummonError } from "@/components/Summon/SummonError";
import type { SummonState } from "@/components/Summon/types";

export const Summon = () => {
  const { isConnected } = useAccount();
  const activeChainId = useChainId();
  const hexChainId = activeChainId ? toHexChainId(activeChainId) : undefined;

  const [summonState, setSummonState] = useState<SummonState>("idle");
  const [txHash, setTxHash] = useState("");
  const [daoAddress, setDaoAddress] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const currentNetwork = hexChainId ? getNetwork(hexChainId) : null;
  const chainCopy = !hexChainId
    ? "Connect a wallet to start summoning."
    : isValidNetwork(hexChainId)
      ? `Summoning on ${currentNetwork?.name ?? hexChainId}.`
      : "This connected network is not currently supported for summoning.";

  return (
    <TXBuilder chainId={hexChainId} appState={{}}>
      <CenterLayout>
        <div className="main-column">
          <ParMd style={{ marginBottom: "2.4rem" }}>{chainCopy}</ParMd>
          {summonState === "idle" && (
            <SummonerForm
              chainId={hexChainId}
              isConnected={isConnected}
              setSummonState={setSummonState}
              setTxHash={setTxHash}
              setDaoAddress={setDaoAddress}
              setErrMsg={setErrMsg}
            />
          )}
          {summonState === "loading" && (
            <SummonerLoading txHash={txHash} chainId={hexChainId} />
          )}
          {summonState === "success" && (
            <SummonerSuccess
              chainId={hexChainId}
              daoAddress={daoAddress}
              setSummonState={setSummonState}
            />
          )}
          {summonState === "error" && (
            <SummonError
              chainId={hexChainId}
              daoAddress={daoAddress}
              txHash={txHash}
              errMsg={errMsg}
              setSummonState={setSummonState}
            />
          )}
        </div>
      </CenterLayout>
    </TXBuilder>
  );
};
