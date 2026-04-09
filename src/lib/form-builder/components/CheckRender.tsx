import { ComponentProps } from 'react';
import { useFormContext } from 'react-hook-form';
import { Buildable, CheckGate } from '@/lib/ui';
import { FormBuilderFactory } from '@/lib/form-builder/base';

type CheckRenderProps = Omit<
  Buildable<
    ComponentProps<typeof CheckGate> & {
      gateLabel: string;
      components: any[];
    }
  >,
  'fields'
>;

export const CheckRender = ({
  gateLabel,
  ...props
}: Buildable<CheckRenderProps>) => {
  const { setValue } = useFormContext();

  return (
    <CheckGate
      fields={props.components.map((field) => (
        <FormBuilderFactory key={field?.id} field={field} />
      ))}
      {...props}
      gateLabel={gateLabel}
      onUnchecked={() => {
        props.components.forEach((field) => {
          if (field.defaultValue) setValue(field.id, field.defaultValue);
        });
      }}
    />
  );
};

export default CheckRender;
