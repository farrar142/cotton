import API from '#/api';
import { User } from '#/api/users/types';
import CommonLayout from '#/components/layouts/CommonLayout';
import { WebsocketEventListener } from '#/components/WebsocketEventListener';
import { useMentionColor } from '#/hooks/useMentionColor';
import useUser, { useTokenWatcher } from '#/hooks/useUser';
import customTheme, { useDarkMode } from '#/styles';
import '#/styles/globals.css';
import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';
import type { AppProps } from 'next/app';
import Error from 'next/error';
import Head from 'next/head';
import nookies from 'nookies';
import { SnackbarProvider } from 'notistack';
import React, { useEffect, useMemo } from 'react';
import { RecoilEnv, RecoilRoot } from 'recoil';
import NotAuthenticated from './401';
import { CustomHead } from '#/components/CustomHead';

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

type CustomAppProps<
  P =
    | {
        user?: User;
        tokens?: { access: string; refresh: string };
        error?: false;
      }
    | { error: true; statusCode: number; tokens?: undefined }
> = Omit<AppProps<P>, 'Component'> & {
  Component: ExtendedNextPage;
};

export default function RecoilWrapper(props: CustomAppProps) {
  return (
    <RecoilRoot>
      <ProviderWrapper {...props} />
    </RecoilRoot>
  );
}

function ProviderWrapper(props: CustomAppProps) {
  const [isDark] = useDarkMode();
  const palette = customTheme.palette;
  const theme = createTheme({
    ...customTheme,
    breakpoints: customTheme.breakpoints,
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: palette.primary,
      info: palette.info,
    },
  });
  return (
    <AppCacheProvider>
      <SnackbarProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App {...props} />
        </ThemeProvider>
      </SnackbarProvider>
    </AppCacheProvider>
  );
}

const ExternalTokenHandler: React.FC<CustomAppProps['pageProps']> = (
  pageProps
) => {
  useTokenWatcher();
  useEffect(() => {
    if (pageProps.error) return;
    if (pageProps.tokens === undefined) return;
    nookies.set(undefined, 'access', pageProps.tokens.access, { path: '/' });
    nookies.set(undefined, 'refresh', pageProps.tokens.refresh, { path: '/' });
  }, [pageProps.tokens]);
  return <></>;
};
const UserHandler: React.FC<CustomAppProps['pageProps']> = (pageProps) => {
  //@ts-ignore
  const [user, setUser] = useUser(pageProps?.user);
  useEffect(() => {
    if (user) return;
    const { access, refresh } = API.client.instance.getTokens();
    if (!(access || refresh)) return;
    API.Users.me()
      .then(({ data }) => {
        setUser(data);
      })
      .catch(() => {});
  }, []);
  return <></>;
};

function App({ Component, pageProps }: CustomAppProps) {
  useMentionColor();
  // useEffect(() => {
  //   const el = document.getElementById('__next-build-watcher');
  //   el?.nextSibling?.remove();
  // }, []);
  // const Meta = useMemo(() => {
  //   if (pageProps.error) return <title>-</title>;
  //   if (Component.getMeta) return Component.getMeta(pageProps);
  //   else return <title>Cotton</title>;
  // }, [Component, pageProps]);
  const isError = useMemo(() => {
    if (pageProps.error) {
      if (pageProps.statusCode === 401) return <NotAuthenticated />;
      return <Error statusCode={pageProps.statusCode} />;
    }
  }, [pageProps]);
  const Layout = useMemo(() => {
    return Component.getLayout ? Component.getLayout : CommonLayout;
  }, [Component.getLayout]);
  const [user] = useUser();

  return (
    <React.Fragment>
      {user ? <WebsocketEventListener user={user} /> : <></>}
      <ExternalTokenHandler {...pageProps} />
      <UserHandler {...pageProps} />
      <CustomHead
        meta={
          Component.getMeta
            ? !pageProps.error
              ? Component.getMeta(pageProps)
              : { title: 'Error' }
            : undefined
        }
      />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
        }}
      >
        {/* @ts-ignore */}
        <Layout props={pageProps}>
          {Boolean(isError) && isError}
          {/* @ts-ignore */}
          {!Boolean(isError) && <Component {...pageProps} />}
          {/* @ts-ignore */}
        </Layout>
      </Box>
    </React.Fragment>
  );
}
