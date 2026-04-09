import { useState } from 'react';
import { useAccount } from 'wagmi';

import {
  SingleColumnLayout,
  ParMd,
  Loading,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/lib/ui';
import { useDao } from '@/lib/dao-hooks';
import { useCurrentDao } from '@/hooks/useCurrentDao';
import { useConnectedMember } from '@/hooks/useConnectedMember';
import { SafeCard } from '@/components/SafeCard';
import { AddSafeForm } from '@/components/AddSafeForm';

export const Safes = () => {
  const { daoChain, daoId } = useCurrentDao();
  const { dao, isLoading, isError } = useDao({ chainid: daoChain, daoid: daoId });
  const { connectedMember } = useConnectedMember();
  const [open, setOpen] = useState(false);

  const sortedVaults = dao?.vaults
    ? [...dao.vaults].sort((a, b) => Number(b.ragequittable) - Number(a.ragequittable))
    : [];

  return (
    <SingleColumnLayout
      title="Safes"
      actions={
        connectedMember ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button color="secondary">New Safe</Button>
            </DialogTrigger>
            <DialogContent title="Add Safe">
              <AddSafeForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        ) : undefined
      }
    >
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
            daoId={daoId}
          />
        ))}
    </SingleColumnLayout>
  );
};
