import { USER_ID } from '../../../auth/authentication/mock';
import Keystore from '../../../../src/database/model/Keystore';
import User from '../../../../src/database/model/User';
import { Types } from 'mongoose';
import * as authUtils from '../../../../src/auth/authUtils';
import argon2 from 'argon2';
import Role from '../../../../src/database/model/Role';

export const USER_EMAIL = 'random@test.com';
export const USER_PASSWORD = 'abc123';

export const createTokensSpy = jest.spyOn(authUtils, 'createTokens');

export const mockKeystoreCreate = jest.fn(
  async (client: User, primaryKey: string, secondaryKey: string): Promise<Keystore> => {
    return {
      _id: new Types.ObjectId(),
      client: client,
      primaryKey: primaryKey,
      secondaryKey: secondaryKey,
    } as Keystore;
  },
);

export const mockUserFindByEmail = jest.fn(async (email: string): Promise<User | null> => {
  if (email === USER_EMAIL)
    return {
      _id: USER_ID,
      email: USER_EMAIL,
      password: (await argon2.hash(USER_PASSWORD)) as unknown,
      roles: [] as Role[],
    } as User;
  return null;
});

jest.mock('../../../../src/database/repository/KeystoreRepo', () => ({
  get create() {
    return mockKeystoreCreate;
  },
}));

jest.mock('../../../../src/database/repository/UserRepo', () => ({
  get findByEmail() {
    return mockUserFindByEmail;
  },
}));

jest.unmock('../../../../src/auth/authUtils'); // remove any override made anywhere
