import { Middleware, QueryPayload } from "react-relay-network-modern";
import { GraphQLSchema, GraphQLFieldResolver, ExecutionResult } from "graphql";

type SSRGraphQLArgs = {
  schema: GraphQLSchema;
  rootValue?: unknown;
  contextValue?: unknown;
  operationsName?: string;
  fieldResolver?: GraphQLFieldResolver<any, any>;
};

export type SSRCache = ([string, QueryPayload])[];

export default class RelayServerSSR {
  cache: Map<string, Promise<ExecutionResult>>;
  debug: boolean;

  constructor();

  getMiddleware(
    args?: SSRGraphQLArgs | (() => Promise<SSRGraphQLArgs>)
  ): Middleware;

  getCache(): Promise<SSRCache>;

  log(...args: any[]): void;
}
