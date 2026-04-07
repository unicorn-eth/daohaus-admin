import { ChangeEvent } from 'react';
import styled from 'styled-components';
import { Label, Select, widthQuery } from '@/lib/ui';

type SortOption = { name: string; value: string };

type SortDropdownProps = {
  id: string;
  label?: string;
  value: string;
  options: SortOption[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

const SelectBox = styled.div`
  display: flex;
  align-items: center;
  width: 32rem;
  label {
    display: block;
    width: 10rem;
    white-space: nowrap;
  }
  @media ${widthQuery.sm} {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    label {
      margin-bottom: 0.6rem;
    }
  }
`;

export const SortDropdown = ({
  id,
  label = 'Sort By',
  value,
  options,
  onChange,
}: SortDropdownProps) => {
  return (
    <SelectBox>
      <Label id={`${id}-label`}>{label}</Label>
      <Select
        id={id}
        options={options.map((o) => ({ name: o.name, value: o.value }))}
        value={value}
        onChange={onChange}
        full
      />
    </SelectBox>
  );
};
