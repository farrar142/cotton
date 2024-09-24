import API from '#/api';
import { User } from '#/api/users/types';
import { NextPageContext } from 'next';
import nookies from 'nookies';
import { AuthMiddleWare, ExtendedParams, GetInitialPropsFunc } from './types';

const getUser = () => {
  return new Promise<User | undefined>((res, rej) =>
    API.Users.me()
      .then(({ data }) => res(data))
      .catch(() => res(undefined))
  );
};

const getInitialPropsWrapper = <P extends {}>(
  func: GetInitialPropsFunc<P>,
  middleware: { pre?: AuthMiddleWare<P>[]; post?: AuthMiddleWare<P>[] } = {
    pre: [],
    post: [],
  }
) => {
  return async (
    context: NextPageContext
  ): Promise<Awaited<P> & ExtendedParams> => {
    const client = API.client.instance;
    client.setContext(context);
    const { access, refresh } = nookies.get(context);
    const user = access || refresh ? await getUser() : undefined;
    const tokens =
      client.tempTokens || access ? { access, refresh } : undefined;
    const { pre = [], post = [] } = middleware;
    const preMiddlewarerChecks = pre.map((fc) => fc({ user, tokens }));
    if (preMiddlewarerChecks.some((p) => Boolean(p))) {
      //@ts-ignore
      return preMiddlewarerChecks.filter((p) => p !== false)[0];
    }
    const result = await func(context, { user, tokens });
    const postMiddlewareCheck = post.map((fc) => fc({ user, tokens }));
    if (postMiddlewareCheck.some((p) => Boolean(p))) {
      //@ts-ignore
      return postMiddlewareCheck.filter((p) => p !== false)[0];
    }
    return { ...result, user, tokens };
  };
};

export const getAdminInitialPropsWrapper = <P extends {}>(
  func: GetInitialPropsFunc<P>
) => {
  return async (
    context: NextPageContext
  ): Promise<Awaited<P> & ExtendedParams> => {
    const result = await getInitialPropsWrapper(func)(context);
    //@ts-ignore
    if (!result.user) return { error: true, statusCode: 401 };
    //@ts-ignore
    if (!result.user.is_staff) return { error: true, statusCode: 403 };
    return result;
  };
};

export default getInitialPropsWrapper;
