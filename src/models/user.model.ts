import {
  Entity,
  Column,
  property
} from '../core';
import { BaseEntity } from './';
import { OneToOne, OneToMany } from 'typeorm';
import { UserDetails } from './user-details.model';
import { ValidationModel } from './base.model';
import { Idea } from './idea.model';

function validateEmail(email: string): boolean {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

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

  @property({ itemType: Idea })
  @OneToMany(type => Idea, idea => idea.user)
  ideas: Idea[];

  validate(): ValidationModel {
    const v = super.validate();

    // validate email & password
    if (!validateEmail(this.username)) {
      v.isValid = false;
      v.message = "Invalid email"
    } else
      if (!this.password || this.password.length < 6) {
        v.isValid = false;
        v.message = "Minimum 6 letter password is required"
      }
    return v;
  }

  toUiModel(): User {
    const user = new User(this);
    delete user.password;
    delete user.accessToken;
    return user;
  }
}
