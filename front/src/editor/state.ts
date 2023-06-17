import { atom, atomFamily } from 'recoil';

const editorState = atom({
  key: 'EditorState',
  default: {
    open: true,
  },
});

const childOpenState = atomFamily({
  key: 'ChildOpenState',
  default: false,
});

export { editorState, childOpenState };
