import { useRouter } from '#/hooks/useCRouter';
import React from 'react';
import { useEffect } from 'react';

const IndexPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/home');
  }, []);
  return <></>;
};

export default IndexPage;
