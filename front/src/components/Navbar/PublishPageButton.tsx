import { PublishedWithChanges } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { usePage, usePublishPage } from 'pages/hooks';
import { useLocation } from 'react-router-dom';

import { Item } from './styles';

function PublishPageButton() {
  const { pathname } = useLocation();
  const [, , id] = pathname.split('/');
  const { page, loading: pagesLoading } = usePage(id);
  const { loading, publishPage } = usePublishPage(id);

  if (pagesLoading || !page) {
    return null;
  }

  function handleClick() {
    publishPage();
  }

  return (
    <Item>
      <LoadingButton data-cy="editor-publish" onClick={handleClick} loading={loading} variant="contained" endIcon={<PublishedWithChanges />}>
        Publish
      </LoadingButton>
    </Item>
  );
}

export default PublishPageButton;
