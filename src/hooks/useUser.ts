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

const useTokenWatcher = () => {
  const [user, setUser] = useRecoilState(userAtom(undefined));

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const { access, refresh } = API.client.instance.getTokens();
      if (!access) setUser(null);
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);
};

export const useFetchedProfile = (
  profileId: number | string,
  prefetch: boolean = false
) => {
  const [profile, setProfile] = useRecoilState(
    //@ts-ignore
    userSelector(parseInt(profileId))
  );
  const fetchUser = () => {
    if (profile) return;
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
  useTokenWatcher();

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

const useUser = (user?: User) => {
  const router = useRouter();
  const [_user, setUser] = useRecoilState(userAtom(undefined));
  useTokenWatcher();
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
