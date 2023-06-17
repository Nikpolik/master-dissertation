import { registerBlock, BlockEntry, InputType, PrimitiveBlocks, useInputs } from 'core';
import styled, { css } from 'styled-components';

interface TextBlockProps {
  text: () => string | null;
  customCss: () => string;
  containerElement: () => 'span' | 'h1' | 'p';
}

const Container = styled.span<{ customCss: string }>`
  ${(props) =>
    css`
      ${props.customCss}
    `}
`;

function TextBlock({ id }: { id: string }) {
  const { text: useText, customCss, containerElement } = useInputs<TextBlockProps>(id);
  const text = useText();

  if (typeof text !== 'string' && typeof text !== 'number') {
    return null;
  }

  return (
    <Container customCss={customCss()} as={containerElement()}>
      {text}
    </Container>
  );
}

const textBlockEntry: BlockEntry = {
  block: TextBlock,
  inputsSettings: {
    text: {
      type: [InputType.string],
      defaultBlock: PrimitiveBlocks.string,
      label: 'Text',
      order: 1,
    },
    customCss: {
      type: [InputType.string],
      defaultBlock: PrimitiveBlocks.textarea,
      label: 'CSS',
      order: 1,
    },
    containerElement: {
      type: [InputType.string],
      options: ['p', 'h1', 'span'],
      defaultBlock: PrimitiveBlocks.string,
      defaultValue: 'span',
      label: 'Element',
      order: 0,
    },
  },
  type: InputType.block,
  name: 'Text Block',
  category: 'Misc',
};

registerBlock('textBlock', textBlockEntry);
