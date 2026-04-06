import { LucideIcon } from 'lucide-react';

export interface IApp {
  name: string;
  url: string;
  Icon?: LucideIcon | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export type AppSwitcherProps = {
  currentApp: IApp;
  apps: IApp[];
  spacing?: string;
  width?: string;
  menuBg?: string;
  className?: string;
};
