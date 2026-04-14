import { Component, ErrorInfo, ReactNode } from "react";
import { ParMd, ParSm, Button } from "@/lib/ui";
import styled from "styled-components";

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
  padding: 8rem 2rem;
  text-align: center;
`;

const ErrorMessage = styled(ParSm)`
  color: ${({ theme }) => theme.secondary.step9};
  font-family: monospace;
  max-width: 48rem;
  word-break: break-word;
`;

const Actions = styled.div`
  display: flex;
  gap: 1.2rem;
`;

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Hook point for future error reporting (e.g. Sentry)
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <Wrapper>
          <ParMd>Something went wrong</ParMd>
          <ErrorMessage>{this.state.error.message}</ErrorMessage>
          <Actions>
            <Button size="sm" color="secondary" onClick={this.reset}>
              Try again
            </Button>
            <Button size="sm" color="secondary" variant="outline" onClick={() => window.location.assign("/")}>
              Go home
            </Button>
          </Actions>
        </Wrapper>
      );
    }

    return this.props.children;
  }
}
