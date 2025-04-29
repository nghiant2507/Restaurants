import { AxiosRequestConfig } from 'axios';
import { flatten } from 'flat';

import {
  apiRequest,
  IFetchQuery,
  IRequestBody,
} from '~/core/utils/api-request';

interface IQueryParameters {
  page?: number;
  limit?: number;
  search?: string;
}

interface IBaseAction<T> {
  create: (
    body: IRequestBody,
    query?: IQueryParameters,
    options?: AxiosRequestConfig,
  ) => Promise<T>;

  get: (
    id: string | number,
    query?: IQueryParameters,
    options?: AxiosRequestConfig,
  ) => Promise<T>;

  find: (query: IQueryParameters, options?: AxiosRequestConfig) => Promise<T[]>;

  all: (query: IQueryParameters, options?: AxiosRequestConfig) => Promise<T[]>;

  update: (
    id: string | number,
    body: IRequestBody,
    query?: IQueryParameters,
    options?: AxiosRequestConfig,
  ) => Promise<T>;

  delete: (id: string | number, query?: IQueryParameters) => Promise<T>;
}

interface IBaseService {
  path: string;
}
export const toQueryString = (queryParams?: IQueryParameters): IFetchQuery => {
  const params = { ...queryParams };

  return flatten(params);
};

export const createService = <T>(options: IBaseService) => {
  const { path } = options;

  const apis: IBaseAction<T> = {
    create: async (
      body: IRequestBody,
      query?: IQueryParameters,
      options?: AxiosRequestConfig,
    ) => {
      return apiRequest.post<T>(path, toQueryString(query), body, options);
    },

    get: async (
      id: string | number,
      query?: IQueryParameters,
      options?: AxiosRequestConfig,
    ) => {
      return apiRequest.get<T>(`${path}/${id}`, toQueryString(query), options);
    },

    find: async (query: IQueryParameters, options?: AxiosRequestConfig) => {
      console.log(query);
      return apiRequest.get<T[]>(path, toQueryString(query), options);
    },

    all: async (query?: IQueryParameters, options?: AxiosRequestConfig) => {
      return apiRequest.get<T[]>(path, toQueryString(query), options);
    },

    update: async (
      id: string | number,
      body: IRequestBody,
      query?: IQueryParameters,
      options?: AxiosRequestConfig,
    ) => {
      return apiRequest.patch<T>(
        `${path}/${id}`,
        toQueryString(query),
        body,
        options,
      );
    },

    delete: async (
      id: string | number,
      query?: IQueryParameters,
      body?: IRequestBody,
      options?: AxiosRequestConfig,
    ) => {
      return apiRequest.delete<T>(
        `${path}/${id}`,
        toQueryString(query),
        body || {},
        options,
      );
    },
  };
  return apis;
};
