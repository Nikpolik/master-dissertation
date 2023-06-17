import styled from 'styled-components';

import { usePages } from '../hooks';
import CreatePage from './CreatePage';
import PageCard from './PageCard';

const Container = styled.div`
  margin: 16px 0 0 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;

  @media only screen and (max-width: 700px) {
    & {
      justify-content: center;
      margin-right: 16px;
    }
  }
`;

function Pages() {
  const { pages } = usePages();

  return (
    <Container data-cy="pages-container">
      {Object.values(pages).map((page) => (
        <PageCard key={page.id} page={page} />
      ))}
      <CreatePage />
    </Container>
  );
}

export default Pages;
