import { imageLoader, DiskCache } from 'remix-image/server';

const config = {
  selfUrl: process.env.SELF_URL,
  cache: new DiskCache()
};

export const loader = ({ request }) => {
  return imageLoader(config, request);
};
