import LoadingButton from '@mui/lab/LoadingButton';
import { Input } from '@mui/material';
import { useRegister } from 'auth/hooks';
import { FormEvent } from 'react';

import { useForm } from 'common/hooks';

import { Container, Card, ErrorText, Title } from './styles';

const emptyForm = {
  username: '',
  password: '',
  confirm: '',
};

function Login() {
  const { register, loading, error } = useRegister();
  const [form, createHandler] = useForm(emptyForm);

  const { username, password, confirm } = form;
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    register(username, password, confirm);
  }

  return (
    <Container>
      <Card onSubmit={handleSubmit}>
        <Title variant="h1">Register</Title>
        <Input placeholder="Username" value={username} onChange={createHandler('username')} />
        <Input placeholder="Password" type="password" value={password} onChange={createHandler('password')} />
        <Input placeholder="Confirm Password" type="password" value={confirm} onChange={createHandler('confirm')} />
        {error && <ErrorText>{error}</ErrorText>}
        <LoadingButton type="submit" loading={loading} variant="contained">
          Register
        </LoadingButton>
      </Card>
    </Container>
  );
}

export default Login;
