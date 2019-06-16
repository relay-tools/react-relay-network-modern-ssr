/* @flow */
/* eslint-disable  */

type valueType = string | Object | valueType[];

export function isFunction(obj: any): boolean %checks {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}

export function stableCopy(value: valueType): valueType {
  if (!value || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(stableCopy);
  }
  const keys = Object.keys(value).sort();
  const stable = {};
  for (let i = 0; i < keys.length; i++) {
    stable[keys[i]] = stableCopy(value[keys[i]]);
  }
  return stable;
}

export function getCacheKey(queryID: string, variables: Object): string {
  return JSON.stringify(stableCopy({ queryID, variables }));
}
