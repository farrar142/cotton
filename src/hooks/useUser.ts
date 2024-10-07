import API from '#/api';
import { User } from '#/api/users/types';
import { useEffect, useMemo, useRef } from 'react';
import {
  atom,
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
} from 'recoil';
import { useRouter } from './useCRouter';

const tokenAtom = atom<{ access: string; refresh: string }>({
  key: 'tokenAtom',
  default: { access: '', refresh: '' },
});

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
export const useAuthToken = () => {
  return useRecoilState(tokenAtom);
};
export const useTokenWatcher = () => {
  const [user, setUser] = useRecoilState(userAtom(undefined));
  const [token, setToken] = useAuthToken();
  // const userId = useRef<undefined | number>(undefined);
  const userId = useMemo(() => user?.id, [user?.id]);
  useEffect(() => {
    if (!user) return;
    console.log('hook called', user);
    const interval = setInterval(() => {
      const { access, refresh } = API.client.instance.getTokens();
      setToken({ access, refresh });
      if (!access) {
        setUser(null);
        setToken({ access: '', refresh: '' });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    return () => {
      console.log('un mounted');
    };
  }, []);
};

//클라이언트사이드에서만 이용되어야됨. 중복요청방지
const fetchingMap = new Map<number, boolean>();

export const useFetchedProfile = (
  profileId: number | string,
  prefetch: boolean = false
) => {
  profileId = parseInt(`${profileId}`);
  const [profile, setProfile] = useRecoilState(
    //@ts-ignore
    userSelector(parseInt(profileId))
  );
  const fetchUser = () => {
    if (profile) return;
    if (fetchingMap.get(profileId) === true) return;
    fetchingMap.set(profileId, true);
    API.Users.user(profileId)
      .then((r) => r.data)
      .then(setProfile);
  };
  useEffect(() => {
    if (!prefetch) return;
    fetchUser();
  }, [profileId, profile, prefetch]);
  return [profile, fetchUser] as const;
};

export const useUserProfile = (profile: User) => {
  const [me, setMe] = useRecoilState(userAtom(undefined));
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

  const isMe = profile.id === me?.id;
  return [
    returnUser,
    me,
    { isMyProfile: isMe, setProfile: setUser, setMyProfile: setMe },
  ] as const;
};
//로그인한 사람의 정보를 사용 할때 써야됨
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
  return [_user || user, setUser, signout] as const;
};

export default useUser;
