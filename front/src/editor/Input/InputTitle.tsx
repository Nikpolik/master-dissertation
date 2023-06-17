import { TextField } from '@mui/material';
import { useEditName } from 'core';
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';
import { ChangeEventHandler, Fragment } from 'react';

import { InputTitleSpan } from './styles';

interface InputTitleProps {
  parentId: string;
  showName: boolean;
  label: string;
  blockName: string;
  object: boolean;
}

function InputTitle(props: InputTitleProps) {
  const { showName, label, blockName, object } = props;
  const [state, setState] = useState({ editable: true, value: label });
  const editName = useEditName(props.parentId);
  const debouncedEditName = useCallback(debounce(editName, 500), [props.parentId]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    debouncedEditName(props.label, event.target.value);
    setState((prev) => ({ ...prev, value: event.target.value }));
  };

  return (
    <InputTitleSpan>
      {showName && (
        <Fragment>
          {object && state.editable ? (
            <TextField
              inputProps={{ sx: { color: 'white' } }}
              size="small"
              variant="outlined"
              onChange={handleChange}
              value={state.value}
            />
          ) : (
            `${label} - `
          )}
        </Fragment>
      )}
      {blockName}
    </InputTitleSpan>
  );
}

export default InputTitle;
