import { BlockEntry, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core';
import { ChangeEvent } from 'react';

interface InputProps {
  id: string;
}

interface InputChildren {
  onChange: Function;
  value: string | number;
}

function InputBlock(props: InputProps) {
  const { onChange, value } = useInputs<InputChildren>(props.id);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    if (onChange) {
      onChange({ value });
    }
  }

  return <input value={value} onChange={handleChange} />;
}

const inputEntry: BlockEntry<InputChildren> = {
  block: InputBlock,
  inputsSettings: {
    onChange: {
      type: [InputType.any],
      label: 'On Change',
      order: 0,
    },
    value: {
      type: [InputType.string],
      label: 'Value',
      order: 1,
    },
  },
  type: InputType.block,
  name: 'Input',
  category: 'Interactive',
};

registerBlock('input', inputEntry);
