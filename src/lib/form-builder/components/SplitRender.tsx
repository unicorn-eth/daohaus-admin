import { Buildable, SplitColumn } from '@/lib/ui';
import { FormBuilderFactory } from '@/lib/form-builder/base';
import { FieldLego } from '../types/formLegoTypes';

type SplitColumnProps = {
  id: string;
  rows: { rowId: string; left: FieldLego; right: FieldLego }[];
};

export const SplitColumnLayout = ({
  rows,
  ...props
}: Buildable<SplitColumnProps>) => {
  return (
    <SplitColumn
      rows={rows.map(({ left, right, rowId }) => {
        return {
          rowId,
          left: <FormBuilderFactory {...props} field={left} />,
          right: <FormBuilderFactory {...props} field={right} />,
        };
      })}
    />
  );
};
