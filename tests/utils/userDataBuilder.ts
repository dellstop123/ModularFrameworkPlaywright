// Utility to build user data for tests with randomization support
import { faker } from '@faker-js/faker';

// Named user data templates for common scenarios, including negative/edge cases
const userTemplates = {
  admin: {
    name: 'Admin User',
    username: 'adminuser',
    email: 'admin@example.com',
    address: buildAddress({ city: 'Admin City' }),
    phone: '999-999-9999',
    website: 'adminsite.com',
    company: buildCompany({ name: 'AdminCorp' }),
    role: 'admin',
    state: 'active' as const,
  },
  guest: {
    name: 'Guest User',
    username: 'guestuser',
    email: 'guest@example.com',
    address: buildAddress({ city: 'Guestville' }),
    phone: '000-000-0000',
    website: 'guestsite.com',
    company: buildCompany({ name: 'GuestCorp' }),
    role: 'guest',
    state: 'active' as const,
  },
  missingEmail: {
    name: 'No Email User',
    username: 'noemailuser',
    // email intentionally omitted
    address: buildAddress({ city: 'NoEmail City' }),
    phone: '111-111-1111',
    website: 'noemail.com',
    company: buildCompany({ name: 'NoEmailCorp' }),
    role: 'tester',
    state: 'active' as const,
  },
  invalidEmail: {
    name: 'Invalid Email User',
    username: 'invalidemailuser',
    email: 'not-an-email',
    address: buildAddress({ city: 'InvalidEmail City' }),
    phone: '222-222-2222',
    website: 'invalidemail.com',
    company: buildCompany({ name: 'InvalidEmailCorp' }),
    role: 'tester',
    state: 'active' as const,
  },
  longUsername: {
    name: 'Long Username User',
    username: 'a'.repeat(300),
    email: 'longusername@example.com',
    address: buildAddress({ city: 'LongUsername City' }),
    phone: '333-333-3333',
    website: 'longusername.com',
    company: buildCompany({ name: 'LongUsernameCorp' }),
    role: 'tester',
    state: 'active' as const,
  },
  deactivated: {
    name: 'Deactivated User',
    username: 'deactivateduser',
    email: 'deactivated@example.com',
    address: buildAddress({ city: 'Deactivated City' }),
    phone: '444-444-4444',
    website: 'deactivated.com',
    company: buildCompany({ name: 'DeactivatedCorp' }),
    role: 'user',
    state: 'deactivated' as const,
  },
  random: () => buildUserData({}, true),
};

export function getUserTemplate(template: keyof typeof userTemplates): UserData {
  const tpl = userTemplates[template];
  return typeof tpl === 'function' ? tpl() : { ...tpl };
}

// Scenario-based user data builder
export function buildUserForScenario(
  scenario:
    | 'admin'
    | 'guest'
    | 'random'
    | 'custom'
    | 'missingEmail'
    | 'invalidEmail'
    | 'longUsername'
    | 'deactivated',
  custom?: Partial<UserData>
): UserData {
  if (scenario === 'custom' && custom) {
    return buildUserData(custom);
  }
  return getUserTemplate(scenario as keyof typeof userTemplates);
}

export function buildUserData(overrides: Partial<UserData> = {}, useRandom = false): UserData {
  return {
    name: useRandom ? faker.person.fullName() : 'Default Name',
    username: useRandom ? faker.internet.userName() : 'defaultuser',
    email: useRandom ? faker.internet.email() : 'default@example.com',
    address: buildAddress({}, useRandom),
    phone: useRandom ? faker.phone.number() : '123-456-7890',
    website: useRandom ? faker.internet.domainName() : 'example.com',
    company: buildCompany({}, useRandom),
    state: 'active',
    ...overrides,
  };
}

export function buildAddress(overrides: Partial<Address> = {}, useRandom = false): Address {
  return {
    street: useRandom ? faker.location.streetAddress() : '123 Main St',
    suite: useRandom ? `Apt. ${faker.number.int({ min: 1, max: 999 })}` : 'Apt. 1',
    city: useRandom ? faker.location.city() : 'Metropolis',
    zipcode: useRandom ? faker.location.zipCode() : '12345',
    geo: useRandom
      ? { lat: faker.location.latitude().toString(), lng: faker.location.longitude().toString() }
      : { lat: '0.0000', lng: '0.0000' },
    ...overrides,
  };
}

export function buildCompany(overrides: Partial<Company> = {}, useRandom = false): Company {
  return {
    name: useRandom ? faker.company.name() : 'Default Company',
    catchPhrase: useRandom ? faker.company.catchPhrase() : 'Innovate and Excel',
    bs: useRandom ? faker.company.buzzPhrase() : 'synergize scalable solutions',
    ...overrides,
  };
}

// Types for clarity
export type UserData = {
  id?: number;
  name: string;
  username: string;
  email?: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
  role?: string;
  state?: 'active' | 'deactivated';
};

export type Address = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: { lat: string; lng: string };
};

export type Company = {
  name: string;
  catchPhrase: string;
  bs: string;
}; 