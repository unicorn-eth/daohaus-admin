import styled from "styled-components";
import { indigoDark } from "@radix-ui/colors";
import { ExternalLink } from "lucide-react";

import {
  H3,
  ParSm,
  ParXs,
  DataIndicator,
  Tag,
  ProfileAvatar,
} from "@/lib/ui";
import { charLimit, formatLongDateFromSeconds } from "@/lib/utils";
import type { DaoItem } from "@/lib/dao-hooks";

// ── Styles ──────────────────────────────────────────────────────────────────

const SettingsSection = styled.div`
  width: 100%;
  padding: 3rem;
  background-color: ${({ theme }) => theme.secondary.step3};
  border-radius: 0.8rem;
  margin-bottom: 3rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const MetaContent = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 3.4rem;
`;

const MetaBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  min-width: 24rem;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 0.4rem;
`;

const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const LinkItem = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${({ theme }) => theme.primary.step10};
  text-decoration: none;
  font-size: 1.4rem;
  &:hover {
    text-decoration: underline;
  }
`;

const LabelledValue = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled(ParXs)`
  color: ${indigoDark.indigo11};
`;

// ── Component ────────────────────────────────────────────────────────────────

type MetadataSettingsProps = {
  dao: DaoItem;
};

export const MetadataSettings = ({ dao }: MetadataSettingsProps) => {
  const profile = dao.profile;

  return (
    <SettingsSection>
      <SectionHeader>
        <H3>Metadata</H3>
      </SectionHeader>

      <MetaContent>
        <div>
          <ParSm>Icon</ParSm>
          <ProfileAvatar
            address={dao.id}
            image={profile?.avatarImg}
            size="4xl"
          />
        </div>

        <MetaBlock>
          <DataIndicator label="DAO Name" data={charLimit(dao.name, 21)} size="sm" />
          <DataIndicator
            label="Summon Date"
            data={formatLongDateFromSeconds(dao.createdAt)}
            size="sm"
          />
          {profile?.description && (
            <DataIndicator
              label="Description"
              data={profile.description}
              size="sm"
            />
          )}
          {profile?.tags && profile.tags.length > 0 && (
            <LabelledValue>
              <Label>Tags</Label>
              <TagList>
                {profile.tags.map((tag) => (
                  <Tag key={tag} tagColor="blue">
                    {tag}
                  </Tag>
                ))}
              </TagList>
            </LabelledValue>
          )}
        </MetaBlock>

        {profile?.links && profile.links.length > 0 && (
          <MetaBlock>
            <LabelledValue>
              <Label>Links</Label>
              <LinkList>
                {profile.links.map((link, i) =>
                  link.url ? (
                    <LinkItem
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label || link.url}
                      <ExternalLink size={12} />
                    </LinkItem>
                  ) : null
                )}
              </LinkList>
            </LabelledValue>
          </MetaBlock>
        )}
      </MetaContent>
    </SettingsSection>
  );
};
