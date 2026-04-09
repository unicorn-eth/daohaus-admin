import { Buildable, FormSegment } from '@/lib/ui';
import { FieldLegoBase, LookupType } from '@/lib/utils';
import { ComponentProps } from 'react';
import { FormBuilderFactory } from '@/lib/form-builder/base';

type Props = Omit<
  Buildable<
    ComponentProps<typeof FormSegment> & {
      fields: FieldLegoBase<LookupType>[];
    }
  >,
  'formArea'
>;

export const SegmentRender = (props: Props) => {
  return (
    <FormSegment
      {...props}
      formArea={props.fields.map((field) => (
        <FormBuilderFactory key={field.id} field={field} />
      ))}
    />
  );
};
