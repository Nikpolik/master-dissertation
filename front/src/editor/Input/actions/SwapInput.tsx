import { MoveUp, MoveDown } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useSwapInputs } from 'core';

interface SwapInputProps {
  index: number;
  inputName: string;
  parentId: string;
  siblingsCount: number;
}

function SwapInput(props: SwapInputProps) {
  const { index, inputName, parentId, siblingsCount } = props;
  const swapInput = useSwapInputs(parentId);

  return (
    <>
      <Button
        data-cy="editor-move-up-input"
        disabled={index === 0}
        onClick={() => swapInput(inputName, index, 'up')}
        size="small"
        variant="contained"
      >
        <MoveUp fontSize="small" />
      </Button>
      <Button
        data-cy="editor-move-down-input"
        disabled={siblingsCount === index}
        onClick={() => swapInput(inputName, index, 'down')}
        size="small"
        variant="contained"
      >
        <MoveDown fontSize="small" />
      </Button>
    </>
  );
}

export default SwapInput;
