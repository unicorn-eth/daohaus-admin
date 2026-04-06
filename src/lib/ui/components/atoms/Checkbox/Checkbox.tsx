import React from 'react';
import classNames from 'classnames';
import { Check, Asterisk } from 'lucide-react';

import { Label } from '../Label/Label';
import { Icon } from '../Icon';
import type { CheckboxProps } from './Checkbox.types';
import {
  StyledCheckbox,
  StyledIndicator,
  Container,
  LabelContainer,
  RequiredAsterisk,
} from './Checkbox.styles';

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (props, ref) => {
    const { id, title, disabled, required } = props;

    const classes = classNames({
      disabled,
    });

    return (
      <Container>
        <StyledCheckbox {...props} ref={ref}>
          <StyledIndicator className={classes}>
            <Check />
          </StyledIndicator>
        </StyledCheckbox>
        <LabelContainer>
          {required && (
            <RequiredAsterisk>
              <Icon label="Required">
                <Asterisk />
              </Icon>
            </RequiredAsterisk>
          )}
          <Label id={id}>{title ? title : 'No Title Found'}</Label>
        </LabelContainer>
      </Container>
    );
  }
);
