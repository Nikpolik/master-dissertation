import { ButtonGroup } from '@mui/material';

import DeleteInput from './DeleteInput';
import EditInput from './EditInput';
import OpenInput from './OpenInput';
import SwapInput from './SwapInput';

interface ActionsProps {
  id: string;
  config: any;
  siblingsCount: number;
  parentId?: string;
  index?: number;
  name: string;
  showSwap?: boolean;
  showDelete: boolean;
  showTextarea: boolean;
}

function Actions(props: ActionsProps) {
  const { id, config, siblingsCount, parentId, showSwap, showDelete, showTextarea, index, name } = props;
  return (
    <ButtonGroup>
      {showTextarea && <OpenInput id={id} />}
      <EditInput config={config} id={id} />
      {showSwap && parentId && (
        <SwapInput siblingsCount={siblingsCount} parentId={parentId} index={index || 0} inputName={name} />
      )}
      {showDelete && parentId && <DeleteInput parentId={parentId} blockId={props.id} />}
    </ButtonGroup>
  );
}

export default Actions;
