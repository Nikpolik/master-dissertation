import { atom } from 'recoil';

import { localStorageEffect } from 'common/helpers';

export interface AuthState {
  user?: {
    id: string;
    name: string;
  };
  token?: string;
  error?: string;
}

const emptyAuth: AuthState = {};

const authState = atom<AuthState>({
  key: 'AuthAtom',
  default: emptyAuth,
  effects: [localStorageEffect],
});

export { authState };
