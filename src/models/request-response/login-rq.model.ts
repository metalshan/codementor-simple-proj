import { model, property } from '../../core';

@model()
export class LoginRq {
  @property({ required: true }) username: string;
  @property({ required: true }) password: string;
}
