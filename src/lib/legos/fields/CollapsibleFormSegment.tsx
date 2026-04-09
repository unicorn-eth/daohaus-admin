import { CollapsibleCard, H5, ParMd } from '@/lib/ui';
import { ReactNode } from 'react';

type SegmentType = {
  actionButton?: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  title?: string | ReactNode;
  description?: string | ReactNode;
  formArea: ReactNode;
  infoArea?: ReactNode;
  error?: ReactNode;
};

export const CollapsibleFormSegment = ({
  actionButton,
  defaultOpen,
  title,
  description,
  formArea,
  infoArea,
  error,
}: SegmentType) => {
  return (
    <CollapsibleCard
      children={
        <div>
          <H5 className="segment-title">{title}</H5>
          <ParMd className="segment-description">{description}</ParMd>
        </div>
      }
      collapsibleActions={actionButton}
      collapsibleContent={
        <div>
          {formArea}
          {infoArea}
          {error}
        </div>
      }
      defaultOpen={defaultOpen}
      triggerLabel={''}
      width="100%"
    />
  );
};
