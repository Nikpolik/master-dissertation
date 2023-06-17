import Editor from 'editor';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import colors from 'common/theme/colors';

import { useFetchPage, usePage, useRenderPreview } from './hooks';

const Container = styled.div`
  display: flex;
  gap: 8px;
  height: calc(100% - 50px - 32px - 32px);
  background-color: ${colors['CG Blue']};
  padding: 16px;
`;

const RootWrapper = styled.div`
  background-color: white;
  height: 100%;
  width: 100%;
  overflow-y: auto;
`;

function Page() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    throw new Error('Could not fetch id from url params, check routing');
  }

  const { page, loading: pagesLoading } = usePage(id);
  const { loading: componentsLoading } = useFetchPage(id, page?.rootId || '');

  if (pagesLoading || componentsLoading) {
    return <Container>Loading...</Container>;
  }

  if (!page) {
    return <Container>Error could not fetch page</Container>;
  }

  const { rootId } = page;

  return (
    <Container>
      <Editor rootId={rootId} />
      <RootWrapper id="preview-root"></RootWrapper>
    </Container>
  );
}

export default Page;
