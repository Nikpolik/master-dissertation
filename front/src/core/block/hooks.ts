import { ChangeEvent } from 'react';
import {
  useRecoilTransaction_UNSTABLE,
  useRecoilCallback,
  useRecoilSnapshot,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { v4 as uuid } from 'uuid';

import { BlockEntry, BlockState, Children, PrimitiveBlocks } from './models';
import { blockInfoSelector, blockStateAtomFamily, blockValueSelectorFamily, inputTypeSelector } from './state';
import { findName, initializeBlock, swapInputs, switchInputs } from './utils';

function useInputs<T extends Children<T>>(blockId: string): T {
  return useRecoilValue(inputTypeSelector(blockId)) as T;
}

function useGetBlockInfo<T extends {}>(blockId: string) {
  return useRecoilValue(blockInfoSelector(blockId)) as { state: BlockState; config: BlockEntry<T> };
}

function useEditBlockType(blockId: string) {
  return useRecoilCallback(
    ({ set }) =>
      (blockName: string) =>
        initializeBlock(blockName, set, blockId, { defaultValue: '' }),
    [blockId]
  );
}

function useHandleBlockValueChange(blockId: string) {
  return useRecoilCallback(
    ({ set }) =>
      (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.currentTarget?.value || event.target?.value;
        set(blockValueSelectorFamily(blockId), value);
      },
    [blockId]
  );
}

// This hook can only be used by array or object inputs
function useAddInput(blockId: string) {
  return useRecoilCallback(
    ({ set, snapshot }) =>
      (name: string) => {
        const { state: prevState, config } = snapshot.getLoadable(blockInfoSelector(blockId)).getValue();
        const settings = (config as BlockEntry<any>).inputsSettings[name] || config.defaultInputSettings;

        if (!settings) {
          throw new Error('An input must either have default settings or explicitly set settings');
        }

        const { defaultBlock, defaultValue, array } = settings;
        const oldSiblings = prevState.inputs[name] || [];

        if (!array && !(prevState.blockName === PrimitiveBlocks.object)) {
          console.error('Tried to append new input when not array or object');
          return;
        }

        const id = uuid();
        initializeBlock(defaultBlock || PrimitiveBlocks.empty, set, id, { defaultValue, parent: blockId });
        const newInputs = { ...prevState.inputs, [name]: [...oldSiblings, id] };

        set(blockStateAtomFamily(blockId), {
          ...prevState,
          inputs: newInputs,
        });
      },
    [blockId]
  );
}

// swaps the two inputs
function useSwapInputs(parentId: string) {
  return useRecoilCallback(
    ({ set, snapshot }) =>
      (name: string, index: number, direction: 'up' | 'down') => {
        const { state } = snapshot.getLoadable(blockInfoSelector(parentId)).getValue();

        const oldSiblings = state.inputs[name] || [];

        // single input nothing to swap
        if (oldSiblings.length <= 1) {
          return;
        }

        let newIndex = -1;
        if (direction === 'up' && index > 0) {
          newIndex = index - 1;
        } else if (direction === 'down' && index < oldSiblings.length - 1) {
          newIndex = index + 1;
        } else {
          throw new Error(
            `Invalid swap conditions parentId: ${parentId}, name: ${name}, index: ${index}, direction: ${direction}`
          );
        }

        const newSiblings = [...oldSiblings];
        newSiblings[newIndex] = oldSiblings[index];
        newSiblings[index] = oldSiblings[newIndex];
        const newInputs = { ...state.inputs, [name]: newSiblings };

        set(blockStateAtomFamily(parentId), {
          ...state,
          inputs: newInputs,
        });
      },
    [parentId]
  );
}

function useDropInput() {
  return useRecoilCallback(
    ({ set, snapshot }) =>
      (targetParentId: string, currentParentId: string, itemId: string, targetInputId: string) => {
        // we must swap target which is *always* an empty input with the dropped input
        const { state: targetParentState } = snapshot.getLoadable(blockInfoSelector(targetParentId)).getValue();
        const { state: currentParentState } = snapshot.getLoadable(blockInfoSelector(currentParentId)).getValue();

        const targetName = findName(targetInputId, targetParentState.inputs);
        const currentName = findName(itemId, currentParentState.inputs);

        if (!targetName || !currentName) {
          return;
        }

        if (targetParentId !== currentParentId) {
          const targetInputs = switchInputs(targetParentState.inputs, targetName, targetInputId, itemId);
          const currentInputs = switchInputs(currentParentState.inputs, currentName, itemId, targetInputId);

          set(blockStateAtomFamily(targetParentId), {
            ...targetParentState,
            inputs: targetInputs,
          });
          set(blockStateAtomFamily(currentParentId), {
            ...currentParentState,
            inputs: currentInputs,
          });
          return;
        }

        let targetInputs;
        if (targetName === currentName) {
          targetInputs = swapInputs(targetParentState.inputs, targetName, targetInputId, itemId);
        } else {
          targetInputs = switchInputs(targetParentState.inputs, targetName, targetInputId, itemId);
          targetInputs = switchInputs(targetInputs, currentName, itemId, targetInputId);
        }
        set(blockStateAtomFamily(targetParentId), {
          ...targetParentState,
          inputs: targetInputs,
        });
      }
  );
}

function useDeleteInput(blockId: string, parentId: string) {
  return useRecoilCallback(
    ({ set, snapshot }) =>
      () => {
        const { state: prevState } = snapshot.getLoadable(blockInfoSelector(parentId)).getValue();

        const inputs = Object.keys(prevState.inputs).reduce((prev: Record<string, string[]>, name) => {
          const ids = prevState.inputs[name].filter((id) => id !== blockId);
          // by not including items with no children we are deleting them
          if (ids.length > 0) {
            prev[name] = ids;
          }

          return prev;
        }, {});

        set(blockStateAtomFamily(parentId), {
          ...prevState,
          inputs,
        });
      },
    []
  );
}

function useGetAllInputs(rootId: string) {
  const snapshot = useRecoilSnapshot();

  return async function () {
    let nodes = [rootId];
    const blocks: BlockState[] = [];
    while (nodes.length > 0) {
      const currentId = nodes.pop();
      if (!currentId) {
        break;
      }

      const currentBlock = await snapshot.getPromise(blockStateAtomFamily(currentId));
      blocks.push(currentBlock);

      Object.values(currentBlock.inputs).forEach((id) => {
        nodes = nodes.concat(id);
      });
    }
    return blocks;
  };
}

function useInitializeInputs() {
  return useRecoilTransaction_UNSTABLE(({ set }) => (inputs: BlockState[]) => {
    inputs.forEach((input) => {
      set(blockStateAtomFamily(input.id), input);
    });
  });
}

function useEditName(id: string) {
  const setState = useSetRecoilState(blockStateAtomFamily(id));
  return function (prevName: string, name: string) {
    setState((state) => {
      if (state.inputs[name] !== undefined) {
        return state;
      }

      const inputs = { ...state.inputs };
      inputs[name] = inputs[prevName];
      delete inputs[prevName];
      return {
        ...state,
        inputs,
      };
    });
  };
}

export {
  useInputs,
  useGetBlockInfo,
  useEditBlockType,
  useHandleBlockValueChange,
  useAddInput,
  useDeleteInput,
  useGetAllInputs,
  useInitializeInputs,
  useEditName,
  useSwapInputs,
  useDropInput,
};
