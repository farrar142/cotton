import API from '#/api';
import getInitialPropsWrapper from '#/functions/getInitialPropsWrapper';
import { useRouter } from '#/hooks/useCRouter';
import useUser from '#/hooks/useUser';
import { useSnackbar } from 'notistack';
// import { useNoti } from '#/hooks/useNoti';
import { useEffect } from 'react';

const AuthorizationPage: ExtendedNextPage<{ code_key: string }> = ({
  code_key,
}) => {
  const noti = useSnackbar();
  const router = useRouter();
  const [user, setUser] = useUser();
  useEffect(() => {
    if (code_key) {
      API.Auth.register_email({ code_key })
        .then(({ data }) => data)
        .then(API.client.instance.setTokens)
        .then(() => API.Users.me())
        .then((r) => r.data)
        .then(setUser)
        .then(() =>
          noti.enqueueSnackbar('인증되었습니다.', { variant: 'success' })
        )
        .then(() => router.push('/'))
        .catch(({ response }) => {
          noti.enqueueSnackbar(response.data.detail.code_key[0], {
            variant: 'error',
          });
          noti.enqueueSnackbar('인증에 실패하였습니다.', { variant: 'error' });
          router.push('/');
        });
    } else {
      noti.enqueueSnackbar('유효하지 않은 요청입니다.', { variant: 'error' });
      router.push('/');
    }
  }, [code_key]);
  return <div>{`${code_key}`}</div>;
};

AuthorizationPage.getInitialProps = getInitialPropsWrapper(
  async ({ query }) => {
    const code_key = `${query.code_key}`;
    return { code_key };
  }
);

export default AuthorizationPage;
