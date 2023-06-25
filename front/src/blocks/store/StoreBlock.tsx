import { BlockEntry, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core';
import { MutableRefObject, useEffect, useRef } from 'react';

// map keys to ids;
export const stores: Map<string, string> = new Map();
export const subscriptions: Map<string, Set<string>> = new Map();

export function getStore(id: string) {
  const store = stores.get(id);
  if (!store) {
    return undefined;
  }

  return store;
}

interface StoreBlockProps {
  id: string;
}

const StoreBlock = (props: StoreBlockProps) => {
  const { key: useKey } = useInputs<{ key: () => string }>(props.id);
  const key = useKey();

  const prevKey: MutableRefObject<string | null> = useRef<string>(null);

  useEffect(() => {
    if (!key) {
      return;
    }

    if (stores.has(key)) {
      if (prevKey.current !== key && prevKey.current) {
        console.error('Tried to use an already existing key for a store');
      }
      return;
    }

    if (prevKey.current) {
      stores.delete(prevKey.current);
    }

    prevKey.current = key;
    stores.set(key, props.id);
  }, [key, props.id]);

  return <></>;
};

const storeEntry: BlockEntry = {
  block: StoreBlock,
  inputsSettings: {
    key: {
      type: [InputType.string],
      label: 'Key',
      defaultBlock: PrimitiveBlocks.string,
      order: 0,
    },
  },
  type: InputType.block,
  name: 'Store',
  category: 'Store',
};

registerBlock('store', storeEntry);
