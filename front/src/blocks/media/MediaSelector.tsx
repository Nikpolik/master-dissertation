import useMedia from 'media/hooks';

import { BlockEntry, InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core/block';

import { createStaticURL } from 'common/request';

interface MediaSelectorProps {
  name: () => string;
}

function useOptions() {
  const { assets } = useMedia();

  return assets.map((asset) => asset.name);
}

const inputsSettings = {
  name: {
    type: [InputType.string],
    defaultBlock: PrimitiveBlocks.string,
    label: 'Name',
    order: 1,
    options: useOptions,
  },
};

const mediaSelectorEntry: BlockEntry = {
  block: MediaSelector,
  inputsSettings,
  type: InputType.string,
  name: 'Media Selector',
  category: 'Interactive',
};

function MediaSelector({ id }: { id: string }) {
  const { name: useName } = useInputs<MediaSelectorProps>(id);
  const { assets } = useMedia();
  const name = useName();
  const asset = assets.find((asset) => name === asset.name);

  if (!asset) {
    return '';
  }

  return createStaticURL(asset.url);
}

registerBlock('mediaSelector', mediaSelectorEntry);
