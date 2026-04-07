import { SingleColumnLayout, Loading, ParMd } from "@/lib/ui";
import { useDao } from "@/lib/dao-hooks";
import { useCurrentDao } from "@/hooks/useCurrentDao";
import { DaoOverviewCard } from "@/components/DaoOverviewCard";

export const DaoOverview = () => {
  const { daoChain, daoId } = useCurrentDao();
  const { dao, isLoading, isError } = useDao({ chainid: daoChain, daoid: daoId });

  if (isLoading) {
    return (
      <SingleColumnLayout>
        <Loading size={80} />
      </SingleColumnLayout>
    );
  }

  if (isError || !dao) {
    return (
      <SingleColumnLayout>
        <ParMd>Failed to load DAO data.</ParMd>
      </SingleColumnLayout>
    );
  }

  return (
    <SingleColumnLayout>
      <DaoOverviewCard dao={dao} />
    </SingleColumnLayout>
  );
};
