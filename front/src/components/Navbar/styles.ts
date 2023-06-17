import styled from 'styled-components';

import colors from 'common/theme/colors';

const Container = styled.nav`
  display: flex;
  gap: 16px;
  background-color: ${colors['CG Blue']};
  padding: 16px 18px;
  position: sticky;
  z-index: 999;
  top: 0;
  height: 50px;
`;

const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Divider = styled.div`
  margin-left: auto;
`;

export { Item, Container, Divider };
