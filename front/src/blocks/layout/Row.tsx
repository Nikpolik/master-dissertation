// This row will take children, gap
import { ElementType } from 'react';
import styled from 'styled-components';

import { BlockEntry, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core/block';

interface ColumnProps {
  children: Array<ElementType>;
  gap: () => number;
  wrap: () => string;
}

const inputsSettings = {
  gap: {
    type: [InputType.number],
    defaultBlock: PrimitiveBlocks.number,
    label: 'Spacing',
    order: 1,
  },
  children: {
    type: [InputType.block, InputType.string],
    array: true,
    defaultBlock: 'textBlock',
    order: 2,
    label: 'Children',
  },
  wrap: {
    type: [InputType.string],
    defaultBlock: PrimitiveBlocks.string,
    order: 0,
    label: 'Wrap',
    options: ['yes', 'no'],
  },
};

const rowEntry: BlockEntry = {
  block: Row,
  inputsSettings,
  type: InputType.block,
  name: 'Row',
  category: 'Interactive',
};

const ContainerElement = styled.div<{ gap: number; wrap: string }>`
  display: flex;
  flex-direction: row;
  gap: ${(props) => props.gap}px;
  ${(props) => (props.wrap === 'yes' ? 'flex-wrap: wrap' : '')}
`;

function Row({ id }: { id: string }) {
  const { children, gap: useGap, wrap: useWrap } = useInputs<ColumnProps>(id);
  const gap = useGap();
  const wrap = useWrap();

  return (
    <ContainerElement gap={gap} wrap={wrap}>
      {children.map((Child, i) => (
        <Child key={i} />
      ))}
    </ContainerElement>
  );
}

registerBlock('row', rowEntry);
