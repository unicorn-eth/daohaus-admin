import styled from 'styled-components';
import { ReactNode } from 'react';

const SpacerDiv = styled.div`
  margin-bottom: 2.4rem;
`;

export const FieldSpacer = ({ children }: { children?: ReactNode }) => {
  return <SpacerDiv>{children}</SpacerDiv>;
};
