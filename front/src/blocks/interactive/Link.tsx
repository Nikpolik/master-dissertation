import { BlockEntry, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core';
import { ElementType } from 'react';

interface LinkProps {
  id: string;
}

interface LinkChildren {
  url: string;
  children: Array<ElementType>;
}

function LinkBlock(props: LinkProps) {
  const { url, children } = useInputs<LinkChildren>(props.id);

  return (
    <a href={url}>
      {children.map((Child, i) => (
        <Child key={i} />
      ))}
    </a>
  );
}

const linkEntry: BlockEntry<LinkChildren> = {
  block: LinkBlock,
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
      order: 1,
      label: 'Children',
    },
  },
  type: InputType.block,
  name: 'Link',
  category: 'Interactive',
};

registerBlock('link', linkEntry);
