import { Button } from '@mui/material';
import styled from 'styled-components';

interface SearchResultProps {
  name: string;
  onClick: () => void;
  disabled?: boolean;
}

const SearchResultButton = styled(Button)``;

function SearchResult({ name, onClick, disabled = false }: SearchResultProps) {
  return (
    <SearchResultButton variant="contained" onClick={onClick} disabled={disabled}>
      {name}
    </SearchResultButton>
  );
}

export default SearchResult;
