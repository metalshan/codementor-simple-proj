import {
  Entity,
  Column,
  property,
} from '../core';
import { BaseEntity } from './';
import { User } from './user.model';
import { OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'idea' })
export class Idea extends BaseEntity<Idea> {
  constructor(data?: Partial<Idea>) {
    super(data);
  }

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ nullable: false })
  title: string;

  @Column()
  impact: number;

  @Column()
  ease: number;

  @Column()
  confidence: number;

  @property()
  average: number;

  toUiModel(): Idea {
    this.average = Math.round((this.impact + this.ease + this.confidence) / 3);
    return this;
  }

  assign(anotherObject: Partial<Idea>) {
    if (typeof anotherObject.title === 'string') {
      this.title = anotherObject.title;
    }
    if (typeof anotherObject.ease === 'number') {
      this.ease = anotherObject.ease;
    }
    if (typeof anotherObject.confidence === 'number') {
      this.confidence = anotherObject.confidence;
    }
    if (typeof anotherObject.impact === 'number') {
      this.impact = anotherObject.impact;
    }
  }

  @property()
  @OneToOne(_type => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
