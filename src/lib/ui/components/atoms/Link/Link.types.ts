import { LucideIcon } from 'lucide-react';

export interface LinkProps extends React.ComponentPropsWithRef<'a'> {
  href?: string;
  target?: string;
  RightIcon?: LucideIcon | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  LeftIcon?: LucideIcon | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  selected?: boolean;
  showExternalIcon?: boolean;
  disabled?: boolean;
}

type NewElementProps<Element extends React.ElementType> = {
  as?: Element;
  disabled?: boolean;
};

export type PolymorphicLinkProps<Element extends React.ElementType> =
  React.PropsWithChildren<NewElementProps<Element>> &
    Omit<
      React.ComponentPropsWithoutRef<Element>,
      keyof NewElementProps<Element>
    >;
