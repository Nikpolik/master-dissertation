import { BlockEntry, blockStateAtomFamily, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core';
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
  const key = useKey();
  const id = stores.get(key);
  const { value } = useRecoilValue(blockStateAtomFamily(id || ''));

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
