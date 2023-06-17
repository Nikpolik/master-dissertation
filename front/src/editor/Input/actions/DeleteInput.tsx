import { Delete as DeleteIcon } from '@mui/icons-material';
import { Button as MButton } from '@mui/material';
import { useDeleteInput } from 'core';
import styled from 'styled-components';

const Button = styled(MButton)`
  font-size: 8px;
`;

interface DeleteProps {
  blockId: string;
  parentId?: string;
}

function Delete(props: DeleteProps) {
  const { parentId, blockId } = props;

  const handleDelete = useDeleteInput(blockId, parentId || '');

  return (
    <Button data-cy="editor-delete-input" size="small" variant="contained" onClick={handleDelete}>
      <DeleteIcon fontSize="inherit" />
    </Button>
  );
}

export default Delete;
