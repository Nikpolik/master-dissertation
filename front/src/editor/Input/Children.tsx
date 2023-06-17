import { Input as InputConfig, InputType } from 'core';
import styled from 'styled-components';

import Input from '.';
import AddInput from './actions/AddInput';
import { ArrayHeader } from './styles';

interface Props {
  name: string;
  inputs: string[];
  inputSettings?: InputConfig;
  isObject: boolean;
  parentType?: InputType;
  parentId: string;
  depth: number;
  open: boolean;
}

const ChildInputContainer = styled.div<{ open: boolean }>`
  display: ${(props) => (props.open ? 'block' : 'none')};
`;

function ChildInput(props: Props) {
  const { isObject, inputs, name, inputSettings, parentType, parentId, depth, open } = props;

  if (inputSettings === undefined) {
    throw new Error(
      `Could not find settings for input ${name} with parent id ${parentId} and parent type ${parentType}`
    );
  }

  return (
    <ChildInputContainer data-cy-input={name} data-cy="editor-children" open={open}>
      {inputSettings.array && parentType !== InputType.root && <ArrayHeader>{inputSettings.label}</ArrayHeader>}
      {inputs.map((id, index) => (
        <Input
          parentId={parentId}
          siblingsCount={inputs.length - 1}
          key={id}
          id={id}
          name={name}
          depth={depth}
          index={index}
          config={inputSettings}
          object={isObject}
        />
      ))}
      {inputSettings.array && <AddInput blockId={parentId} inputName={name} />}
    </ChildInputContainer>
  );
}

export default ChildInput;
