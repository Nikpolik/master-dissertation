import Root from 'blocks/Root';
import { Suspense, useEffect } from 'react';

import { BlockState, useInitializeInputs } from 'core/block';

interface RenderAppProps {
  inputs: BlockState[];
  rootId: string;
}

export default function RenderApp(props: RenderAppProps) {
  const initializePage = useInitializeInputs();

  useEffect(() => {
    initializePage(props.inputs);
  }, [props.inputs, props.rootId]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Root id={props.rootId} />
    </Suspense>
  );
}
