import { useAuth } from 'auth/hooks';
import { useState } from 'react';

export const BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

console.log(`Using server URL: ${BASE_URL}`);

export enum HttpMethod {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

interface RequestResult<T = any, K = any> {
  data?: T;
  headers: Headers;
  code: number;
  status: string;
  error?: K;
}

interface RequestOptions {
  token?: string;
  headers?: Record<string, string>;
  data?: Record<string, any>;
}

async function request<T = any>(url: string, method: HttpMethod, options: RequestOptions = {}) {
  const { token, headers = {} } = options;

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let body: string | FormData | undefined = undefined;
  if (method === HttpMethod.POST && options.data !== undefined) {
    if (options.data instanceof FormData) {
      body = options.data;
    } else {
      body = JSON.stringify(options.data);
      headers['content-type'] = 'application/json';
    }
  }

  const urlParams = new URLSearchParams();
  if (method === HttpMethod.GET && options.data !== undefined) {
    generateQueryString(urlParams, options.data);
  }

  const response = await fetch(`${BASE_URL}/${url}${urlParams.toString()}`, {
    method,
    headers,
    body,
  });

  let requestResult: RequestResult<T> = {
    code: response.status,
    status: response.statusText,
    headers: response.headers,
  };

  if (response.headers.get('content-type') === 'application/json') {
    try {
      const data = await response.json();
      if (data.error) {
        requestResult.error = data.error;
      } else {
        requestResult.data = data;
      }
    } catch {}
  }

  if (response.headers.get('content-type') === 'text/html') {
    const key = response.status < 400 ? 'data' : 'error';
    try {
      const data = await response.text();
      requestResult[key] = data;
    } catch {}
  }

  if (response.status === 404 && !requestResult.error) {
    requestResult.error = 'Unexpected 404 result';
  }

  return requestResult;
}

function generateQueryString(urlParams: URLSearchParams, data: Record<string, any>) {
  for (const [key, value] of Object.entries(data)) {
    urlParams.set(key, value);
  }

  return urlParams;
}

function useRequest(url: string, method: HttpMethod) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  async function requestWithLoading<T>(options: RequestOptions = {}) {
    setLoading(true);
    const response = await request<T>(url, method, {
      ...options,
      token,
    });
    setLoading(false);
    return response;
  }

  return { request: requestWithLoading, loading };
}

function createStaticURL(path: string) {
  if (path.startsWith('blob:')) {
    return path;
  }

  return `${BASE_URL}${path}`;
}

export { useRequest, createStaticURL };
export default request;
