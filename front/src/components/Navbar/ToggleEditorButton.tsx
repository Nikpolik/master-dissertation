import { ToggleOffSharp as Right, ToggleOnSharp as Left } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useEditor } from 'editor/hooks';
import { useLocation } from 'react-router-dom';

import { Item } from './styles';

function ToggleEditorButton() {
  const { pathname } = useLocation();
  const [, , id] = pathname.split('/');
  const {
    state: { open },
    toggleEditor,
  } = useEditor();

  if (!id) {
    return null;
  }

  return (
    <Item>
      <Button onClick={toggleEditor} variant="contained">
        {open ? <Left /> : <Right />}
      </Button>
    </Item>
  );
}

export default ToggleEditorButton;
