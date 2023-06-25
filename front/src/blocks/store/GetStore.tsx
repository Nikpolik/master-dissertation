import { BlockEntry, blockStateAtomFamily, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { stores } from './StoreBlock';

interface GetStoreBlockProps {
  id: string;
}

interface GetStoreChildren {
  key: () => string;
}

export function GetStoreBlock(props: GetStoreBlockProps) {
  const { key: useKey } = useInputs<GetStoreChildren>(props.id);
  const [id, setId] = useState<string | undefined>();
  const key = useKey();
  const { value } = useRecoilValue(blockStateAtomFamily(id || ''));
  console.log('value', value);

  useEffect(() => {
    console.log('key', key);
    setId(stores.get(key));
  }, [key]);

  if (!id) {
    return undefined;
  }

  return value;
}

const getStoreEntry: BlockEntry<GetStoreChildren> = {
  block: GetStoreBlock,
  inputsSettings: {
    key: {
      type: [InputType.string],
      label: 'Key',
      defaultBlock: PrimitiveBlocks.string,
      order: 0,
    },
  },
  type: InputType.string,
  name: 'Get Store Value',
  category: 'Stores',
};

registerBlock('getStore', getStoreEntry);
