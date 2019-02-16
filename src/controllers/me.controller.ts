import { User, SuccessRs } from '../models';
import { AuthenticationBindings } from '@loopback/authentication';
import { auth, api, get, post } from '../core';
import { inject } from '@loopback/context';
import { accountService } from '../services';

@api()
export class MeController {
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER) private user: User,
  ) { }

  @get({
    path: '/',
    description: 'To get the current user',
    returnType: User
  })
  @auth()
  async me(): Promise<User> {
    return this.user.toUiModel();
  }

  @post({
    path: '/logout',
    description: 'Logout the current session',
    returnType: SuccessRs
  })
  @auth()
  async logout(): Promise<SuccessRs> {
    return accountService.logout(this.user);
  }
}
