import React, { ReactNode } from 'react';
import { NextPage } from 'next';
import { User } from './api/users/types';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BACKEND_URL: string;
      NEXT_PUBLIC_BACKEND_HOST: string;
    }
  }
  type ExtendedNextPage<
    Props = { user?: User },
    InitialProps = Props
  > = NextPage<Props, InitialProps> & {
    getMeta?: (props: InitialProps) => React.ReactNode;
    getLayout?: React.FC<{ children?: ReactNode }>;
  };
}

declare module '@draft-js-plugins/mention' {
  interface MentionData extends User {
    name: string;
  }
}
