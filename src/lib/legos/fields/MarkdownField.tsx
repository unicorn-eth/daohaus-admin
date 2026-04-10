import { useState } from 'react';
import {
  Buildable, Button, Dialog, DialogTrigger, DialogContent,
  Field, Label, Card, WrappedTextArea,
} from '@/lib/ui';
import { useFormContext } from 'react-hook-form';
import { Pencil, Eye, Maximize, Minimize } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: right;
  margin-bottom: -2rem;
`;

const MarkDownContainer = styled.div`
  min-height: 12rem;
  max-height: 12rem;
  overflow-y: scroll;
  padding: 10px;
  margin-bottom: 5rem;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.secondary.step11};
  font-size: 1.5rem;
  font-family: inherit;
`;

const DialogMarkDownContainer = styled.div`
  height: 50rem;
  overflow-y: scroll;
  padding: 10px;
  margin-bottom: 5rem;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.secondary.step11};
  font-size: 1.5rem;
  font-family: inherit;
`;

const LabelContainer = styled(Label)`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  label {
    margin-right: 10px;
    margin-left: 10px;
  }
  svg {
    transform: translateY(0.1rem);
  }
`;

const DialogWrappedTextArea = styled(WrappedTextArea)`
  height: 50rem;
  overflow-y: scroll;
  padding: 10px;
  margin-bottom: 5rem;
  border-radius: 5px;
  font-size: 1.5rem;
  font-family: inherit;
`;

const DialogButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: right;
  margin-bottom: -2rem;
`;

const ContentWrapper = styled(Card)`
  border: none;
  min-width: 50vw;
  max-width: 90vw;
`;

export const MarkdownField = (props: Buildable<Field>) => {
  const { watch } = useFormContext();
  const value = watch(props.id);
  const [edit, setEdit] = useState(true);
  const [toggleFullscreen, setToggleFullscreen] = useState(false);

  return (
    <>
      <TabsContainer>
        <Button color="secondary" variant={!edit ? 'outline' : 'solid'} onClick={() => setEdit(true)} size="sm">
          <Pencil size={16} />
        </Button>
        <Button color="secondary" variant={edit ? 'outline' : 'solid'} onClick={() => setEdit(false)} size="sm">
          <Eye size={16} />
        </Button>
        <Dialog open={toggleFullscreen} onOpenChange={setToggleFullscreen}>
          <DialogTrigger asChild>
            <Button color="secondary" variant={toggleFullscreen ? 'outline' : 'solid'} size="sm">
              {toggleFullscreen ? <Maximize size={16} /> : <Minimize size={16} />}
            </Button>
          </DialogTrigger>
          <DialogContent title="Markdown Editor">
            <DialogButtonWrapper>
              <Button color="secondary" variant={!edit ? 'outline' : 'solid'} onClick={() => setEdit(true)} size="sm">
                <Pencil size={16} />
              </Button>
              <Button color="secondary" variant={edit ? 'outline' : 'solid'} onClick={() => setEdit(false)} size="sm">
                <Eye size={16} />
              </Button>
            </DialogButtonWrapper>
            <ContentWrapper>
              {edit ? (
                <DialogWrappedTextArea {...props} />
              ) : (
                <>
                  <LabelContainer><Label>Preview</Label></LabelContainer>
                  <DialogMarkDownContainer>
                    <ReactMarkdown>{value}</ReactMarkdown>
                  </DialogMarkDownContainer>
                </>
              )}
            </ContentWrapper>
          </DialogContent>
        </Dialog>
      </TabsContainer>
      {edit && !toggleFullscreen ? (
        <WrappedTextArea {...props} />
      ) : (
        <>
          <LabelContainer><Label>Preview</Label></LabelContainer>
          <MarkDownContainer>
            <ReactMarkdown>{value}</ReactMarkdown>
          </MarkDownContainer>
        </>
      )}
    </>
  );
};
