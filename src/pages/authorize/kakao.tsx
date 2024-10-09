import API from '#/api';
import getInitialPropsWrapper from '#/functions/getInitialPropsWrapper';
import { useRouter } from '#/hooks/useCRouter';
import useUser from '#/hooks/useUser';
import { useSnackbar } from 'notistack';
// import { useNoti } from '#/hooks/useNoti';
import { useEffect } from 'react';

const AuthorizationPage: ExtendedNextPage<{ code: string }> = ({ code }) => {
  const noti = useSnackbar();
  const router = useRouter();
  const [user, setUser] = useUser();
  useEffect(() => {
    if (!code) return router.push('/');
    const redirect_uri = location.origin + location.pathname;
    console.log(code, redirect_uri);
    API.Auth.kakaosignin({ code, redirect_uri })
      .then((r) => r.data)
      .then(API.client.instance.setTokens)
      .then(() => API.Users.me())
      .then((r) => r.data)
      .then(setUser)
      .catch(() => {
        noti.enqueueSnackbar('Kakao Login Success', {
          variant: 'error',
        });
      })
      .finally(() => router.push('/'));
  }, [code]);
  return <div>{``}</div>;
};

//@ts-ignore
AuthorizationPage.getInitialProps = getInitialPropsWrapper(
  async ({ query }) => {
    const code = `${query.code}`;
    return { code };
  }
);

export default AuthorizationPage;
