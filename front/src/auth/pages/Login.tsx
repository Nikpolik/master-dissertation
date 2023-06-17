import LoadingButton from '@mui/lab/LoadingButton';
import { Input } from '@mui/material';
import { useLogin } from 'auth/hooks';
import { FormEvent } from 'react';

import { useForm } from 'common/hooks';

import { Container, Card, ErrorText, Title } from './styles';

const emptyForm = {
  username: '',
  password: '',
};

function Login() {
  const { login, loading, error } = useLogin();
  const [form, createHandler] = useForm(emptyForm);

  const { username, password } = form;
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login(username, password);
  }

  return (
    <Container>
      <Card onSubmit={handleSubmit}>
        <Title variant="h1">Login</Title>
        <Input name="name" placeholder="Name" value={username} onChange={createHandler('username')} />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={createHandler('password')}
        />
        {error && <ErrorText data-cy="error-login">{error}</ErrorText>}
        <LoadingButton type="submit" loading={loading} variant="contained">
          Login
        </LoadingButton>
      </Card>
    </Container>
  );
}

export default Login;
