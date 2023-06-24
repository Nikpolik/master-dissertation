import { Refresh } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { usePage, usePublishPage, useRenderPreview } from 'pages/hooks';
import { useLocation } from 'react-router-dom';

import { Item } from './styles';

function RefreshPageButton() {
  const { pathname } = useLocation();
  const [, , id] = pathname.split('/');
  const { page, loading: pagesLoading } = usePage(id);
  const { loading } = usePublishPage(id);
  const { renderPreview } = useRenderPreview(page?.rootId || '', 'preview-root');

  if (pagesLoading || !page) {
    return null;
  }

  async function handleClick() {
    renderPreview();
  }

  return (
    <Item>
      <LoadingButton
        data-cy="editor-refresh"
        onClick={handleClick}
        loading={loading}
        variant="contained"
        endIcon={<Refresh />}
      >
        Refresh
      </LoadingButton>
    </Item>
  );
}

export default RefreshPageButton;
