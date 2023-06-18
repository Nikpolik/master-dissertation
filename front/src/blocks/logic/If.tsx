import { BlockEntry, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core';
import { ComponentType } from 'react';

interface IfProps {
  id: string;
}

interface IfChildren {
  condition: () => any;
  trueBlock: ComponentType | null;
  falseBlock: ComponentType | null;
}

function IfBlock(props: IfProps) {
  const { condition: useCondition, trueBlock: TrueBlock, falseBlock: FalseBlock } = useInputs<IfChildren>(props.id);
  const condition = useCondition();

  if (condition && TrueBlock) {
    return <TrueBlock />;
  }

  if (FalseBlock) {
    return <FalseBlock />;
  }

  return null;
}

const ifEntry: BlockEntry<IfChildren> = {
  block: IfBlock,
  inputsSettings: {
    condition: {
      type: [InputType.string, InputType.number],
      defaultBlock: 'dataSelector',
      label: 'Condition',
      order: 1,
    },
    trueBlock: {
      type: [InputType.block],
      defaultBlock: PrimitiveBlocks.empty,
      label: 'True Block',
      order: 2,
    },
    falseBlock: {
      type: [InputType.block],
      defaultBlock: PrimitiveBlocks.empty,
      label: 'False Block',
      order: 3,
    },
  },
  type: InputType.any,
  name: 'If',
  category: 'Logic',
};

registerBlock('if', ifEntry);
