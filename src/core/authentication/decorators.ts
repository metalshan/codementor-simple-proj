import { authenticate } from '@loopback/authentication';

export function auth(): MethodDecorator {
  const customAuthentication = authenticate('CustomStrategy');
  return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<{}>) => {
    customAuthentication(target, propertyKey, descriptor);
  }
}
