import styled from "styled-components";
import { indigoDark } from "@radix-ui/colors";
import {
  GitFork,
  MessageCircle,
  Globe,
  Send,
  FileText,
  MessageSquare,
  Link2,
} from "lucide-react";

import {
  H3,
  ParSm,
  ParXs,
  DataIndicator,
  Tag,
  ProfileAvatar,
  DataMd,
  Link as UiLink,
} from "@/lib/ui";
import { charLimit, formatLongDateFromSeconds } from "@/lib/utils";
import type { DaoItem, DaoProfileLink } from "@/lib/dao-hooks";

const PREDEFINED_LABELS = [
  "Github",
  "Discord",
  "Twitter",
  "Telegram",
  "Blog",
  "Web",
];

const LINK_ICONS: Record<string, React.ReactNode> = {
  Github: <GitFork size="2.2rem" />,
  Discord: <MessageSquare size="2.2rem" />,
  Twitter: <MessageCircle size="2.2rem" />,
  Telegram: <Send size="2.2rem" />,
  Blog: <FileText size="2.2rem" />,
  Web: <Globe size="2.2rem" />,
  default: <Link2 size="2.2rem" />,
};

function parseLinks(links?: DaoProfileLink[]): DaoProfileLink[] {
  if (!Array.isArray(links)) return [];
  return links.map((link) => {
    if (typeof link === "string") {
      try {
        return JSON.parse(link) as DaoProfileLink;
      } catch {
        return {};
      }
    }
    return link;
  });
}

function isPredefinedLink(link: DaoProfileLink): boolean {
  return !!link.label && PREDEFINED_LABELS.includes(link.label);
}

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

const IconLinkRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 0.8rem;
  color: ${({ theme }) => theme.primary.step10};

  a {
    color: inherit;
    display: flex;
    align-items: center;
  }
`;

const TextLinkRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 1.2rem;

  a {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: ${({ theme }) => theme.secondary.step11};
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.secondary.step12};
    }
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
  const links = parseLinks(profile?.links);
  const iconLinks = links.filter((link) => link.url && isPredefinedLink(link));
  const textLinks = links.filter((link) => link.url && !isPredefinedLink(link));

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
          <DataIndicator
            label="DAO Name"
            data={charLimit(dao.name, 21)}
            size="sm"
          />
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

        {links.length > 0 && (
          <MetaBlock>
            <LabelledValue>
              {iconLinks.length > 0 && (
                <IconLinkRow>
                  {iconLinks.map((link, i) => (
                    <UiLink
                      key={`${link.label}-${i}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.label}
                      showExternalIcon={false}
                    >
                      {(link.label && LINK_ICONS[link.label]) ??
                        LINK_ICONS.default}
                    </UiLink>
                  ))}
                </IconLinkRow>
              )}
              {textLinks.length > 0 && (
                <TextLinkRow>
                  {textLinks.map((link, i) => (
                    <UiLink
                      key={`${link.label || link.url}-${i}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.label}
                      showExternalIcon={false}
                    >
                      {LINK_ICONS.default}
                      <DataMd>{charLimit(link.label || link.url, 45)}</DataMd>
                    </UiLink>
                  ))}
                </TextLinkRow>
              )}
            </LabelledValue>
          </MetaBlock>
        )}
      </MetaContent>
    </SettingsSection>
  );
};
