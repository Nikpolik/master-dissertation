import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { Button } from '@mui/material';
import { useOpen } from 'editor/hooks';

interface Props {
  id: string;
}

function OpenInput({ id }: Props) {
  const [open, setOpen] = useOpen(id);
  return (
    <Button data-cy="editor-toggle-input" onClick={() => setOpen(!open)}>
      {open ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
    </Button>
  );
}

export default OpenInput;
