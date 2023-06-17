import { v4 as uuid } from 'uuid';

import { getValue, setValue } from 'common/RecoilExporter';

import { BlockEntry, Child, Children, InputType, PrimitiveBlocks, Setter } from './models';
import { blockStateAtomFamily, blocks, inputTypeSelector, blockValueSelectorFamily } from './state';

function getPrimitiveValue(id: string) {
  const { value } = getValue(blockStateAtomFamily(id));
  return value;
}

function getInputs<T extends Children<T>>(id: string) {
  const test = getValue(inputTypeSelector(id));
  return test as T;
}

function initializeBlock(
  blockName: string,
  set: Setter,
  blockId: string,
  options: { defaultValue?: string | number; parent?: string | null }
) {
  const config = blocks.get(blockName) as BlockEntry<any> | undefined;
  const { defaultValue, parent } = options;
  if (!config) {
    throw new Error(`Please register component ${blockName}`);
  }

  let inputs: Record<string, string[]> = {};
  for (let input in config.inputsSettings) {
    const inputConfig = config.inputsSettings[input];
    const inputId = uuid();
    inputs[input] = [inputId];
    const defaultBlock = inputConfig.defaultBlock || PrimitiveBlocks.empty;

    initializeBlock(defaultBlock, set, inputId, { defaultValue: inputConfig.defaultValue, parent: blockId });
  }

  set(blockStateAtomFamily(blockId), (prevState) => {
    return {
      blockName: blockName,
      inputs,
      parent: parent || prevState.parent,
      id: blockId,
      value: defaultValue,
    };
  });
}

function processInput(id: string, get: any, array = false): Child {
  const { blockName } = get(blockStateAtomFamily(id));
  const entry = blocks.get(blockName);
  if (!entry) {
    throw new Error(`Could not find block ${blockName}`);
  }

  const block = entry.block;

  let child: Child;
  switch (entry.type) {
    case InputType.block:
    case InputType.store:
    case InputType.root:
      let Component = block; // lol
      child = (props: any) => <Component {...props} key={array ? id : undefined} id={id} />;
      break;
    case InputType.number:
    case InputType.string:
    case InputType.any:
    case InputType.object:
    case InputType.none:
    case InputType.function:
      child = (args: any) => block({ ...args, id });
      break;
  }

  return child;
}

function setBlockValue(blockId: string, value: any) {
  setValue(blockValueSelectorFamily(blockId), value);
}

function findName(id: string, inputs: Record<string, string[]>) {
  const result = Object.entries(inputs).find(([_, inputs]) => inputs.includes(id));
  if (!result) {
    return;
  }

  return result[0];
}

function switchInputs(data: Record<string, string[]>, name: string, prev: string, next: string) {
  const index = data[name].findIndex((v) => v === prev);
  const nameData = [...data[name]];
  nameData[index] = next;

  return {
    ...data,
    [name]: nameData,
  };
}

function swapInputs(data: Record<string, string[]>, name: string, prev: string, next: string) {
  const indexPrev = data[name].findIndex((v) => v === prev);
  const indexNext = data[name].findIndex((v) => v === next);
  const nameData = [...data[name]];
  nameData[indexPrev] = next;
  nameData[indexNext] = prev;

  return {
    ...data,
    [name]: nameData,
  };
}

export {
  getPrimitiveValue,
  initializeBlock,
  getInputs,
  processInput,
  setBlockValue,
  swapInputs,
  switchInputs,
  findName,
};
