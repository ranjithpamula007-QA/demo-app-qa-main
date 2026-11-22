export type TestRole = 'ADMIN' | 'CLAIMANT';

export interface TestUser {
  email: string;
  password: string;
  role: TestRole;
}

export const testUsers: Record<TestRole, TestUser> = {
  ADMIN: {
    email: process.env.ADMIN_EMAIL ?? 'admin@demo.com',
    password: process.env.ADMIN_PASSWORD ?? 'Admin123!',
    role: 'ADMIN',
  },
  CLAIMANT: {
    email: process.env.CLAIMANT_EMAIL ?? 'claimant@demo.com',
    password: process.env.CLAIMANT_PASSWORD ?? 'Claimant123!',
    role: 'CLAIMANT',
  },
};
