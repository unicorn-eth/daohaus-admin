import { Link as RouterLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import styled from 'styled-components';

import { Bold, DataSm, ParMd, Tabs } from '@/lib/ui';
import { useCurrentDao } from '@/hooks/useCurrentDao';
import type { CustomFormLego } from '@/legos/legoConfig';

const ListContainer = styled.div`
  margin-top: 2.5rem;
`;

const ListItemContainer = styled.div`
  width: 100%;
  padding: 1rem 0;
  border-top: 1px ${({ theme }) => theme.secondary.step6} solid;
`;

const ListItemLink = styled(RouterLink)`
  text-decoration: none;
  width: 100%;
  color: unset;
  &:hover {
    text-decoration: none;
  }
`;

const ListItemHoverContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.card.radius};

  &:hover {
    background: ${({ theme }) => theme.secondary.step3};
  }
`;

const ListItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  word-wrap: break-word;
  max-width: 39rem;
`;

const StyledChevron = styled(ChevronRight)`
  color: ${({ theme }) => theme.primary.step9};
  width: 3rem;
  height: 3rem;
`;

type NewProposalListProps = {
  basicProposals: CustomFormLego[];
  advancedProposals: CustomFormLego[];
};

const ProposalList = ({ proposals }: { proposals: CustomFormLego[] }) => {
  const { daoChain, daoId } = useCurrentDao();

  return (
    <div>
      {proposals.map((proposalLego: CustomFormLego) => (
        <ListItemContainer key={proposalLego.id}>
          <ListItemLink
            to={`/molochv3/${daoChain}/${daoId}/new-proposal?formLego=${proposalLego.id}`}
          >
            <ListItemHoverContainer>
              <ListItem>
                <ParMd>
                  <Bold>{proposalLego.title}</Bold>
                </ParMd>
                <DataSm>{proposalLego.description}</DataSm>
              </ListItem>
              <StyledChevron />
            </ListItemHoverContainer>
          </ListItemLink>
        </ListItemContainer>
      ))}
    </div>
  );
};

export const NewProposalList = ({
  basicProposals,
  advancedProposals,
}: NewProposalListProps) => {
  return (
    <ListContainer>
      <Tabs
        tabList={[
          {
            label: 'Basics',
            Component: () => <ProposalList proposals={basicProposals} />,
          },
          {
            label: 'Advanced',
            Component: () => <ProposalList proposals={advancedProposals} />,
          },
        ]}
      />
    </ListContainer>
  );
};
