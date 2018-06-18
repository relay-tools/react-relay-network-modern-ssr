/* @flow */

import type { MiddlewareSync, QueryPayload } from 'react-relay-network-modern/lib/definition';
import type { SSRCache } from './server';
import { getCacheKey } from './utils';

type RelayClientSSRMiddlewareOpts = {|
  lookup?: boolean,
|};

export default class RelayClientSSR {
  cache: ?Map<string, QueryPayload>;
  debug: boolean;

  constructor(cache?: SSRCache) {
    if (Array.isArray(cache)) {
      this.cache = new Map(cache);
    } else {
      this.cache = null;
    }
  }

  getMiddleware(opts?: RelayClientSSRMiddlewareOpts): MiddlewareSync {
    return {
      execute: (operation, variables) => {
        const cache = this.cache;
        if (cache) {
          const cacheKey = getCacheKey(operation.name, variables);
          if (cache.has(cacheKey)) {
            const payload = cache.get(cacheKey);
            this.log('SSR_CACHE_GET', cacheKey, payload);

            const lookup = opts && opts.lookup;
            if (!lookup) {
              cache.delete(cacheKey);
              if (cache.size === 0) {
                this.cache = null;
              }
            }

            return payload;
          }
          this.log('SSR_CACHE_MISS', cacheKey, operation);
        }
        return undefined;
      },
    };
  }

  clear() {
    if (this.cache) {
      this.cache.clear();
    }
  }

  log(...args: any) {
    if (this.debug) {
      console.log('[RelayClientSSR]:', ...args);
    }
  }
}
