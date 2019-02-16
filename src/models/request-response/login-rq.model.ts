import { model, property } from '../../core';

@model()
export class LoginRq {
  @property() username: string;
  @property() password: string;
}
