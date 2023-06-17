import styled from 'styled-components';

import CreateMedia from './CreateMedia';
import MediaCard from './MediaCard';
import MediaModal from './MediaModal';
import useMedia from './hooks';
import { Asset } from './state';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: stretch;
  padding: 12px;
`;

function Media() {
  const { assets, selectedAsset, setSelectedAsset, updateAsset, loading } = useMedia();

  function handleClose() {
    setSelectedAsset(null);
  }

  async function handleSubmit(form: Partial<Asset>, file?: File) {
    if (!form.name || !form.description) {
      return;
    }

    const result = await updateAsset(form.name, form.description, file);
    if (result) {
      setSelectedAsset(null);
    }
  }

  return (
    <Container data-cy="media-container">
      {assets.map((asset) => (
        <MediaCard asset={asset} onClick={() => setSelectedAsset(asset.id)} key={asset.id} />
      ))}
      <CreateMedia onSubmit={handleSubmit} loading={loading} />
      {selectedAsset && (
        <MediaModal loading={loading} asset={selectedAsset} onClose={handleClose} onSubmit={handleSubmit} />
      )}
    </Container>
  );
}

export default Media;
