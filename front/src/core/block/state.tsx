/*
 * In this file we setup all the necesry logic for storing, retrieving and registering blocks and their inputs
 **/
import { atomFamily, selectorFamily } from 'recoil';

import { BlockEntry, BlockState, Child, InputType } from './models';
import { processInput } from './utils';

// This map associates all blocks with their corresponding input options
const blocks = new Map<string, BlockEntry>();

// This is the core function that registers a block along side its inputs to be used
// by the editor
function registerBlock(blockName: string, block: BlockEntry) {
  if (blocks.has(blockName)) {
    throw new Error(`The block name: ${blockName} has all ready been registered please choose a more specific name`);
  }

  blocks.set(blockName, block);
}

// The type is need if we are going to handle each case (e.g. block input, number input, array input etc)
// Check to see if we can use selectorFamily for this (derived state)
const blockStateAtomFamily = atomFamily<BlockState, string>({
  key: 'BlockState',
  default: (id: string) => ({
    blockName: 'Root',
    inputs: {
      children: [],
    },
    parent: null,
    id,
  }),
});

const blockValueSelectorFamily = selectorFamily({
  key: 'BlockValueSelector',
  get:
    (blockId: string) =>
    ({ get }) => {
      const { value } = get(blockStateAtomFamily(blockId));
      return value;
    },
  set:
    (blockId) =>
    ({ get, set }, newValue: unknown) => {
      const { state: prevState, config } = get(blockInfoSelector(blockId));
      if (typeof newValue !== 'string') {
        return;
      }
      let value: string | number = newValue;
      if (config.type === InputType.number) {
        value = Number(value);
      }

      set(blockStateAtomFamily(blockId), {
        ...prevState,
        value,
      });
    },
});

const inputTypeSelector = selectorFamily({
  key: 'BlockTypeSelector',
  get:
    (parentId: string) =>
    ({ get }) => {
      const state = get(blockStateAtomFamily(parentId));
      const { inputs, blockName } = state;
      const configuration = blocks.get(blockName) as BlockEntry<any>;

      if (!configuration) {
        throw new Error(`Could not find block ${blockName}`);
      }

      const inputBlocks: Record<string, Child | Array<Child>> = {};

      for (const [inputName, inputSettings] of Object.entries(configuration.inputsSettings)) {
        if (!inputs[inputName]) {
          inputBlocks[inputName] = () => null;
          continue;
        }

        if (inputSettings.array) {
          inputBlocks[inputName] = inputs[inputName].map((id) => processInput(id, get, true));
        } else {
          inputBlocks[inputName] = processInput(inputs[inputName][0], get);
        }
      }
      // for (const inputName in inputs) {
      //   const inputSettings = configuration.inputsSettings[inputName] || configuration.defaultInputSettings;
      //
      //   if (!inputSettings) {
      //     continue;
      //   }
      //
      //   if (inputSettings.array) {
      //     inputBlocks[inputName] = inputs[inputName].map((id) => processInput(id, get, true));
      //   } else {
      //     inputBlocks[inputName] = processInput(inputs[inputName][0], get);
      //   }
      // }

      return inputBlocks;
    },
});

const blockInfoSelector = selectorFamily({
  key: 'blockInfoSelector',
  get:
    (blockId: string) =>
    ({ get }) => {
      const state = get(blockStateAtomFamily(blockId));
      const config = blocks.get(state.blockName);

      if (!config) {
        throw new Error(`Could not find configuration of block : ${state.blockName}`);
      }

      return {
        state,
        config,
      };
    },
});

export { registerBlock, blockStateAtomFamily, inputTypeSelector, blockInfoSelector, blocks, blockValueSelectorFamily };
