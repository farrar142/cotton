import paths from '#/paths';
import { useRouter } from '#/hooks/useCRouter';
import { useEffect } from 'react';

const NotAuthenticated = () => {
  const router = useRouter();
  useEffect(() => {
    router.push(paths.signin);
  });
  return <div></div>;
};

export default NotAuthenticated;
