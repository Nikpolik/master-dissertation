import styled from 'styled-components';

import colors from 'common/theme/colors';

function getColor(depth: number) {
  if (depth === 0) {
    return colors['CG Blue'];
  }

  return depth % 2 ? colors['Sizzling Red'] : colors['Deep Champagne'];
}

const Container = styled.div<{ depth: number; opacity?: number }>`
  width: fit-content;
  background-color: ${({ depth }) => getColor(depth)};
  color: ${({ depth }) => (depth % 2 ? 'white' : 'black')};
  ${({ depth }) =>
    depth !== 0 &&
    `
    border-radius: 8px;
    margin-top: 8px;
    margin-left: 8px;
    padding: 12px;
  `}
  ${({ depth }) =>
    depth === 0 &&
    `
    padding-right: 16px;
    padding-left: 16px;
  `}
  ${(props) => `opacity: ${props.opacity};`}
  ${(props) => props.opacity === 0 && `pointer-events: none;`}
`;

const PrimitiveContainer = styled(Container)`
  display: flex;
`;

const Header = styled.div`
  display: flex;
  whitespace: nowrap;
  align-items: center;
  gap: 8px;
`;

const ArrayHeader = styled(Header)`
  margin-top: 8px;
`;

const InputTitleSpan = styled.span`
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export { Header, Container, PrimitiveContainer, ArrayHeader, InputTitleSpan };
