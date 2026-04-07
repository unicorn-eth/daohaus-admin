import { SingleColumnLayout, ParMd, Loading } from "@/lib/ui";
import { useDao } from "@/lib/dao-hooks";
import { useCurrentDao } from "@/hooks/useCurrentDao";
import { SafeCard } from "@/components/SafeCard";

export const Safes = () => {
  const { daoChain, daoId } = useCurrentDao();
  const { dao, isLoading, isError } = useDao({ chainid: daoChain, daoid: daoId });

  const sortedVaults = dao?.vaults
    ? [...dao.vaults].sort(
        (a, b) => Number(b.ragequittable) - Number(a.ragequittable)
      )
    : [];

  return (
    <SingleColumnLayout title="Safes">
      {isLoading && <Loading size={80} />}
      {isError && <ParMd>Failed to load safes.</ParMd>}
      {!isLoading && !isError && dao && sortedVaults.length === 0 && (
        <ParMd>No safes found.</ParMd>
      )}
      {!isLoading &&
        dao &&
        sortedVaults.map((vault) => (
          <SafeCard
            key={vault.id}
            dao={dao}
            safe={vault}
            daoChain={daoChain}
          />
        ))}
    </SingleColumnLayout>
  );
};
