import { User, AccessToken, UserDetails } from '../models';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import uuid = require('uuid');
const BCRYPT_SALT_ROUNDS = 10;
const salt = genSaltSync(BCRYPT_SALT_ROUNDS);

export class AccountService {
  // Register a new user
  async register(email: string, password: string, name: string): Promise<User> {
    const user = new User({
      username: email,
      password: hashSync(password, salt),
    });
    await user.save();
    const details = new UserDetails({ userId: user.id, email, name });
    await details.save();
    user.details = details;
    return user;
  }

  // login to get the access token
  async login(username: string, password: string): Promise<AccessToken> {
    const accessToken = new AccessToken();
    const user = await User.findOne<User>({
      where: {
        username,
      }
    });
    if (user && compareSync(password, user.password)) {
      accessToken.token = uuid.v4();
      accessToken.userId = user.id;
      await accessToken.save();
    }

    return accessToken;
  }

  async logout(user: User): Promise<{ success: boolean }> {
    if (!user.accessToken) {
      throw new Error('No access token found to logout');
    }
    const accessToken = await AccessToken.findOne<AccessToken>({
      where: {
        token: user.accessToken
      }
    });
    if (accessToken) {
      await accessToken.delete();
    }
    return { success: true }
  }
}

export const accountService = new AccountService();
