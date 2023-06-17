import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import { HttpMethod, useRequest } from 'common/request';

import { authState } from './state';

interface LoginResponse {
  token?: string;
  error?: string;
}

interface RegisterResponse {
  id?: string;
  name: string;
}

function useLogin() {
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  const { request, loading } = useRequest('user/authenticate', HttpMethod.POST);

  async function login(name: string, password: string) {
    try {
      const response = await request<LoginResponse>({
        data: {
          name,
          password,
        },
      });

      if (!response.data || !response.data.token) {
        throw new Error(response.error || 'Invalid response body');
      }

      setAuth({ token: response.data.token, error: undefined });
      navigate('/');
    } catch (e: any) {
      const errorMessage = e ? e.message : undefined;
      console.log(e);
      setAuth((auth) => ({ ...auth, error: errorMessage }));
    }
  }

  return { login, loading, error: auth.error };
}

function useRegister() {
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  const { request, loading } = useRequest('user', HttpMethod.POST);

  async function register(name: string, password: string, confirm: string) {
    if (password !== confirm) {
      throw new Error('Password does not match confirmation');
    }

    try {
      const response = await request<RegisterResponse>({
        data: {
          name,
          password,
        },
      });

      if (!response.data || !response.data.id) {
        throw new Error(response.error || 'Invalid response');
      }

      setAuth((auth) => ({ ...auth, error: undefined }));
      navigate('/login');
    } catch (e: any) {
      const errorMessage = e ? e.message : undefined;
      console.log(e);
      setAuth((auth) => ({ ...auth, error: errorMessage }));
    }
  }

  return { register, loading, error: auth.error };
}

function useAuth() {
  return useRecoilValue(authState);
}

export { useLogin, useAuth, useRegister };
