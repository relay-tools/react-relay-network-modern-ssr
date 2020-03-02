type ValueType = string | object | ValueType[];

export function isFunction(obj: unknown): obj is object;

export function stableCopy(value: ValueType): ValueType;

export function getCacheKey(queryID: string, variables: object): string;
