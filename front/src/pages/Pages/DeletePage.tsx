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

import { useDeletePage } from '../hooks';

interface DeletePageProps {
  id: string;
}

export default function DeletePage(props: DeletePageProps) {
  const { id } = props;
  const { deletePage, loading } = useDeletePage(id);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    await deletePage();
    setOpen(false);
  };

  return (
    <>
      <IconButton data-cy="pages-delete-button" onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{'Delete Page'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this page?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <LoadingButton data-cy="pages-accept-delete-button" loading={loading} onClick={handleDelete} autoFocus>
            Yes
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
