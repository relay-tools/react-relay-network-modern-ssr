import { MiddlewareSync, QueryPayload } from "react-relay-network-modern";
import { SSRCache } from "./server";

type RelayClientSSRMiddlewareOpts = {
  lookup?: boolean;
};

export default class RelayClientSSR {
  cache?: Map<string, QueryPayload>;
  debug: boolean;

  constructor(cache?: SSRCache);

  getMiddleware(opts?: RelayClientSSRMiddlewareOpts): MiddlewareSync;

  clear(): void;

  log(...args: any[]): void;
}
