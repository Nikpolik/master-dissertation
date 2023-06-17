import { BlockEntry, Child, getInputs, InputType, PrimitiveBlocks, registerBlock } from 'core';

interface ObjectChildren {
  [name: string]: string | number;
}

const ObjectInput = (props: { id: string }) => {
  const inputs = getInputs<ObjectChildren>(props.id);

  return inputs;
};

const objectInputEntry: BlockEntry<ObjectChildren> = {
  block: ObjectInput,
  inputsSettings: {},
  name: 'Object',
  type: InputType.object,
  defaultInputSettings: {
    label: '',
    type: [InputType.string, InputType.number],
    defaultBlock: 'text',
    order: 0,
  },
  category: 'Values',
};

registerBlock(PrimitiveBlocks.object, objectInputEntry);
