import { APIRequestContext } from '@playwright/test';

export type HTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export class ApiClient {
  private context: APIRequestContext;
  private baseUrl: string;

  constructor(context: APIRequestContext, baseUrl: string) {
    this.context = context;
    this.baseUrl = baseUrl;
  }

  async request(method: HTTPMethod, endpoint: string, data?: any) {
    if (data) {
      return await this.context[method](this.baseUrl + endpoint, { data });
    } else {
      return await this.context[method](this.baseUrl + endpoint);
    }
  }

  async get(endpoint: string) {
    return this.request('get', endpoint);
  }

  async post(endpoint: string, data: any) {
    return this.request('post', endpoint, data);
  }

  async put(endpoint: string, data: any) {
    return this.request('put', endpoint, data);
  }

  async patch(endpoint: string, data: any) {
    return this.request('patch', endpoint, data);
  }

  async delete(endpoint: string) {
    return this.request('delete', endpoint);
  }
}

export {}; 