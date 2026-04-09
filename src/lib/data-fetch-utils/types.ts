import type { FetchError } from './fetchErrors';

export type IFindQueryResult<T> = {
  data?: T;
  error?: FetchError;
};
