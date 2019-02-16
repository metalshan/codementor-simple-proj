import { model, property } from '../../core';

@model()
export class RegisterRq {
  @property({ required: true }) email: string;
  @property({ required: true }) name: string;
  @property({ required: true }) password: string;
}
