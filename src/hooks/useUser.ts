import API from '#/api';
import { User } from '#/api/users/types';
import { useEffect } from 'react';
import {
  atom,
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { useRouter } from './useCRouter';

const userAtom = atomFamily<User | null, number | undefined>({
  key: 'userAtom',
  default: (username) => null,
});

const userSelector = selectorFamily<User | null, number>({
  key: 'userAtomSelector',
  get:
    (username) =>
    ({ get }) => {
      const user = get(userAtom(username));
      if (!user || user instanceof DefaultValue) return null;
      return user;
    },
  set:
    (username) =>
    ({ set, get }, newValue) => {
      set(userAtom(username), newValue);
    },
});

export const useUserProfile = (profile: User) => {
  const [me, setme] = useRecoilState(userAtom(undefined));
  const [user, setUser] = useRecoilState(userSelector(profile.id));

  useEffect(() => {
    if (user) return;
    setUser(profile);
  }, [profile]);

  useEffect(() => {
    if (!me || !user) return;
    if (me.id != profile.id) return;
    if (JSON.stringify(me) === JSON.stringify(profile)) return;
    //동기화
    setUser(me);
  }, [me, user]);
  const returnUser = (user?.id === profile.id ? user : profile) || profile;

  return [returnUser, me] as const;
};

const useUser = (user?: User) => {
  const router = useRouter();
  const [_user, setUser] = useRecoilState(userAtom(undefined));
  useEffect(() => {
    if (!user) return;
    setUser(user);
  }, [user]);
  const signout = () => {
    API.client.instance.deleteTokens();
    setUser(null);
    router.reload();
  };
  return [_user, setUser, signout] as const;
};

export default useUser;
