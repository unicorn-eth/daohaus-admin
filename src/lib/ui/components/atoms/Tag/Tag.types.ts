import { ReactNode } from 'react';

import { LucideIcon } from 'lucide-react';

export type TagColors = 'blue' | 'green' | 'pink' | 'violet' | 'yellow' | 'red';

export type TagProps = {
  children: ReactNode;
  tagColor: TagColors;
  className?: string;
  IconLeft?: LucideIcon;
  IconRight?: LucideIcon;
  fontSize?: string;
};
