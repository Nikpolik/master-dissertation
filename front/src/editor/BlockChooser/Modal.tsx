import { Dialog, DialogContent } from '@mui/material';
import { Input } from 'core';
import { atom, useRecoilState } from 'recoil';

import Picker from './Picker';

interface BlockChooserState {
  open: boolean;
  block?: {
    selectedBlockId: string;
    config: Input;
  };
}

const closedModalState: BlockChooserState = {
  open: false,
};

const blockChooserAtom = atom<BlockChooserState>({
  key: 'BlockChooserAtom',
  default: closedModalState,
});

function BlockChooser() {
  const [{ open, block }, setModalState] = useRecoilState(blockChooserAtom);

  const closeModal = () => {
    setModalState(closedModalState);
  };

  if (!open || !block) {
    return null;
  }

  const { selectedBlockId, config } = block;

  return (
    <Dialog maxWidth={false} open={open} onClose={closeModal}>
      <DialogContent>
        <Picker config={config} id={selectedBlockId} />
      </DialogContent>
    </Dialog>
  );
}

export default BlockChooser;
export { blockChooserAtom };
