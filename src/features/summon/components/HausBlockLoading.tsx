import { BlockImageContainer } from "./FormLayouts";

import hausBlock from "@/assets/summon/hausBlock.svg";
import hausBlockAnimated from "@/assets/summon/hausBlockAnimated.svg";

export const HausBlockLoading = ({ loading }: { loading: boolean }) => {
  return (
    <BlockImageContainer>
      <div className="img-block">
        <img
          src={loading ? hausBlockAnimated : hausBlock}
          alt="DAOhaus block pattern"
        />
      </div>
    </BlockImageContainer>
  );
};
