// This column will take children, gap
import { ElementType } from 'react';
import styled from 'styled-components';

import { BlockEntry, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core/block';

interface ColumnProps {
  children: Array<ElementType>;
  gap: number;
}

const inputsSettings = {
  gap: {
    type: [InputType.number],
    defaultBlock: PrimitiveBlocks.number,
    label: 'Spacing',
    order: 1,
  },
  children: {
    type: [InputType.block],
    array: true,
    defaultBlock: PrimitiveBlocks.empty,
    order: 2,
    label: 'Children',
  },
};

const columnEntry: BlockEntry = {
  block: Column,
  inputsSettings,
  type: InputType.block,
  name: 'Column',
  category: 'Interactive',
};

const ContainerElement = styled.div<{ gap: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.gap}px;
`;

function Column({ id }: { id: string }) {
  const { children, gap } = useInputs<ColumnProps>(id);
  return (
    <ContainerElement gap={gap}>
      {children.map((Child, i) => (
        <Child key={i} />
      ))}
    </ContainerElement>
  );
}

registerBlock('column', columnEntry);
