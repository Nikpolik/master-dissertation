import { UploadFile } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { Modal, TextField, Card, CardContent, CardMedia, CardActions, Button, IconButton } from '@mui/material';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import styled from 'styled-components';

import { useForm } from 'common/hooks';
import { createStaticURL } from 'common/request';

import { Asset } from './state';

interface MediaModalProps {
  onClose: () => void;
  asset?: Asset;
  onSubmit: (form: Partial<Asset>, image?: File) => void;
  loading: boolean;
}

const StyledCard = styled(Card)`
  padding: 16px;
  padding-bottom: 0px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled(TextField)`
  width: 100%;
`;

const StyledCardActions = styled(CardActions)`
  width: 100%;
  display: flex;
  justify-content: end;
`;

export default function MediaModal(props: MediaModalProps) {
  const { onClose, asset, onSubmit, loading } = props;
  const [form, createHandler] = useForm<Partial<Asset>>(asset || {});
  const filePickerRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();

  const changeUrl = createHandler('url');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form, file);
  }

  function handeFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.currentTarget.files;
    if (!files) {
      return;
    }

    const file = files.item(0);
    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);
    changeUrl(null, () => url);
    setFile(file);
  }

  function handleFileUploadClick() {
    if (!filePickerRef.current) {
      return;
    }

    filePickerRef.current.click();
  }

  return (
    <Modal open onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <StyledCard>
        <form onSubmit={handleSubmit}>
          <StyledCardContent>
            {form?.url && <CardMedia style={{ maxHeight: '50vh' }} component="img" src={createStaticURL(form.url)} />}
            <IconButton onClick={handleFileUploadClick} size="large">
              <UploadFile fontSize="large" />
            </IconButton>
            <input accept="image/*" type="file" hidden ref={filePickerRef} onChange={handeFileUpload} />
            <StyledInput name="name" onChange={createHandler('name')} value={form.name || ''} label="name" />
            <StyledInput
              name="description"
              onChange={createHandler('description')}
              multiline
              value={form.description || ''}
              label="Description"
            />
            <StyledCardActions>
              <Button variant="contained" onClick={onClose}>
                <CloseIcon />
              </Button>
              <LoadingButton type="submit" variant="contained" loading={loading}>
                <SaveIcon />
              </LoadingButton>
            </StyledCardActions>
          </StyledCardContent>
        </form>
      </StyledCard>
    </Modal>
  );
}
