import type { FullConfig } from '@playwright/test';

/**
 * Reserved for environment health checks and storage-state creation.
 * The first smoke tests deliberately log in through the UI so the auth path
 * itself remains covered.
 */
export default async function globalSetup(_config: FullConfig) {
  // Docker Compose services are started outside Playwright.
}
