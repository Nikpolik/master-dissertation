import { useAuth } from 'auth/hooks';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

import request, { HttpMethod, useRequest } from 'common/request';

import mediaAtom, { Asset } from './state';

function useMedia() {
  const [mediaState, setMediaState] = useRecoilState(mediaAtom);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { selectedAssetId, assets } = mediaState;

  // derrived data could memo
  const assetsArray = Object.values(assets);
  const selectedAsset = selectedAssetId ? mediaState.assets[selectedAssetId] : undefined;

  async function updateAsset(name: string, description: string, file?: File) {
    setLoading(true);
    try {
      const endpoint = selectedAsset ? `assets/${selectedAsset.id}` : 'assets';

      // Update name, description

      const { data } = await request<Asset>(endpoint, HttpMethod.POST, {
        token,
        data: { name, description },
      });

      if (!data) {
        throw new Error('Invalid response body, no file recieved');
      }

      // Update file
      let url: string | undefined;
      if (file) {
        const formData = new FormData();
        formData.set('asset', file);
        const response = await request<Asset>(`assets/${data.id}/file`, HttpMethod.POST, {
          token,
          data: formData,
        });

        url = response.data?.url;
      }

      setMediaState((prev) => {
        return {
          ...prev,
          assets: { ...prev.assets, [data.id]: { ...data, url: url || data.url } },
        };
      });

      return true;
    } catch (e) {
      console.error(e);
      return false;
    } finally {
      setLoading(false);
    }
  }

  function setSelectedAsset(id: string | null) {
    setMediaState((prev) => ({ ...prev, selectedAssetId: id }));
  }

  return { assets: assetsArray, setSelectedAsset, selectedAsset, updateAsset, loading };
}

function useDeleteMedia(id: string) {
  const { request, loading } = useRequest(`assets/${id}`, HttpMethod.DELETE);
  const [_, setMediaState] = useRecoilState(mediaAtom);

  async function deleteMedia() {
    await request()

    setMediaState((prev) => {
      const { [id]: _, ...assets } = prev.assets;
      return { ...prev, assets };
    });
  }
  return { loading, deleteMedia }
}

export { useDeleteMedia };
export default useMedia;
