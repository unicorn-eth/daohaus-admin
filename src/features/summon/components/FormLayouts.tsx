import styled from "styled-components";

import { widthQuery } from "@/lib/ui/theme/global/breakpoints";

export const TextAreaSection = styled.div`
  width: 100%;
  margin-bottom: 3.4rem;

  .link {
    margin-bottom: 2rem;
  }

  .number-display {
    margin-bottom: 2rem;
  }
`;

export const CenterLayout = styled.main`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 3rem;

  .main-column {
    width: 58rem;
    max-width: 100%;
  }

  .title-section {
    margin-bottom: 10rem;
  }

  .top-divider {
    margin-top: 3rem;
    margin-bottom: 2.4rem;
  }

  @media ${widthQuery.sm} {
    margin-top: 1rem;

    .title-section {
      margin-bottom: 4rem;
    }
  }
`;

export const BlockImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26rem;
  margin-bottom: 2rem;

  .img-block {
    display: flex;
    width: 12rem;
    height: 12rem;
  }

  img {
    width: 12rem;
    height: 12rem;
  }
`;

export const InfoSection = styled.div`
  p,
  a {
    margin-bottom: 1.6rem;
  }
`;
