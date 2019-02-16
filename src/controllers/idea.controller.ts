import { User, SuccessRs, Idea, CreateModifyIdeaRq } from '../models';
import { AuthenticationBindings } from '@loopback/authentication';
import { auth, api, get, post, del, put } from '../core';
import { inject } from '@loopback/context';
import { param, HttpErrors, requestBody } from '@loopback/rest';
import * as validateUUID from 'uuid-validate';
@api({
  basePath: '/ideas'
})
export class IdeaController {
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER) private user: User,
  ) { }

  @get({
    path: '/',
    description: 'To get all ideas of currently logged in user',
    returnType: Idea,
    isArray: true
  })
  @auth()
  async getAllAgainstCurrentUser(): Promise<Idea[]> {
    const ideas = await Idea.find<Idea>({
      where: {
        userId: this.user.id
      }
    });
    return ideas.map(i => i.toUiModel());
  }

  @get({
    path: '/{id}',
    description: 'To get one particular idea',
    returnType: Idea,
  })
  @auth()
  async getOneAgainstCurrentUser(
    @param.path.string('id') id: string,
  ): Promise<Idea> {
    if (!validateUUID(id, 4)) {
      throw new HttpErrors.NotFound('Idea not found');
    }
    const idea = await Idea.findOne<Idea>({
      where: {
        id
      }
    });
    if (!idea) {
      throw new HttpErrors.NotFound('Idea not found');
    }
    return idea.toUiModel();
  }

  @post({
    path: '/',
    description: 'To create an idea of currently logged in user',
    returnType: Idea,
  })
  @auth()
  async createIdea(
    @requestBody({ required: true }) ideaReq: CreateModifyIdeaRq
  ): Promise<Idea> {
    const idea = new Idea(ideaReq);
    idea.userId = this.user.id;
    if (!idea.validate()) {
      throw new HttpErrors[422](idea.validate().message);
    }
    return idea.save().then(i => i.toUiModel());
  }

  @put({
    path: '/{id}',
    description: 'To modify an idea of currently logged in user',
    returnType: Idea,
  })
  @auth()
  async modifyIdea(
    @param.path.string('id') id: string,
    @requestBody({ required: true }) ideaReq: CreateModifyIdeaRq
  ): Promise<Idea> {
    if (!validateUUID(id, 4)) {
      throw new HttpErrors.NotFound('Idea not found');
    }
    const idea = await Idea.findOne<Idea>({
      where: { id, userId: this.user.id }
    });
    if (!idea) {
      throw new HttpErrors.NotFound('Idea not found');
    }

    idea.assign(ideaReq);
    if (!idea.validate()) {
      throw new HttpErrors[422](idea.validate().message);
    }
    return idea.save().then(i => i.toUiModel());
  }

  @del({
    path: '/{id}',
    description: 'To delete an idea of currently logged in user',
    returnType: SuccessRs,
  })
  @auth()
  async deleteIdea(
    @param.path.string('id') id: string,
    @requestBody({ required: true }) ideaReq: CreateModifyIdeaRq
  ): Promise<SuccessRs> {
    if (!validateUUID(id, 4)) {
      throw new HttpErrors.NotFound('Idea not found');
    }
    const idea = await Idea.findOne<Idea>({
      where: { id, userId: this.user.id }
    });
    if (!idea) {
      throw new HttpErrors.NotFound('Idea not found');
    }
    await idea.delete();

    return { success: true }
  }

}
