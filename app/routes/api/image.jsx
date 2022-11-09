import { imageLoader, DiskCache } from 'remix-image/server';

const config = {
  selfUrl: 'http://localhost:3000',
  cache: new DiskCache()
};

export const loader = ({ request }) => {
  return imageLoader(config, request);
};
