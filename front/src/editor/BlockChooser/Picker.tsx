import { Chip, TextField, Typography } from '@mui/material';
import { blocks, useGetBlockInfo, useEditBlockType, Input, InputType } from 'core';
import debounce from 'lodash.debounce';
import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import SearchResult from './SearchResult';
import { useTogglePicker } from './hooks';

const DEBOUNCE_WAIT_TIME = 300;

interface PickerProps {
  id: string;
  config: Input;
}

const SearchResultsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
`;

const PickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  min-width: 350px;
`;

function Picker({ id, config }: PickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const { state } = useGetBlockInfo(id);
  const setBlockType = useEditBlockType(id);
  const { close } = useTogglePicker();

  const allBlocks = [...blocks.entries()];
  // first we must filter all blocks that are not hidden and match the categories allowed by the input
  const allowedBlocks = allBlocks
    .filter(([, entry]) => !entry.hidden)
    .filter(
      ([, entry]) =>
        config.type.includes(InputType.any) || entry.type === InputType.any || config.type.includes(entry.type)
    ); // filter input types

  const memoizedResults = useMemo(() => {
    return allowedBlocks
      .filter(([, entry]) => categories.length === 0 || categories.includes(entry.category)) // filter categories
      .filter(([name]) => name.includes(searchTerm.toLowerCase())); // filter search term
  }, [searchTerm, config.type, categories]);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchTerm(event.target.value);
  };

  const allCategories = new Set(
    allowedBlocks
      .map(([_, entry]) => entry.category)
      .filter((category) => category !== 'Root' && !categories.includes(category))
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChaneHandler = useCallback(debounce(handleInputChange, DEBOUNCE_WAIT_TIME), []);

  function handleCategoryClick(category: string) {
    setCategories((prev) => [...prev, category]);
  }

  function handleCategoryDelete(category: string) {
    setCategories((prev) => prev.filter((c) => c !== category));
  }

  return (
    <PickerContainer>
      <SearchResultsWrapper>
        {[...allCategories].map((category) => (
          <Chip key={category} onClick={() => handleCategoryClick(category)} label={category} color="primary" />
        ))}
      </SearchResultsWrapper>
      <TextField
        variant="filled"
        label="Enter component name to search..."
        fullWidth
        onChange={debouncedChaneHandler}
      />
      <SearchResultsWrapper>
        {[...categories].map((category) => (
          <Chip key={category} onDelete={() => handleCategoryDelete(category)} label={category} color="primary" />
        ))}
      </SearchResultsWrapper>
      <Typography>Results: </Typography>
      <SearchResultsWrapper>
        {memoizedResults.map(([blockName, entry]) => (
          <SearchResult
            disabled={blockName === state.blockName}
            key={blockName}
            name={entry.name}
            onClick={() => {
              setBlockType(blockName);
              close();
            }}
          />
        ))}
      </SearchResultsWrapper>
    </PickerContainer>
  );
}

export default Picker;
