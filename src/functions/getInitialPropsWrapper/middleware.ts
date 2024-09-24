import { AuthMiddleWare } from './types';

export const LoginRequired: AuthMiddleWare<{}> = ({ user, tokens }) => {
  if (!Boolean(user)) {
    return { error: true, statusCode: 401 };
  }
  return false;
};

export const AdminRequired: AuthMiddleWare<{}> = ({ user }) => {
  if (!Boolean(user)) return { error: true, statusCode: 401 };
  if (!user?.is_staff) return { error: true, statusCode: 403 };
  return false;
};
