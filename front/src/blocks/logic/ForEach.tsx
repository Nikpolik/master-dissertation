import { BlockEntry, InputType, registerBlock, useInputs } from 'core';
import { ComponentType } from 'react';
import { v4 as uuid } from 'uuid';

import { DataFetchBlockProvider } from './FetchData';

interface ReducerProps {
  id: string;
}

interface ReducerChildren {
  block: ComponentType | null;
  values: () => Record<string, any>[];
}

function ReducerBlock(props: ReducerProps) {
  const { block: Block, values: useValues } = useInputs<ReducerChildren>(props.id);
  const values = useValues();

  if (!values || !Array.isArray(values) || Block === null) {
    return null;
  }

  return values.map((value, i) => (
    <DataFetchBlockProvider key={uuid()} value={value}>
      <Block />
    </DataFetchBlockProvider>
  ));
}

const reducerEntry: BlockEntry<ReducerChildren> = {
  block: ReducerBlock,
  inputsSettings: {
    block: {
      type: [InputType.block],
      label: 'Block',
      order: 10,
    },
    values: {
      type: [InputType.any],
      defaultBlock: 'dataSelector',
      label: 'Values',
      order: 1,
    },
  },
  type: InputType.block,
  name: 'ForEach',
  category: 'Misc',
};

registerBlock('reducer', reducerEntry);
