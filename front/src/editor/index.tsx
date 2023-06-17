import { InputType } from 'core';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';

import colors from 'common/theme/colors';

import Modal from './BlockChooser/Modal';
import Input from './Input';
import { useEditor } from './hooks';

interface EditorContainerProps {
  open: boolean;
}

const EditorContainer = styled.div<EditorContainerProps>`
  overflow-y: auto;
  height: 100%;
  background-color: ${colors['CG Blue']};
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: ${({ open }) => (open ? 'max-content' : '36px')};
`;

const InputContainer = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? '' : 'none')};
  width: max-content;
`;

interface EditorProps {
  rootId: string;
}

const blockConfig = { label: '', array: false, type: [InputType.block], defaultBlock: 'Root', order: 0 };

const Editor = ({ rootId }: EditorProps) => {
  const {
    state: { open },
  } = useEditor();

  return (
    <EditorContainer open={open}>
      <DndProvider backend={HTML5Backend}>
        <InputContainer open={open}>
          <Input parentId="" object={false} name="Root" siblingsCount={0} id={rootId} config={blockConfig} />
        </InputContainer>
      </DndProvider>
      <Modal />
    </EditorContainer>
  );
};

export default Editor;
