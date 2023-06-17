import { ButtonGroup } from '@mui/material';
import { InputType, Input as InputConfig, PrimitiveBlocks } from 'core';
import { useGetBlockInfo } from 'core';
import { useOpen } from 'editor/hooks';
import { useDrag } from 'react-dnd';

import ChildInput from './Children';
import EmptyTarget from './EmptyTarget';
import InputTitle from './InputTitle';
import PrimitiveInput from './PrimitiveInput';
import AddInput from './actions/AddInput';
import DeleteInput from './actions/DeleteInput';
import EditInput from './actions/EditInput';
import OpenInput from './actions/OpenInput';
import SwapInput from './actions/SwapInput';
import { Container, Header } from './styles';

export interface BlockPickerProps {
  id: string;
  name: string;
  parentId: string;
  depth?: number;
  index?: number;
  config: InputConfig;
  siblingsCount: number;
  options?: string[];
  object: boolean;
}

function Input(props: BlockPickerProps) {
  const depth = props.depth || 0;
  const { id, parentId, config, siblingsCount } = props;
  const showName = !config.array;
  const showSwap = config.array && siblingsCount > 0;
  const showDelete = showSwap || props.object;

  const {
    state: { inputs, value, blockName },
    config: { type, inputsSettings, defaultInputSettings, name: blockTitle },
  } = useGetBlockInfo<any>(id);

  const [open,] = useOpen(id);

  const [{ opacity }, dragRef] = useDrag(() => ({
    type,
    item: { id, parentId, type },
    collect(monitor) {
      return {
        opacity: monitor.isDragging() ? 0 : 1,
      };
    },
  }));

  if (blockName === PrimitiveBlocks.empty) {
    return (
      <EmptyTarget
        id={props.id}
        siblingsCount={props.siblingsCount}
        parentId={props.parentId}
        name={props.name}
        config={props.config}
        depth={depth}
        blockTitle={blockTitle}
      />
    );
  }

  if (
    blockName === PrimitiveBlocks.string ||
    blockName === PrimitiveBlocks.number ||
    blockName === PrimitiveBlocks.textarea
  ) {
    return <PrimitiveInput open={open} ref={dragRef} depth={depth} blockName={blockName} value={value} type={type} {...props} />;
  }

  const isObject = PrimitiveBlocks.object === blockName;

  return (
    <Container data-cy-block={blockName} data-cy-id={id} data-cy="editor-input-container" opacity={opacity} ref={dragRef} depth={depth}>
      {type !== InputType.root && (
        <Header data-cy="editor-header-input">
          <InputTitle
            parentId={props.parentId}
            object={props.object}
            blockName={blockTitle}
            label={config.label}
            showName={showName}
          />
          <ButtonGroup disableElevation variant="contained">
            {showSwap && (
              <SwapInput
                siblingsCount={props.siblingsCount}
                parentId={props.parentId}
                index={props.index || 0}
                inputName={props.name}
              />
            )}
            <EditInput config={props.config} id={props.id} />
            {showDelete && <DeleteInput parentId={parentId} blockId={props.id} />}
            <OpenInput id={id} />
          </ButtonGroup>
        </Header>
      )}
      {Object.entries(inputsSettings)
        .sort(([name], [nextName]) => {
          if (isObject) {
            return -1;
          }

          return inputsSettings[name].order - inputsSettings[nextName].order;
        })
        .map(([name, inputSettings]) => {
          return (
            <ChildInput
              name={name}
              inputs={inputs[name] || []} // here we need to initialize it if empty in the ChildInput
              key={inputs[name]?.join('-') || `${parentId}_${name}`}
              parentType={type}
              parentId={props.id}
              isObject={isObject}
              inputSettings={isObject ? defaultInputSettings : inputSettings}
              depth={depth + 1}
              open={open || type === InputType.root} // root component children are always open
            />
          );
        })}
      {blockName === 'Object' && <AddInput blockId={id} inputName={'test'} />}
    </Container>
  );
}

export default Input;
