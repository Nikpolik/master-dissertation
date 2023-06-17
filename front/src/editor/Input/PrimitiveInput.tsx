import { MenuItem, Select, TextField } from '@mui/material';
import { InputType, PrimitiveBlocks, useHandleBlockValueChange } from 'core';
import { forwardRef, ForwardedRef } from 'react';

import { BlockPickerProps } from '.';
import InputTitle from './InputTitle';
import DeleteInput from './actions/DeleteInput';
import EditInput from './actions/EditInput';
import SwapInput from './actions/SwapInput';
import { PrimitiveContainer, Header } from './styles';
import styled from 'styled-components';
import OpenInput from './actions/OpenInput';

interface PrimitiveInputProps extends BlockPickerProps {
  type: InputType;
  value: string | number | undefined;
  blockName: string;
  open: boolean;
}

const StyledTextField = styled(TextField)<{ isTextarea?: boolean, open?: boolean }>`
  ${({ isTextarea, open }) => isTextarea && !open && 'height: 0; overflow: hidden; width: 0;'}
  ${({ isTextarea, open }) => isTextarea && open && 'width: 400px;'}
`;

const PrimitiveInput = forwardRef((props: PrimitiveInputProps, ref: ForwardedRef<HTMLDivElement | null>) => {
  const handleChange = useHandleBlockValueChange(props.id);

  const { config, depth, blockName, siblingsCount, parentId, object, open } = props;
  const showDelete = (config.array && siblingsCount > 0) || object;
  const showName = !config.array;
  const showSwap = config.array && siblingsCount > 0;
  const isTextarea = blockName === PrimitiveBlocks.textarea;

  const inputStyles = {
    sx: { color: (props.depth || 0) % 2 ? 'white' : 'black', width: isTextarea ? '400px' : 'auto;' },
  };

  let input = (
    <StyledTextField
      size="small"
      value={props.value || ''}
      inputProps={inputStyles}
      variant="filled"
      onChange={handleChange}
      multiline={isTextarea}
      minRows={isTextarea ? 3 : 1}
      isTextarea={isTextarea}
      open={open}
    />
  );

  let options: string[] | undefined;
  if (typeof config.options === 'function') {
    options = config.options();
  } else {
    options = config.options;
  }

  if (options !== undefined) {
    input = (
      <Select size="small" inputProps={inputStyles} value={props.value} onChange={handleChange as any}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    );
  }

  return (
    <PrimitiveContainer data-cy-block={blockName} data-cy-id={props.id} data-cy="editor-input-container" ref={ref} depth={depth || 0}>
      <Header data-cy="editor-header-input">
        <InputTitle
          parentId={props.parentId}
          object={props.object}
          label={config.label}
          blockName={blockName}
          showName={showName}
        />
        {input}
        {isTextarea && <OpenInput id={props.id} />}
        <EditInput config={props.config} id={props.id} />
        {showSwap && (
          <SwapInput
            siblingsCount={props.siblingsCount}
            parentId={props.parentId}
            index={props.index || 0}
            inputName={props.name}
          />
        )}
        {showDelete && <DeleteInput parentId={parentId} blockId={props.id} />}
      </Header>
    </PrimitiveContainer>
  );
});

export default PrimitiveInput;
