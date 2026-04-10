import { forwardRef, useState } from 'react';
import { Buildable, Button, Field, FieldWrapper } from '@/lib/ui';
import { useFormContext } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, ChevronDown } from 'lucide-react';
import { createGlobalStyle } from 'styled-components';

export const EpochDatePicker = (props: Buildable<Field>) => {
  const { setValue } = useFormContext();
  const [startDate, setStartDate] = useState(new Date());

  const handleChange = (date: Date | null) => {
    if (!date) return;
    setStartDate(date);
    setValue(props.id, +date / 1000);
  };

  const DatePickerWrapperStylesLg = createGlobalStyle`
    .react-datepicker {
      font-size: 2rem;
      font-family: inherit;
    }
    .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
      width: 5rem;
      height: 3rem;
    }
    .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box,
    .react-datepicker__time-container {
      width: 150px;
      height: 200px;
    }
    .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list {
      height: 200px;
    }
  `;

  interface Props {
    onClick?: () => void;
    value?: string | number;
  }
  const CustomInput = forwardRef<HTMLButtonElement, Props>(({ value, onClick }, ref) => (
    <Button
      IconLeft={Calendar}
      IconRight={ChevronDown}
      className="custom-button-input"
      onClick={onClick}
      ref={ref}
    >
      {value}
    </Button>
  ));

  return (
    <FieldWrapper
      id={props.id}
      label={props?.label}
      rules={props?.rules}
      helperText={props?.helperText}
    >
      <DatePicker
        id={props.id}
        selected={startDate}
        onChange={(date: Date | null) => handleChange(date)}
        showTimeSelect
        customInput={<CustomInput />}
        wrapperClassName={props?.className}
        dateFormat="Pp"
      />
      {props?.className === 'lg' && <DatePickerWrapperStylesLg />}
    </FieldWrapper>
  );
};
