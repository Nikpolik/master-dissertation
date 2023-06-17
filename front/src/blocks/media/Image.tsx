import styled, { css } from 'styled-components';

import { BlockEntry, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core/block';

interface ImageProps {
  url: () => string;
  alt: () => string;
  customCss: () => string;
}

const inputsSettings = {
  url: {
    type: [InputType.string],
    defaultBlock: PrimitiveBlocks.string,
    label: 'URL',
    order: 1,
  },
  alt: {
    type: [InputType.string],
    defaultBlock: PrimitiveBlocks.string,
    label: 'Alt',
  },
  customCss: {
    type: [InputType.string],
    defaultBlock: PrimitiveBlocks.textarea,
    label: 'Custom Css',
  },
};

const ImageElement = styled.img<{ customCss: string }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  ${(props) =>
    css`
      ${props.customCss}
    `}
`;

const imageEntry: BlockEntry = {
  block: Image,
  inputsSettings,
  type: InputType.block,
  name: 'Image',
  category: 'Interactive',
};

function Image({ id }: { id: string }) {
  const { url: useUrl, alt: useAlt, customCss } = useInputs<ImageProps>(id);
  const url = useUrl();
  const alt = useAlt();

  if (!url) {
    return;
  }

  return <ImageElement customCss={customCss()} src={url} alt={alt} />;
}

registerBlock('image', imageEntry);
