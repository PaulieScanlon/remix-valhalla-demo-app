import { createClient } from '@urql/core';

export const client = createClient({
  url: 'https://valhallaexamples-prod.staging-valhalla-api.io/',
  requestPolicy: 'network-only'
});
