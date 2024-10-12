import React, { ReactNode } from 'react';
import { NextPage } from 'next';
import { User } from './api/users/types';
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BACKEND_URL: string;
      NEXT_PUBLIC_BACKEND_HOST: string;
      NEXT_PUBLIC_KAKAO_CLIENT_KEY: string;
      SENTRY_URL: string;
      SENTRY_ORG: string;
      SENTRY_PROJECT: string;
      NEXT_PUBLIC_SENTRY_DSN: string;
    }
  }
  type Meta = {
    title: string;
    description?: string;
  };
  type ExtendedNextPage<
    Props = { user?: User },
    InitialProps = Props
  > = NextPage<Props, InitialProps> & {
    getMeta?: (props: InitialProps) => Meta;
    getLayout?: React.FC<{ children?: ReactNode; props: InitialProps }>;
  };
}
