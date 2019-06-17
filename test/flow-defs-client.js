/* @flow */

import { RelayNetworkLayer, cacheMiddleware, urlMiddleware } from 'react-relay-network-modern';
import RelaySSR from '../src/client';

export const network = new RelayNetworkLayer([
  cacheMiddleware({
    size: 100,
    ttl: 60 * 1000,
  }),
  new RelaySSR().getMiddleware({
    lookup: false,
  }),
  urlMiddleware({
    url: () => 'http://localhost:8000/graphql',
  }),
]);
