import type { APIRequestContext } from '@playwright/test';

export class AdminApiClient {
  constructor(private readonly request: APIRequestContext) {}

  stats() { return this.request.get('/api/admin/dashboard/stats'); }
  claims(params?: { status?: string; userId?: string }) {
    return this.request.get('/api/admin/claims', { params });
  }
  updateStatus(claimId: string, newStatus: string) {
    return this.request.patch(`/api/admin/claims/${claimId}/status`, { data: { newStatus } });
  }
}
