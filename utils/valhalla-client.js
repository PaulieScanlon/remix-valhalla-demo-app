import { createClient } from '@urql/core';

export const client = createClient({
  url: 'https://valhallasourceconfig123-prod.valhalla-api.io/graphql',
  requestPolicy: 'network-only'
});
