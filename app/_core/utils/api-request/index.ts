import axios, { AxiosRequestConfig } from 'axios';

import { createClientBrowser } from '~/core/lib/supabase/client';

export type IRequestBody = Record<string, any>; //eslint-disable-line

export type IFetchQuery = Record<string, any>; //eslint-disable-line

export interface IResponseError {
  name?: string;
  message?: string;
  type?: string;
  code?: number;
  data?: any;  //eslint-disable-line
}

axios.interceptors.request.use(async (config) => {
  const supabase = createClientBrowser();
  const { data } = await supabase.auth.getSession();

  if (data.session?.access_token) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`;
  }

  return config;
});

const requestAPI = async <T>(
  uri: string,
  options: AxiosRequestConfig,
): Promise<T> => {
  try {
    const { data } = await axios<T>(uri, {
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_PREFIX}`,
      ...options,
    });

    return data;
  } catch (ex) {
    const error = getErrorDetail(ex);
    throw error;
  }
};

const get = async <T>(
  uri: string,
  query?: IFetchQuery,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return await requestAPI(uri, {
    method: 'GET',
    params: query || {},
    ...options,
  });
};

const post = async <T>(
  uri: string,
  body: IRequestBody,
  query?: IFetchQuery,
  options?: AxiosRequestConfig,
): Promise<T> => {
  let isPostForm = false;

  if (typeof body === 'object' && body.constructor === FormData) {
    isPostForm = true;
  }

  const { headers = {} } = options || {};

  const customHeaders = isPostForm
    ? {
        ...headers,
      }
    : {
        'Content-Type': 'application/json',
        ...headers,
      };

  return await requestAPI(uri, {
    method: 'POST',
    data: isPostForm ? body : body,
    params: query || {},
    ...(options || {}),
    headers: customHeaders,
  });
};

const put = async <T>(
  uri: string,
  body: IRequestBody,
  query?: IFetchQuery,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return post(uri, body, query, {
    ...options,
    method: 'PUT',
  });
};

const patch = async <T>(
  uri: string,
  body: IRequestBody,
  query?: IFetchQuery,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return post(uri, body, query, {
    ...options,
    method: 'PATCH',
  });
};

const del = async <T>(
  uri: string,
  body: IRequestBody,
  query?: IFetchQuery,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return post(uri, body, query, {
    ...options,
    method: 'DELETE',
  });
};

export const getErrorDetail = (ex: any): IResponseError => { //eslint-disable-line
  return {
    name: ex.name,
    message: ex.message,
    code: ex.code,
    ...(ex.response?.data || {}),
  } as IResponseError;
};

export const apiRequest = {
  get,
  post,
  put,
  patch,
  delete: del,
};
