import Add from '@mui/icons-material/Add';
import { Card, IconButton } from '@mui/material';
import { Fragment, useState } from 'react';
import styled from 'styled-components';

import MediaModal from './MediaModal';
import { Asset } from './state';

const StyledCard = styled(Card)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  height: fit-content;
  margin-top: auto;
  margin-bottom: auto;
`;

interface CreateMediaProps {
  onSubmit: (form: Partial<Asset>, file?: File) => void;
  loading: boolean;
}

function CreateMedia({ onSubmit, loading }: CreateMediaProps) {
  const [open, setOpen] = useState(false);
  const handleSubmit = (form: Partial<Asset>, file?: File) => {
    onSubmit(form, file);
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Fragment>
      <StyledCard>
        <IconButton data-cy="media-create-button" onClick={handleOpen} size="large">
          <Add fontSize="large" />
        </IconButton>
      </StyledCard>
      {open && <MediaModal loading={loading} onClose={handleClose} onSubmit={handleSubmit} />}
    </Fragment>
  );
}

export default CreateMedia;
