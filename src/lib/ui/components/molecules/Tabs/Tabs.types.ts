import { ReactElement } from 'react';

export interface Tab {
  label: string;
  Component: () => ReactElement;
}

export type State = {
  selected: number;
};

export type TabsProps = {
  tabList: [];
  className?: string;
};

export type Action = { type: 'selected'; payload: number };
