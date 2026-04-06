import React from 'react';
import { X } from 'lucide-react';

import { DialogProps } from './Dialog.types';
import { Button, H5 } from '../../atoms';
import {
  DialogRoot,
  DialogPrimitiveTrigger,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogPortal,
  StyledDialogContent,
  StyledDialogOverlay,
  HeaderContainer,
  DialogBody,
  ButtonContainer,
  CloseIcon,
} from './Dialog.styles';

export const Dialog = DialogRoot;
export const DialogTrigger = DialogPrimitiveTrigger;

export const DialogContent = React.forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      title,
      children,
      description,
      alignButtons = 'end',
      leftButton,
      rightButton,
      ...props
    },
    ref
  ) => {
    return (
      <DialogPortal>
        <StyledDialogOverlay />
        <StyledDialogContent {...props} ref={ref}>
          <div>
            <HeaderContainer>
              <DialogTitle asChild>
                <H5>{title}</H5>
              </DialogTitle>
              <DialogClose asChild>
                <CloseIcon>
                  <X aria-hidden />
                </CloseIcon>
              </DialogClose>
            </HeaderContainer>
            <DialogBody>
              <DialogDescription>{description}</DialogDescription>
            </DialogBody>
            {children}
          </div>
          {(leftButton || rightButton) && (
            <ButtonContainer align={alignButtons}>
              {leftButton && (
                <Button color="secondary" size="sm" {...leftButton}>
                  {leftButton?.children}
                </Button>
              )}
              {rightButton && rightButton.$closeDialog ? (
                <DialogClose asChild>
                  <Button color="secondary" size="sm" {...rightButton}>
                    Close
                  </Button>
                </DialogClose>
              ) : (
                <Button color="secondary" size="sm" {...rightButton}>
                  {rightButton?.children}
                </Button>
              )}
            </ButtonContainer>
          )}
        </StyledDialogContent>
      </DialogPortal>
    );
  }
);
