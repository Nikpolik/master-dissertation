import { BlockEntry, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core';
import { useEffect, createContext, useState, ElementType } from 'react';

interface FetchDataProps {
  id: string;
}

interface FetchDataChildren {
  url: () => string;
  children: Array<ElementType>;
  Loading: ElementType;
}

export const DataFetchBlockContext = createContext<unknown>({});

export const DataFetchBlockProvider = DataFetchBlockContext.Provider;

export interface DataBlockState {
  state: 'done' | 'error' | 'fetching';
  data?: unknown;
  error?: string;
}

const initialBlockState: DataBlockState = {
  state: 'fetching',
};

function FetchDataBlock(props: FetchDataProps) {
  const { url: useUrl, children, Loading } = useInputs<FetchDataChildren>(props.id);
  const [state, setState] = useState(initialBlockState);

  const url = useUrl();

  useEffect(() => {
    if (!url) {
      setState({ state: 'error', error: 'Bad url' });
      return;
    }

    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setState({ data, state: 'done' });
      })
      .catch((error) => {
        setState({ error: error, state: 'error' });
      });
  }, [url]);

  if (state.state === 'fetching') {
    return <Loading />;
  }

  return (
    <DataFetchBlockProvider value={state.data}>
      {children.map((Child, i) => (
        <Child key={i} />
      ))}
    </DataFetchBlockProvider>
  );
}

const fetchDataEntry: BlockEntry<FetchDataChildren> = {
  block: FetchDataBlock,
  inputsSettings: {
    url: {
      type: [InputType.string],
      defaultBlock: PrimitiveBlocks.string,
      defaultValue: '',
      label: 'URL',
      order: 0,
    },
    children: {
      type: [InputType.block],
      array: true,
      order: 2,
      label: 'Children',
    },
    Loading: {
      type: [InputType.block],
      order: 1,
      label: 'Loading',
    },
  },
  type: InputType.block,
  name: 'Fetch',
  category: 'Misc',
};

registerBlock('fetchData', fetchDataEntry);
