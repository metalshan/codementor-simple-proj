import { inject } from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
  StaticAssetsRoute,
} from '@loopback/rest';
import { AuthenticationBindings, AuthenticateFn } from '@loopback/authentication';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
  ) { }

  async handle(context: RequestContext) {
    try {
      const { request, response } = context;
      request.url = removeSlash(request.url); // removing unnecessary slash

      const route = this.findRoute(request);

      // !!IMPORTANT: authenticateRequest fails on static routes!
      if (!(route instanceof StaticAssetsRoute)) {
        await this.authenticateRequest(request); // This is the important line added to the default sequence implementation
      }
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}


function removeSlash(url: string) {
  if (url.length < 2 || url.toLowerCase() === '/explorer' || url.toLowerCase() === '/explorer/') {
    return url;
  }
  let modUrl = (url[url.length - 1] === '/') ? url.substr(0, url.length - 1) : url;
  if (modUrl.includes('?')) {
    const [first, second] = modUrl.split('?');
    modUrl = (first[first.length - 1] === '/') ? first.substr(0, first.length - 1) : first;
    modUrl += `?${second}`;
  }
  return modUrl;
}
