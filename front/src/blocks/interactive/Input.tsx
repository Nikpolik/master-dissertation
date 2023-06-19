import { BlockEntry, InputType, registerBlock, useInputs } from 'core';
import { ChangeEvent } from 'react';
import styled, { css } from 'styled-components';

interface InputProps {
  id: string;
}

interface InputChildren {
  onChange: () => Function;
  value: () => string | number | null;
  customCss: () => string;
}

const InputElement = styled.input<{ customCss: string }>`
  ${(props) =>
    css`
      ${props.customCss}
    `}
`;

function InputBlock(props: InputProps) {
  const { onChange: useOnChange, value: useValue, customCss: useCustomCss } = useInputs<InputChildren>(props.id);
  const onChange = useOnChange();
  const value = useValue();
  const customCss = useCustomCss();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    if (onChange) {
      onChange({ value });
    }
  }

  return <InputElement customCss={customCss} value={value ? value : undefined} onChange={handleChange} />;
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
    customCss: {
      type: [InputType.string],
      label: 'Custom CSS',
      order: 2,
    },
  },
  type: InputType.block,
  name: 'Input',
  category: 'Interactive',
};

registerBlock('input', inputEntry);
