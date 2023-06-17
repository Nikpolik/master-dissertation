import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { usePage, useSavePage } from 'pages/hooks';
import { useLocation } from 'react-router-dom';

import { Item } from './styles';

function SavePageButton() {
  const { pathname } = useLocation();
  const [, , id] = pathname.split('/');
  const { page, loading: pagesLoading } = usePage(id);
  const { loading, savePage } = useSavePage(id, page?.rootId || '');

  if (pagesLoading || !page) {
    return null;
  }

  function handleClick() {
    savePage();
  }

  return (
    <Item>
      <LoadingButton data-cy="editor-save" onClick={handleClick} loading={loading} variant="contained" endIcon={<Save />}>
        Save
      </LoadingButton>
    </Item>
  );
}

export default SavePageButton;
