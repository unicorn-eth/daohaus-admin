import styled from 'styled-components';
import { H1, ParMd, ParXl } from '@/lib/ui';

const ViewBox = styled.div`
  width: 100%;
  min-height: 40rem;
  display: flex;
  margin-top: 4rem;

  .text-section {
    width: 100%;
    max-width: 48rem;
  }
  .hero {
    font-size: 6rem;
    font-weight: 900;
    margin-bottom: 1.6rem;
  }
  .tag-line {
    font-size: 2rem;
    margin-bottom: 2.4rem;
    font-weight: 700;
  }
  .ascii-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 1.6rem;
    margin-bottom: 2.4rem;
  }
  .ascii-card {
    padding: 1.6rem 1.8rem;
    border: 0.1rem solid rgba(0, 0, 0, 0.14);
    border-radius: 1.2rem;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 0 0.8rem 2.4rem rgba(0, 0, 0, 0.08);
  }
  .ascii-label {
    display: block;
    margin-bottom: 0.8rem;
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  pre {
    margin: 0;
    font-size: 1.4rem;
    line-height: 1.3;
    font-family: 'Courier New', Courier, monospace;
    white-space: pre;
  }
  ul {
    padding-inline-start: 2.4rem;
    margin-top: 1.6rem;
  }
  li {
    font-size: 1.6rem;
    margin-bottom: 0.8rem;
  }
  @media (max-width: 640px) {
    .hero {
      font-size: 4.8rem;
    }
    pre {
      font-size: 1.2rem;
    }
  }
`;

const prismBanner = String.raw` ____  ____  ___ ____  __  __
|  _ \|  _ \|_ _/ ___||  \/  |
| |_) | |_) || |\___ \| |\/| |
|  __/|  _ < | | ___) | |  | |
|_|   |_| \_\___|____/|_|  |_|

__        ___    ____    _   _ _____ ____  _____ _
\ \      / / \  / ___|  | | | | ____|  _ \| ____| |
 \ \ /\ / / _ \ \___ \  | |_| |  _| | |_) |  _| | |
  \ V  V / ___ \ ___) | |  _  | |___|  _ <| |___|_|
   \_/\_/_/   \_\____/  |_| |_|_____|_| \_\_____(_)`;

const kittyBanner = String.raw` /\_/\\
( o.o )
 > ^ <`;

export const HomeNotConnected = () => {
  return (
    <ViewBox>
      <div className="text-section">
        <H1 className="hero">HUB</H1>
        <ParXl className="tag-line">
          Schelling point for all your DAO activity
        </ParXl>
        <div className="ascii-wrap">
          <div className="ascii-card">
            <span className="ascii-label">Signal</span>
            <pre>{prismBanner}</pre>
          </div>
          <div className="ascii-card">
            <span className="ascii-label">Kitty</span>
            <pre>{kittyBanner}</pre>
          </div>
        </div>
        <ParMd>Connect a wallet to:</ParMd>
        <ul>
          <li>
            <ParMd>See all your DAOs</ParMd>
          </li>
          <li>
            <ParMd>View Active Proposals</ParMd>
          </li>
          <li>
            <ParMd>Manage your shared profile</ParMd>
          </li>
        </ul>
      </div>
    </ViewBox>
  );
};
