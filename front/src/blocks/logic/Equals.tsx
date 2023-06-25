import { BlockEntry, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core';

interface EqualsProps {
  id: string;
}

interface IfChildren {
  first: () => any;
  second: () => any;
}

function Equals(props: EqualsProps) {
  const { first: useFirst, second: useSecond } = useInputs<IfChildren>(props.id);
  const first = useFirst();
  const second = useSecond();

  return first == second;
}

const EqualsEntry: BlockEntry<IfChildren> = {
  block: Equals,
  inputsSettings: {
    first: {
      type: [InputType.string, InputType.number],
      defaultBlock: 'dataSelector',
      label: 'Condition',
      order: 1,
    },
    second: {
      type: [InputType.string, InputType.number],
      defaultBlock: PrimitiveBlocks.empty,
      label: 'True Block',
      order: 2,
    },
  },
  type: InputType.any,
  name: 'Equals',
  category: 'Logic',
};

registerBlock('equals', EqualsEntry);
