// This container will take children, className and custom css and allow for customizations
import { ElementType } from 'react';
import styled, { css } from 'styled-components';

import { BlockEntry, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core/block';

interface ContainerProps {
  customCss: () => string;
  children: Array<ElementType>;
  containerElement: () => string;
}

const inputsSettings = {
  customCss: {
    type: [InputType.string],
    defaultBlock: PrimitiveBlocks.textarea,
    label: 'CSS',
    order: 1,
  },
  children: {
    type: [InputType.block],
    array: true,
    order: 2,
    label: 'Children',
  },
  containerElement: {
    type: [InputType.string],
    options: ['div', 'span'],
    defaultBlock: PrimitiveBlocks.string,
    label: 'Element',
    order: 0,
    defaultValue: 'div',
  },
};

const containerEntry: BlockEntry = {
  block: Container,
  inputsSettings,
  type: InputType.block,
  name: 'Container',
  category: 'Interactive',
};

const ContainerElement = styled.div<{ customCss: string }>`
  ${(props) =>
    css`
      ${props.customCss}
    `}
`;

function Container({ id }: { id: string }) {
  const { customCss, children, containerElement } = useInputs<ContainerProps>(id);
  return (
    <ContainerElement as={containerElement() as any} customCss={customCss()}>
      {children.map((Child, i) => (
        <Child key={i} />
      ))}
    </ContainerElement>
  );
}

registerBlock('container', containerEntry);
