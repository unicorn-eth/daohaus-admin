import React from 'react';
import classNames from 'classnames';

import { FileInputProps } from '../../../types/formAndField';
import { BaseFileInput } from './FileInput.styles';

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>((props, ref) => {
  const { id, success, warning, error, multiple, className } = props;

  const inputClasses = classNames({
    success,
    warning,
    error,
  });

  return (
    <BaseFileInput
      key={id}
      name={id}
      className={`${inputClasses} ${className}`}
      ref={ref}
      type="file"
      multiple={multiple}
      {...props}
    />
  );
});
