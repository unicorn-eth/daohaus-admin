import { Link } from 'react-router-dom';
import { useAccount, useChainId } from 'wagmi';
import { useDaosForAddress } from '@/lib/dao-hooks';
import { toHexChainId } from '@/utils/chainIds';
import type { DaoItem, MemberItem } from '@/types';

type DaoWithMember = DaoItem & { members: MemberItem[] };

export const Home = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const hexChainId = toHexChainId(chainId);

  const { daos, isLoading, isError } = useDaosForAddress({
    chainid: hexChainId,
    address: address?.toLowerCase(),
  });

  if (!isConnected) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Connect your wallet to see your DAOs.</p>
      </div>
    );
  }

  if (!hexChainId) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Unsupported network. Switch to a supported chain.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your DAOs</h2>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Failed to load DAOs.</p>}
      {!isLoading && !isError && daos?.length === 0 && (
        <p>No DAOs found on this network for your address.</p>
      )}
      {daos && daos.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(daos as unknown as DaoWithMember[]).map((dao) => (
            <li key={dao.id}>
              <Link to={`/molochv3/${hexChainId}/${dao.id}`}>
                <strong>{dao.name || dao.id}</strong>
              </Link>
              {dao.members?.[0] && (
                <span style={{ marginLeft: '1rem', color: '#888', fontSize: '0.875rem' }}>
                  {dao.members[0].shares} shares
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
