import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useFetchPage, usePage } from './hooks';

const Container = styled.div`
  height: 100%;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const RootWrapper = styled.div`
  height: 100%;
  width: 100%;
`;

function Public() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    throw new Error('Could not fetch id from url params, check routing');
  }

  const { page, loading: pagesLoading } = usePage(id);
  const { loading: componentsLoading } = useFetchPage(id, page?.rootId || '', true);

  if (pagesLoading || componentsLoading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  return (
    <Container>
      <RootWrapper id="preview-root"></RootWrapper>
    </Container>
  );
}

export default Public;
