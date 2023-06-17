import { BlockEntry, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core';
import { ReactNode } from 'react';

interface ButtonLinkProps {
  id: string;
}

interface ButtonLinkChildren {
  url: string;
  children: Array<ReactNode>;
}

function ButtonLinkBlock(props: ButtonLinkProps) {
  const { url, children } = useInputs<ButtonLinkChildren>(props.id);

  function handleClick() {
    if (url) {
      window.location.href = url;
    }
  }

  return <button onClick={handleClick}>{children}</button>;
}

const buttonLinkEntry: BlockEntry<ButtonLinkChildren> = {
  block: ButtonLinkBlock,
  inputsSettings: {
    url: {
      type: [InputType.string],
      defaultBlock: PrimitiveBlocks.string,
      label: 'URL',
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
  },
  type: InputType.block,
  name: 'Link Button',
  category: 'Interactive',
};

registerBlock('buttonLink', buttonLinkEntry);
