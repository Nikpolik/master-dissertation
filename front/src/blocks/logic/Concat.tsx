import { BlockEntry, InputType, registerBlock, useInputs } from 'core';

interface ConcatProps {
  id: string;
}

interface ConcatChildren {
  values: () => (string | number)[];
}

function ConcatBlock(props: ConcatProps) {
  const { values } = useInputs<ConcatChildren>(props.id);

  if (!values || !Array.isArray(values)) {
    return null;
  }

  /* eslint-disable */
  let total;
  for (const useValue of values) {
    const value = useValue();
    if (total === undefined) {
      total = value;
    } else {
      total += value;
    }
  }
  /* eslint-enable */

  return total;
}

const concatEntry: BlockEntry<ConcatChildren> = {
  block: ConcatBlock,
  inputsSettings: {
    values: {
      type: [InputType.string, InputType.number],
      defaultBlock: 'dataSelector',
      array: true,
      label: 'Values',
      order: 1,
    },
  },
  type: InputType.any,
  name: 'Add',
  category: 'Logic',
};

registerBlock('add', concatEntry);
