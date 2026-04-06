import { LucideIcon } from 'lucide-react';

import { Field } from '../../../types/formAndField';

export type InputProps = Field & {
  icon?: LucideIcon;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  className?: string;
};
