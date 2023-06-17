import { BlockEntry, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core';
import { ElementType, MouseEventHandler } from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps {
  id: string;
}

interface ButtonChildren {
  onClick: () => MouseEventHandler;
  children: Array<ElementType>;
  customCss: () => string;
}

const ButtonElement = styled.button<{ customCss: string }>`
  ${(props) =>
    css`
      ${props.customCss}
    `}
`;

function ButtonBlock(props: ButtonProps) {
  const { onClick: useOnClick, children, customCss } = useInputs<ButtonChildren>(props.id);
  const onClick = useOnClick();

  return (
    <ButtonElement customCss={customCss()} onClick={onClick}>
      {children.map((Child, i) => (
        <Child key={i} />
      ))}
    </ButtonElement>
  );
}

const buttonEntry: BlockEntry<ButtonChildren> = {
  block: ButtonBlock,
  inputsSettings: {
    onClick: {
      type: [InputType.function],
      label: 'On Click',
      order: 0,
    },
    children: {
      type: [InputType.block, InputType.string],
      array: true,
      defaultBlock: PrimitiveBlocks.string,
      defaultValue: 'Button Text',
      order: 1,
      label: 'Children',
    },
    customCss: {
      type: [InputType.string],
      defaultBlock: PrimitiveBlocks.textarea,
      defaultValue: '',
      order: 0.5,
      label: 'Custom CSS',
    },
  },
  type: InputType.block,
  name: 'Button',
  category: 'Interactive',
};

registerBlock('button', buttonEntry);
