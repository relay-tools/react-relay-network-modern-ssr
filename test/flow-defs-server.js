/* @flow */

import { RelayNetworkLayer, urlMiddleware } from 'react-relay-network-modern';
import RelayServerSSR from '../src/server';

const relayServerSSR = new RelayServerSSR();

export const network = new RelayNetworkLayer([
  urlMiddleware({
    url: () => 'http://localhost:8000/graphql',
  }),
  relayServerSSR.getMiddleware(),
]);

console.log(network);
