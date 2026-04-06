import { LucideIcon } from 'lucide-react';

import { ButtonProps } from './Button.types';

type OmittedButtonProps =
  | 'IconLeft'
  | 'IconRight'
  | 'justify'
  | 'fullWidth'
  | 'loadingText';

export interface IconButtonProps extends Omit<ButtonProps, OmittedButtonProps> {
  Icon: LucideIcon | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}
