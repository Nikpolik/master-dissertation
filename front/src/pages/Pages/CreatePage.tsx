import AddIcon from '@mui/icons-material/AddBox';
import { LoadingButton } from '@mui/lab';
import { IconButton, Dialog, Button, DialogContent, DialogTitle, DialogActions, TextField } from '@mui/material';
import { useCreatePage } from 'pages/hooks';
import { useState } from 'react';
import styled from 'styled-components';

import { useForm } from 'common/hooks';

const StyledActions = styled(DialogActions)`
  margin-bottom: 16px;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function CreatePage() {
  const { loading, createPage } = useCreatePage();
  const [open, setOpen] = useState(false);
  const [form, createHandler] = useForm({ name: '', description: '' });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = async () => {
    const success = await createPage(form.name, form.description);
    if (!success) {
      return;
    }

    handleClose();
  };

  return (
    <Container data-cy="pages-add-button">
      <IconButton onClick={handleClickOpen}>
        <AddIcon sx={{ fontSize: 60 }} />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create new Page</DialogTitle>
        <DialogContent>
          <TextField
            onChange={createHandler('name')}
            autoFocus
            margin="dense"
            name="name"
            id="name"
            label="Name"
            fullWidth
            variant="outlined"
          />
          <TextField
            onChange={createHandler('description')}
            minRows={4}
            multiline
            autoFocus
            data-cy="description"
            margin="dense"
            id="description"
            label="Description"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <StyledActions>
          <Button variant="contained" onClick={handleClose}>
            Discard
          </Button>
          <LoadingButton type="submit" variant="contained" loading={loading} onClick={handleCreate} autoFocus>
            Create
          </LoadingButton>
        </StyledActions>
      </Dialog>
    </Container>
  );
}

export default CreatePage;
