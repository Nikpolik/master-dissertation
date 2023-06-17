import { authState } from 'auth/state';
import { atom, selector } from 'recoil';

import request, { HttpMethod } from 'common/request';

export interface Asset {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  url: string;
}

export interface MediaState {
  assets: Record<string, Asset>;
  selectedAssetId: string | null;
}

const mediaAtom = atom<MediaState>({
  key: 'media',
  default: selector({
    key: 'media/default',
    get: async ({ get }) => {
      const { token } = get(authState);
      const response = await request<Asset[]>('assets', HttpMethod.GET, { token });

      const assets: Record<string, Asset> = {};
      for (const asset of response.data || []) {
        assets[asset.id] = asset;
      }

      return {
        assets,
        selectedAssetId: null,
      };
    },
  }),
});

export default mediaAtom;
