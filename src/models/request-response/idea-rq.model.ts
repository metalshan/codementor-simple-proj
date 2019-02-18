import { model, property } from '../../core';

@model()
export class CreateModifyIdeaRq {
  @property({ required: true }) content: string;
  @property({ required: true }) ease: number;
  @property({ required: true }) confidence: number;
  @property({ required: true }) impact: number;
}
