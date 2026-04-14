import { MessageCircle, Wrench } from "lucide-react";

import { Link, ParMd } from "../../atoms";

import { BannerProps } from "./Banner.types";
import { StyledBanner } from "./Banner.styles";
import { DISCORD_INVITE } from "@/lib/utils/constants/links";

export const Banner = ({
  className,
  bannerText = "DAOhaus v3 is currently in beta. Please report bugs, request features or provide feedback.",
}: BannerProps) => {
  return (
    <StyledBanner className={className}>
      <div className="banner--text-container">
        <Wrench />
        <ParMd>{bannerText}</ParMd>
      </div>
      <div className="banner--link-container">
        <Link showExternalIcon={false} href={DISCORD_INVITE}>
          <MessageCircle />
          Support
        </Link>
      </div>
    </StyledBanner>
  );
};
