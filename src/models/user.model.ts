import {
  Entity,
  Column,
  property
} from '../core';
import { BaseEntity } from './';
import { OneToOne } from 'typeorm';
import { UserDetails } from './user-details.model';

@Entity('users', { schema: 'public' })
export class User extends BaseEntity<User> {

  constructor(data?: Partial<User>) {
    super(data);
  }

  @Column({
    nullable: false,
  })
  username: string;

  @Column({
    nullable: false,
  })
  password: string;

  accessToken: string;

  @property()
  @OneToOne(type => UserDetails, details => details.user)
  details: UserDetails;

  toUiModel(): User {
    const user = new User(this);
    delete user.password;
    delete user.accessToken;
    return user;
  }
}
