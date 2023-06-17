import { BlockEntry, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core';
import { useContext } from 'react';

import { DataFetchBlockContext } from './FetchData';

interface DataSelectorProps {
  id: string;
}

interface DataSelectorChildren {
  selector: () => string;
}

function DataSelectorBlock(props: DataSelectorProps) {
  const { selector: useSelector } = useInputs<DataSelectorChildren>(props.id);
  const data = useContext(DataFetchBlockContext);
  const selector = useSelector();

  if (selector === undefined || selector === null || selector === '') {
    return data;
  }

  if (typeof data !== 'object' || data === null) {
    return null;
  }

  const parts = selector.split('.');
  let result = data;
  for (const part of parts) {
    if (part in result) {
      result = (result as any)[part];
    }
  }

  return result;
}

const dataSelectorEntry: BlockEntry<DataSelectorChildren> = {
  block: DataSelectorBlock,
  inputsSettings: {
    selector: {
      type: [InputType.string],
      defaultBlock: PrimitiveBlocks.string,
      defaultValue: '',
      label: 'Selector / Path',
      order: 0,
    },
  },
  type: InputType.any,
  name: 'Data Selector',
  category: 'Misc',
};

registerBlock('dataSelector', dataSelectorEntry);
