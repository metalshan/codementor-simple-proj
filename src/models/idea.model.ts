import {
  Entity,
  Column,
  property,
} from '../core';
import { BaseEntity, ValidationModel } from './';
import { User } from './user.model';
import { OneToOne, JoinColumn } from 'typeorm';

function inRange(num: number): boolean {
  return num > 0 && num <= 10;
}

@Entity({ name: 'idea' })
export class Idea extends BaseEntity<Idea> {
  constructor(data?: Partial<Idea>) {
    super(data);
  }

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ nullable: false, name: 'title' })
  content: string;

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
    if (typeof anotherObject.content === 'string') {
      this.content = anotherObject.content;
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

  validate(): ValidationModel {
    const v = super.validate();
    if (!inRange(this.ease)) {
      v.isValid = false;
      v.message = "ease must be in between 1 to 10 range";
    } else
      if (!inRange(this.impact)) {
        v.isValid = false;
        v.message = "impact must be in between 1 to 10 range";
      } else
        if (!inRange(this.confidence)) {
          v.isValid = false;
          v.message = "confidence must be in between 1 to 10 range";
        }
    return v;
  }

  @property()
  @OneToOne(_type => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
