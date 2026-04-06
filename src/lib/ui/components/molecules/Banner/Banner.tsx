import { MessageCircle, Wrench } from 'lucide-react';

import { Link, ParMd } from '../../atoms';

import { BannerProps } from './Banner.types';
import { StyledBanner } from './Banner.styles';

export const Banner = ({
  className,
  bannerText = 'DAOhaus v3 is currently in beta. Please report bugs, request features or provide feedback.',
}: BannerProps) => {
  return (
    <StyledBanner className={className}>
      <div className="banner--text-container">
        <Wrench />
        <ParMd>{bannerText}</ParMd>
      </div>
      <div className="banner--link-container">
        <Link
          href="https://github.com/HausDAO/daohaus-monorepo/issues/new/choose"
          showExternalIcon={false}
          className="banner--link-item"
        >
          Give Feedback
        </Link>
        <Link showExternalIcon={false} href="https://discord.gg/kJaVkXtsXA">
          <MessageCircle />
          Support
        </Link>
      </div>
    </StyledBanner>
  );
};
