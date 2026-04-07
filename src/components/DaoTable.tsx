import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { indigoDark } from '@radix-ui/colors';
import { ProfileAvatar, Tag, ParMd } from '@/lib/ui';
import type { DaoItem, MemberItem } from '@/lib/dao-hooks';
import { getNetworkName } from '@/utils/chainIds';

type DaoWithMember = DaoItem & { members: MemberItem[] };

type DaoTableProps = {
  daos: DaoWithMember[];
  hexChainId: string;
};

const Table = styled.table`
  width: 100%;
  font-size: 1.4rem;
  line-height: 2.2rem;
  border-collapse: collapse;
`;

const Th = styled.th`
  color: ${indigoDark.indigo11};
  border-bottom: 1px solid ${indigoDark.indigo5};
  padding: 0.6rem 1rem;
  text-align: left;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 1.2rem 1rem;
  vertical-align: middle;
`;

const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DaoLink = styled(Link)`
  text-decoration: none;
  color: ${indigoDark.indigo11};
  &:hover {
    color: ${indigoDark.indigo12};
  }
`;

const Highlight = styled(ParMd)`
  color: ${indigoDark.indigo9};
`;

function computeVotingPower(shares: string, totalShares: string): string {
  if (!totalShares || totalShares === '0') return '0%';
  const pct = (Number(shares) / Number(totalShares)) * 100;
  return `${pct.toFixed(2)}%`;
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

export const DaoTable = ({ daos, hexChainId }: DaoTableProps) => {
  return (
    <Table>
      <thead>
        <tr>
          <Th>{daos.length} {daos.length === 1 ? 'DAO' : 'DAOs'}</Th>
          <Th>Members</Th>
          <Th>Proposals</Th>
          <Th>Power</Th>
          <Th>Network</Th>
        </tr>
      </thead>
      <tbody>
        {daos.map((dao) => {
          const member = dao.members?.[0];
          const displayName = dao.name || dao.id;
          const isDelegate = member && Number(member.delegateOfCount) > 0;

          return (
            <tr key={dao.id}>
              <Td>
                <NameCell>
                  <ProfileAvatar address={dao.id} image={dao.profile?.avatarImg} size="sm" />
                  <DaoLink to={`/molochv3/${hexChainId}/${dao.id}`}>
                    {truncate(displayName, 24)}
                  </DaoLink>
                  {isDelegate && <Tag tagColor="yellow">Delegate</Tag>}
                </NameCell>
              </Td>
              <Td>
                <Highlight>{dao.activeMemberCount ?? '—'}</Highlight>
              </Td>
              <Td>
                <Highlight>{dao.proposalCount ?? '—'}</Highlight>
              </Td>
              <Td>
                <Highlight>
                  {member
                    ? computeVotingPower(member.shares, dao.totalShares)
                    : '—'}
                </Highlight>
              </Td>
              <Td>
                <Highlight>{getNetworkName(hexChainId)}</Highlight>
              </Td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
