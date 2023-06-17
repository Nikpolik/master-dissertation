import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';

import { Input as InputConfig, InputType, useDropInput } from 'core/block';

import Input from '.';
import InputTitle from './InputTitle';
import DeleteInput from './actions/DeleteInput';
import EditInput from './actions/EditInput';
import { PrimitiveContainer } from './styles';

const DropArea = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EmptyContainer = styled(PrimitiveContainer)<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  gap: 12px;
`;

interface EmptyTargetProps {
  depth: number;
  parentId: string;
  siblingsCount: number;
  name: string;
  config: InputConfig;
  id: string;
  blockTitle: string;
}

function EmptyTarget(props: EmptyTargetProps) {
  const { depth, parentId, siblingsCount, name, config, id, blockTitle } = props;
  const showDelete = config.array && siblingsCount > 0;
  const handleDrop = useDropInput();
  const showName = !config.array;

  const [{ item, isOver }, dropRef] = useDrop(
    () => ({
      accept: config.type,
      drop(item: { id: string; parentId: string; type: InputType }) {
        handleDrop(parentId, item.parentId, item.id, id);
      },
      canDrop(item) {
        return config.type.includes(item.type) || item.type === InputType.any;
      },
      collect(monitor) {
        return {
          item: monitor.canDrop() ? monitor.getItem() : undefined,
          isOver: monitor.isOver(),
        };
      },
    }),
    [config]
  );

  return (
    <div data-cy="editor-drop-target" ref={dropRef}>
      <EmptyContainer data-cy="editor-header-input" visible={!isOver} depth={depth}>
        <InputTitle
          parentId={props.parentId}
          object={false}
          blockName={blockTitle}
          label={config.label}
          showName={showName}
        />
        <DropArea>
          <HighlightAltIcon />
        </DropArea>
        <EditInput config={config} id={id} />
        {showDelete && <DeleteInput parentId={parentId} blockId={props.id} />}
      </EmptyContainer>
      {isOver && item && item.id && (
        <Input
          id={item.id}
          parentId={parentId}
          config={config}
          siblingsCount={siblingsCount}
          name={name}
          object={false}
          depth={depth}
        />
      )}
    </div>
  );
}

export default EmptyTarget;
