/* @flow */
import type { Middleware, QueryPayload } from 'react-relay-network-modern/lib/definition';
import type RelayRequest from 'react-relay-network-modern/lib/RelayRequest';
import { inspect } from 'util';
import {
  graphql,
  type GraphQLSchema,
  type GraphQLFieldResolver,
  type ExecutionResult,
} from 'graphql'; // eslint-disable-line
import { getCacheKey, isFunction } from './utils';

let RelayResponse;
/* eslint-disable global-require */
if (process.env.BABEL_ENV === 'node8') {
  RelayResponse = require('react-relay-network-modern/node8/RelayResponse');
}
if (process.env.BABEL_ENV === 'lib') {
  RelayResponse = require('react-relay-network-modern/lib/RelayResponse');
}
if (process.env.BABEL_ENV === 'mjs') {
  RelayResponse = require('react-relay-network-modern/mjs/RelayResponse');
}
/* eslint-enable global-require */

type SSRGraphQLArgs = {|
  schema: GraphQLSchema,
  rootValue?: mixed,
  contextValue?: mixed,
  operationName?: ?string,
  fieldResolver?: ?GraphQLFieldResolver<any, any>,
|};

export type SSRCache = Array<[string, QueryPayload]>;

export default class RelayServerSSR {
  cache: Map<string, Promise<ExecutionResult>>;
  debug: boolean;

  constructor() {
    this.cache = new Map();
  }

  getMiddleware(args: SSRGraphQLArgs | (() => Promise<SSRGraphQLArgs>)): Middleware {
    return next => async (r: any) => {
      const req: RelayRequest = r;
      const cacheKey = getCacheKey(req.operation.name, req.variables);

      const cachedResponse = this.cache.get(cacheKey);
      if (cachedResponse) {
        this.log('Get graphql query from cache', cacheKey);
        return RelayResponse.createFromGraphQL(await cachedResponse);
      }

      this.log('Run graphql query', cacheKey);

      const graphqlArgs: SSRGraphQLArgs = isFunction(args) ? await args() : (args: any);
      const hasSchema = graphqlArgs && graphqlArgs.schema;
      const gqlResponse = new Promise(async (resolve, reject) => {
        setTimeout(() => {
          reject(new Error('RelayRequest timeout'));
        }, 30000);

        let payload = null;
        if (hasSchema) {
          payload = await graphql({
            ...graphqlArgs,
            source: req.getQueryString(),
            variableValues: req.getVariables(),
          });
        } else {
          payload = await next(r);
        }
        resolve(payload);
      });
      this.cache.set(cacheKey, gqlResponse);

      const res = await gqlResponse;
      this.log('Recieved response for', cacheKey, inspect(res, { colors: true, depth: 4 }));
      return RelayResponse.createFromGraphQL(res);
    };
  }

  async getCache(): Promise<SSRCache> {
    const arr = [];
    const keys = Array.from(this.cache.keys());
    for (let i = 0; i < keys.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const payload: any = await this.cache.get(keys[i]);
      arr.push([keys[i], payload]);
    }
    this.log('Recieved all payloads', arr.length);
    return arr;
  }

  log(...args: any) {
    if (this.debug) {
      console.log(...args);
    }
  }
}
