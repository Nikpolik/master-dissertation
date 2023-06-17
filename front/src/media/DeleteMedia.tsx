import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import {
  IconButton,
  Dialog,
  Button,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { useState } from 'react';

import {  useDeleteMedia } from './hooks';

interface DeleteMediaProps {
  id: string;
}

export default function DeleteMedia(props: DeleteMediaProps) {
  const { id } = props;
  const { deleteMedia, loading } = useDeleteMedia(id);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    await deleteMedia();
    setOpen(false);
  };

  return (
    <>
      <IconButton data-cy="media-delete-button" onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{'Delete Media'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this media?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <LoadingButton data-cy="media-accept-delete-button" loading={loading} onClick={handleDelete} autoFocus>
            Yes
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
