import { test, expect, request, APIRequestContext } from '@playwright/test';
import { UserApiClient } from '../clients/userApiClient';
import { buildUserForScenario, UserData } from '../utils/userDataBuilder';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const userScenarios: Array<{
  scenario: Parameters<typeof buildUserForScenario>[0];
  description: string;
  expected: Partial<UserData> & { expectEmail?: boolean; expectLongUsername?: boolean; };
}> = [
  {
    scenario: 'admin',
    description: 'admin user',
    expected: { role: 'admin', state: 'active', expectEmail: true },
  },
  {
    scenario: 'guest',
    description: 'guest user',
    expected: { role: 'guest', state: 'active', expectEmail: true },
  },
  {
    scenario: 'missingEmail',
    description: 'user with missing email',
    expected: { expectEmail: false },
  },
  {
    scenario: 'invalidEmail',
    description: 'user with invalid email',
    expected: { email: 'not-an-email', expectEmail: true },
  },
  {
    scenario: 'longUsername',
    description: 'user with long username',
    expected: { expectLongUsername: true, expectEmail: true },
  },
  {
    scenario: 'deactivated',
    description: 'deactivated user',
    expected: { state: 'deactivated', expectEmail: true },
  },
];

test.describe('JSONPlaceholder Users API', () => {
  let apiContext: APIRequestContext;
  let userApi: UserApiClient;

  test.beforeAll(async () => {
    apiContext = await request.newContext();
    userApi = new UserApiClient(apiContext, BASE_URL);
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test.describe('Parameterized user creation scenarios', () => {
    for (const { scenario, description, expected } of userScenarios) {
      test(`POST /users (${description})`, async () => {
        const user = buildUserForScenario(scenario);
        const response = await apiContext.post(BASE_URL + '/users', { data: user });
        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        if (expected.expectEmail === false) {
          expect(body).not.toHaveProperty('email');
        } else if (expected.email) {
          expect(body).toHaveProperty('email', expected.email);
        } else if (expected.expectEmail) {
          expect(body).toHaveProperty('email');
        }
        if (expected.role) {
          expect(body).toHaveProperty('role', expected.role);
        }
        if (expected.state) {
          expect(body).toHaveProperty('state', expected.state);
        }
        if (expected.expectLongUsername) {
          expect(body.username.length).toBeGreaterThan(255);
        }
        expect(body).toHaveProperty('id');
      });
    }
  }).tag('regression');
}); 