import type { APIRequestContext } from '@playwright/test';

export class ClaimsApiClient {
  constructor(private readonly request: APIRequestContext) {}

  submit(payload: unknown) { return this.request.post('/api/claims', { data: payload }); }
  list() { return this.request.get('/api/claims'); }
  get(claimId: string) { return this.request.get(`/api/claims/${claimId}`); }
}
