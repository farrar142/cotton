import { User } from '#/api/users/types';
import { NextPageContext } from 'next';

export type ExtendedParams = {
  user?: User;
  tokens?: { access: string; refresh: string };
};
export type ErrorParams = {
  error: true;
  statusCode: number;
};

export type GetInitialPropsFunc<P extends { error?: false }> = (
  context: NextPageContext,
  params: ExtendedParams
) => Promise<P> | P;

export type AuthMiddleWare<P extends {}> = (
  args: ExtendedParams,
  obj?: P
) => false | { error: true; statusCode: number };
