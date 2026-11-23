import type { APIRequestContext } from '@playwright/test';

export class AuthApiClient {
  constructor(private readonly request: APIRequestContext) {}

  signup(payload: { name: string; email: string; password: string }) {
    return this.request.post('/api/auth/signup', { data: payload });
  }

  login(payload: { email: string; password: string }) {
    return this.request.post('/api/auth/login', { data: payload });
  }

  logout() { return this.request.post('/api/auth/logout'); }
}
