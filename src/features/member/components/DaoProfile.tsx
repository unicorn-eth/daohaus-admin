import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  GitFork,
  MessageCircle,
  Globe,
  Send,
  FileText,
  MessageSquare,
  Link2,
} from "lucide-react";

import type { DaoItem, DaoProfileLink } from "@/lib/dao-hooks";
import type { TagColors } from "@/lib/ui";
import {
  AddressDisplay,
  DataMd,
  H4,
  ParMd,
  ParXs,
  ProfileAvatar,
  Tag,
  widthQuery,
  Link as UiLink,
} from "@/lib/ui";
import type { Keychain } from "@/lib/keychain-utils";
import { charLimit } from "@/lib/utils";
import { useCurrentDao } from "@/app/hooks/useCurrentDao";

// ---- helpers ----------------------------------------------------------------

const PREDEFINED_LABELS = [
  "Github",
  "Discord",
  "Twitter",
  "Telegram",
  "Blog",
  "Web",
];

const LINK_ICONS: Record<string, React.ReactNode> = {
  Github: <GitFork size="2.5rem" />,
  Discord: <MessageSquare size="2.5rem" />,
  Twitter: <MessageCircle size="2.5rem" />,
  Telegram: <Send size="2.5rem" />,
  Blog: <FileText size="2.5rem" />,
  Web: <Globe size="2.5rem" />,
  default: <Link2 size="2.5rem" />,
};

const TAG_COLORS: TagColors[] = [
  "violet",
  "green",
  "blue",
  "pink",
  "yellow",
  "red",
];

function missingDaoProfileData(dao: DaoItem): boolean {
  return !dao.profile?.description && !dao.profile?.avatarImg;
}

function parseLinks(links?: DaoProfileLink[]): DaoProfileLink[] {
  if (!Array.isArray(links)) return [];
  return links.map((l) => {
    if (typeof l === "string") {
      try {
        return JSON.parse(l) as DaoProfileLink;
      } catch {
        return {};
      }
    }
    return l;
  });
}

function isPredefinedLink(link: DaoProfileLink): boolean {
  return !!link.label && PREDEFINED_LABELS.includes(link.label);
}

// ---- styles -----------------------------------------------------------------

const Container = styled.div`
  width: 100%;
  border-radius: ${({ theme }) => theme.card.radius};
  border: 1px ${({ theme }) => theme.secondary.step5} solid;
  background-color: ${({ theme }) => theme.secondary.step3};
  padding: 2.2rem;

  .avatar-row {
    display: flex;
    align-items: center;
    gap: 1.7rem;
    margin-bottom: 2.7rem;
    @media ${widthQuery.xs} {
      flex-direction: column;
    }
  }
`;

const MissingCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.3rem;
  background-color: ${({ theme }) => theme.secondary.step2};
  border: 1px solid ${({ theme }) => theme.secondary.step5};
  border-radius: ${({ theme }) => theme.card.radius};
  padding: 2rem;
`;

const SettingsLink = styled(Link)`
  color: ${({ theme }) => theme.primary.step9};
  font-size: ${({ theme }) => theme.font.size.sm};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

// Icon-only row for social/predefined links
const IconLinkRow = styled.div`
  display: flex;
  gap: 1.5rem;
  margin: 1.5rem 0;
  color: ${({ theme }) => theme.primary.step10};

  a {
    color: inherit;
    display: flex;
    align-items: center;
  }
`;

// Label + icon row for custom links
const TextLinkRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;

  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${({ theme }) => theme.secondary.step11};
    text-decoration: none;
    &:hover {
      color: ${({ theme }) => theme.secondary.step12};
    }
  }
`;

const TagListContainer = styled.div`
  margin-top: 2.8rem;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

// ---- component --------------------------------------------------------------

type DaoProfileProps = {
  dao: DaoItem;
};

export const DaoProfile = ({ dao }: DaoProfileProps) => {
  const { daoChain, daoId } = useCurrentDao();

  const hasMissingProfile = missingDaoProfileData(dao);
  const links = parseLinks(dao.profile?.links);
  const iconLinks = links.filter((l) => l.url && isPredefinedLink(l));
  const textLinks = links.filter((l) => l.url && !isPredefinedLink(l));
  const tags = dao.profile?.tags?.filter(Boolean) ?? [];

  return (
    <Container>
      <div className="avatar-row">
        <ProfileAvatar
          address={dao.id}
          image={dao.profile?.avatarImg}
          size="5xl"
        />
        <div>
          <H4>{charLimit(dao.name, 21)}</H4>
          <AddressDisplay
            address={dao.id}
            truncate
            copy
            explorerNetworkId={daoChain as keyof Keychain}
          />
        </div>
      </div>

      {hasMissingProfile ? (
        <MissingCard>
          <ParXs>
            (ﾉ´ヮ`)ﾉ*: ･ﾟ Add some sparkle with a DAO avatar and description!
          </ParXs>
          <SettingsLink to={`/molochv3/${daoChain}/${daoId}/settings`}>
            Go To Settings
          </SettingsLink>
        </MissingCard>
      ) : (
        <>
          {dao.profile?.description && <ParMd>{dao.profile.description}</ParMd>}

          {iconLinks.length > 0 && (
            <IconLinkRow>
              {iconLinks.map((link, i) => (
                <UiLink
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label}
                  showExternalIcon={false}
                >
                  {(link.label && LINK_ICONS[link.label]) ?? LINK_ICONS.default}
                </UiLink>
              ))}
            </IconLinkRow>
          )}

          {textLinks.length > 0 && (
            <TextLinkRow>
              {textLinks.map((link, i) => (
                <UiLink
                  key={i}
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

          {tags.length > 0 && (
            <TagListContainer>
              <TagContainer>
                {tags.map((tag, i) => (
                  <Tag key={tag} tagColor={TAG_COLORS[i % TAG_COLORS.length]}>
                    {tag}
                  </Tag>
                ))}
              </TagContainer>
            </TagListContainer>
          )}
        </>
      )}
    </Container>
  );
};
