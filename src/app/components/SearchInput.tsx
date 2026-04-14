import { ChangeEvent, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input, useDebounce } from '@/lib/ui';

type SearchInputProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalItems: number;
  singular?: string;
  plural?: string;
  full?: boolean;
};

export const SearchInput = ({
  searchTerm: _searchTerm,
  setSearchTerm,
  totalItems,
  singular = 'DAO',
  plural = 'DAOs',
  full,
}: SearchInputProps) => {
  const [localTerm, setLocalTerm] = useState('');
  const debouncedTerm = useDebounce(localTerm, 500);

  useEffect(() => {
    setSearchTerm(debouncedTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTerm]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalTerm(e.target.value);
  };

  return (
    <Input
      id="dao-search"
      icon={Search}
      placeholder={`Search ${totalItems} ${totalItems === 1 ? singular : plural}`}
      onChange={handleChange}
      defaultValue={localTerm}
      full={full}
    />
  );
};
