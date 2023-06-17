import { Add } from '@mui/icons-material';
import { Button as MButton } from '@mui/material';
import { useAddInput } from 'core';
import styled from 'styled-components';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Button = styled(MButton)`
  font-size: 14px;
  margin-top: 8px;
  overflow: hidden;
  box-sizing: border-box;
`;

interface AddInputProps {
  blockId: string;
  inputName: string;
}

function AddInput(props: AddInputProps) {
  const { blockId, inputName } = props;
  const addInput = useAddInput(blockId);

  return (
    <ButtonContainer data-cy="editor-add-input">
      <Button variant="contained" onClick={() => addInput(inputName)}>
        <Add  />
      </Button>
    </ButtonContainer>
  );
}

export default AddInput;
