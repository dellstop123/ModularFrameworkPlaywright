// Utility to build post data for tests
export function buildPostData(overrides: Partial<{ id: number; title: string; body: string; userId: number }> = {}) {
  return {
    title: 'Default Title',
    body: 'Default Body',
    userId: 1,
    ...overrides,
  };
} 