import {
  requestBody,
  HttpErrors
} from '@loopback/rest';
import { User, LoginRq, AccessToken, RegisterRq } from '../models';
import { accountService } from '../services/account.service';
import { api, post } from '../core';

@api()
export class AccountController {
  @post({
    path: '/register',
    description: 'To register a new user',
    returnType: User
  })
  async register(
    @requestBody({ required: true }) reg: RegisterRq
  ): Promise<User> {
    const userRq = new User({
      username: reg.email,
      password: reg.password
    });
    if (!userRq.validate().isValid) {
      throw new HttpErrors[422](userRq.validate().message);
    }
    const prevUser = await User.findOne<User>({
      where: {
        username: reg.email
      }
    });
    if (prevUser) {
      throw new HttpErrors[409]('Email already registered')
    }
    const user = await await accountService.register(reg.email, reg.password, reg.name);
    return user.toUiModel();
  }

  @post({
    path: '/login',
    description: 'To login an existing user',
    returnType: AccessToken
  })
  async login(
    @requestBody({ required: true }) login: LoginRq
  ): Promise<AccessToken> {
    const accessToken = await accountService.login(login.username, login.password);
    if (!accessToken.token) {
      throw new HttpErrors.Unauthorized('username password did not match');
    }
    return accessToken;
  }
}
