import { useEffect } from 'react';

import useMedia from './hooks';
import { Asset } from './state';

let media: Asset[] = [];

function getMedia() {
  return media;
}

export default function MediaProvider() {
  const { assets } = useMedia();

  useEffect(() => {}, []);

  return <></>;
}
