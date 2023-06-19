import { BlockEntry, InputType, PrimitiveBlocks, registerBlock, setBlockValue, useInputs } from 'core';

import { stores } from './StoreBlock';

interface SetStoreBlockProps {
  id: string;
}

interface SetStoreChildren {
  key: () => string;
  value: () => string;
}

export function SetStoreBlock(props: SetStoreBlockProps) {
  let { key: useKey, value: useValue } = useInputs<SetStoreChildren>(props.id);
  const key = useKey();
  let value = useValue();
  const id = stores.get(key);

  return ({ value: eventValue }: { value: string }) => {
    if (!id) {
      return;
    }

    setBlockValue(id, eventValue || value);
  };
}

const setStoreEntry: BlockEntry<SetStoreChildren> = {
  block: SetStoreBlock,
  inputsSettings: {
    key: {
      type: [InputType.string],
      label: 'Key',
      defaultBlock: PrimitiveBlocks.string,
      order: 0,
    },
    value: {
      type: [InputType.string],
      label: 'Value',
      defaultBlock: PrimitiveBlocks.string,
      order: 1,
    },
  },
  type: InputType.function,
  name: 'Set Store Value',
  category: 'Store',
};

registerBlock('setStore', setStoreEntry);
