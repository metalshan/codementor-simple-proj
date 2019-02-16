import {
  Entity,
  Column,
  property,
} from '../core';
import { BaseEntity } from './';
import { User } from './user.model';
import { OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'user_details' })
export class UserDetails extends BaseEntity<UserDetails> {
  constructor(data?: Partial<UserDetails>) {
    super(data);
  }

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @property()
  @OneToOne(_type => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
