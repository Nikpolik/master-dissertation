import { BlockEntry, registerBlock } from 'core';
import { InputType, useInputs } from 'core';
import { ElementType } from 'react';

interface Props {
  id: string;
}

const inputsSettings = {
  children: {
    type: [InputType.block, InputType.store],
    defaultBlock: 'container',
    array: true,
    label: '',
    order: 0,
  },
};

interface RootChildren {
  children: Array<ElementType>;
}

const rootBlock: BlockEntry<RootChildren> = {
  block: Root,
  inputsSettings,
  hidden: true,
  type: InputType.root,
  name: 'root',
  category: 'Root',
};

function Root({ id }: Props) {
  const { children } = useInputs<RootChildren>(id);

  if (!children) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {children.map((Child, i) => (
        <Child key={i} />
      ))}
    </>
  );
}

registerBlock('Root', rootBlock);

export default Root;
