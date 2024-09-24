import { User } from '#/api/users/types';
import { useEffect } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

const userAtom = atom<User>({ key: 'userAtom', default: undefined });

const useUser = (user?: User) => {
  const [_user, setUser] = useRecoilState(userAtom);
  useEffect(() => {
    if (!user) return;
    setUser(user);
  }, [user]);
  return [_user, setUser] as const;
};

export default useUser;
