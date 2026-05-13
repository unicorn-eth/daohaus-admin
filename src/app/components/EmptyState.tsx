import styled from "styled-components";
import { ParMd, ParSm } from "@/lib/ui";

type EmptyStateVariant = "default" | "error";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: EmptyStateVariant;
};

const Wrapper = styled.div<{ $variant: EmptyStateVariant }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  padding: 6rem 2rem;
  text-align: center;
  color: ${({ theme, $variant }) =>
    $variant === "error" ? theme.danger.step9 : theme.secondary.step9};
`;

const Description = styled(ParSm)`
  color: ${({ theme }) => theme.secondary.step9};
  max-width: 36rem;
`;

export const EmptyState = ({
  title,
  description,
  action,
  variant = "default",
}: EmptyStateProps) => (
  <Wrapper $variant={variant}>
    <ParMd>{title}</ParMd>
    {description && <Description>{description}</Description>}
    {action}
  </Wrapper>
);
