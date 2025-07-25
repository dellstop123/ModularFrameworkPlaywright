import { APIRequestContext } from '@playwright/test';

export class UserApiClient {
  private context: APIRequestContext;
  private baseUrl: string;

  constructor(context: APIRequestContext, baseUrl: string) {
    this.context = context;
    this.baseUrl = baseUrl;
  }

  async getAllUsers() {
    return this.context.get(this.baseUrl + '/users');
  }

  async getUserById(id: number) {
    return this.context.get(`${this.baseUrl}/users/${id}`);
  }
} 