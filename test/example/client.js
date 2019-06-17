// @flow

import 'whatwg-fetch';
import {
  RelayNetworkLayer,
  cacheMiddleware,
  urlMiddleware,
} from 'react-relay-network-modern/node8';
import { Environment, RecordSource, Store } from 'relay-runtime';

import RelaySSR from '../../src/client';
import { type SSRCache as SSRCacheType } from '../../src/server';

const source = new RecordSource();
const store = new Store(source);

let storeEnvironment: Environment;

export default {
  createEnvironment: (relayData?: SSRCacheType): Environment => {
    if (storeEnvironment) return storeEnvironment;

    storeEnvironment = new Environment({
      store,
      network: new RelayNetworkLayer([
        cacheMiddleware({
          size: 100,
          ttl: 60 * 1000,
        }),
        new RelaySSR(relayData).getMiddleware({
          lookup: false,
        }),
        urlMiddleware({
          url: (req: mixed) => 'http://localhost:8000/graphql',
        }),
      ]),
    });

    return storeEnvironment;
  },
};
