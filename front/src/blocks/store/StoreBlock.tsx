import { BlockEntry, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core';
import { MutableRefObject, useEffect, useRef } from 'react';

// map keys to ids;
export const stores = new Map<string, string>;
export const subscriptions = new Map<string, Set<string>>;

function addSubscription(storeKey: string, blockId: string) {
  const store = stores.get(storeKey);
  if (!store) {
    return;
  }

  const storeSubs = subscriptions.get(storeKey) || new Set();
  storeSubs.add(blockId);
  subscriptions.set(storeKey, storeSubs);
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

  }, [key]);

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
  category: "Store"
};

registerBlock('store', storeEntry);
export { addSubscription }
