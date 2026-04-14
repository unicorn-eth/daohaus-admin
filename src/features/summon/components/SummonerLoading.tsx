import { Bold, H1, Link, ParMd } from "@/lib/ui";
import { generateExplorerLink, ValidNetwork } from "@/lib/keychain-utils";

import { HausBlockLoading } from "./HausBlockLoading";
import { InfoSection } from "./FormLayouts";

type LoadingProps = {
  txHash: string;
  chainId?: string;
};

export const SummonerLoading = ({ txHash, chainId }: LoadingProps) => {
  const txUrl =
    chainId && txHash
      ? generateExplorerLink({
          chainId: chainId as ValidNetwork,
          address: txHash,
          type: "tx",
        })
      : undefined;

  return (
    <div>
      <H1 className="title">
        <Bold>Summon a DAO</Bold>
      </H1>
      <ParMd>
        Learn more about{" "}
        <Link href="https://daohaus.mirror.xyz/U_JQtheSzdpRFqQwf9Ow3LgLNG0WMZ6ibAyrjWDu_fc">
          Moloch v3
        </Link>
      </ParMd>
      <HausBlockLoading loading />
      <InfoSection>
        <ParMd className="info">DAO contract deployment in progress.</ParMd>
        {txUrl && (
          <Link href={txUrl} showExternalIcon={false}>
            Watch Transaction
          </Link>
        )}
      </InfoSection>
    </div>
  );
};
