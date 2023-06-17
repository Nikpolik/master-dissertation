import { useRecoilState } from 'recoil';

import { childOpenState, editorState } from './state';

function useEditor() {
  const [state, setEditorState] = useRecoilState(editorState);

  function toggleEditor() {
    setEditorState((prev) => ({ ...prev, open: !prev.open }));
  }

  return { toggleEditor, state };
}

function useOpen(id: string) {
  return useRecoilState(childOpenState(id));
}

export { useEditor, useOpen };
