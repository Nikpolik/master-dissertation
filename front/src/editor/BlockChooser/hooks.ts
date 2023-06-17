import { Input } from 'core';
import { useRecoilCallback } from 'recoil';

import { blockChooserAtom } from './Modal';

function useTogglePicker() {
  const open = useRecoilCallback(
    ({ set }) =>
      async (id: string, config: Input) => {
        set(blockChooserAtom, { open: true, block: { config, selectedBlockId: id } });
      },
    []
  );

  const close = useRecoilCallback(
    ({ set }) =>
      async () =>
        set(blockChooserAtom, { open: false })
  );

  return { open, close };
}

export { useTogglePicker };
