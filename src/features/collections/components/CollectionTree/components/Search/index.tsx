import slots from "@/shared/ui/base/slots.module.css";
import { FC, useEffect } from 'react';

import { Input } from '@/shared/ui/base';

import { useDebounce, useSafeState } from 'ahooks';
import i18next from 'i18next';

import { TreeDataFilterParams } from '@/features/collections/types/tree';
import IconFont from '@/shared/ui/IconFont';

import { SearchContainer } from './style';


interface Props {
  treeDataFilterParams: TreeDataFilterParams;
  setTreeDataFilterParams: (params: TreeDataFilterParams) => void;
  searchInputPlaceholder?: string;
}

const Search: FC<Props> = ({
  treeDataFilterParams,
  setTreeDataFilterParams,
  searchInputPlaceholder = i18next.t('search_tree.api_search_tip'),
}) => {

  const [searchValue, setSearchValue] = useSafeState(treeDataFilterParams.value);
  const debouncedSearchValue = useDebounce(searchValue, { wait: 500 });


  useEffect(() => {
    handleChange('value', debouncedSearchValue);
  }, [debouncedSearchValue]);

  const handleChange = (field: string, value: string) => {
    setTreeDataFilterParams({
      ...treeDataFilterParams,
      [field]: value,
    });
  };
  
  return (
    <SearchContainer>
      <div className={slots["search-wrap"]}>
          <Input
            prefix={<IconFont style={{color:"var(--vscode-input-placeholderForeground)"}} type="icon-search-line" />}
            placeholder={searchInputPlaceholder}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </div>
    </SearchContainer>
  );
};

export default Search;
