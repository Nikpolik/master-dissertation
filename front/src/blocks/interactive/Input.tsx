import { BlockEntry, InputType, registerBlock, useInputs } from 'core';
import { ChangeEvent } from 'react';

interface InputProps {
  id: string;
}

interface InputChildren {
  onChange: () => Function;
  value: () => string | number | null;
}

function InputBlock(props: InputProps) {
  const { onChange: useOnChange, value: useValue } = useInputs<InputChildren>(props.id);
  const onChange = useOnChange();
  const value = useValue();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    if (onChange) {
      console.log('Calling on change', value);
      onChange({ value });
    }
  }

  return <input value={value ? value : undefined} onChange={handleChange} />;
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
