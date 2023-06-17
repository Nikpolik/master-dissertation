import Edit from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import { Input } from 'core';

import { useTogglePicker } from '../../BlockChooser/hooks';

interface EditInputProps {
  id: string;
  config: Input;
}

function EditInput(props: EditInputProps) {
  const { open } = useTogglePicker();
  const openPicker = () => open(props.id, props.config);

  return (
    <Button data-cy="editor-edit-input" onClick={openPicker} size="small" variant="contained">
      <Edit />
    </Button>
  );
}

export default EditInput;
