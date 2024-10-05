import API from '#/api';
import { Post } from '#/api/posts';
import { useEffect } from 'react';
import {
  atomFamily,
  selectorFamily,
  DefaultValue,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';

const postItemAtom = atomFamily<Post | null, number | undefined>({
  key: 'postItemAtom',
  default: (id) => null,
});

const relatedPostItemSelector = selectorFamily<Post | null, number | undefined>(
  {
    key: 'postItemSelector',
    get:
      (key) =>
      ({ get }) => {
        if (!key) return null;
        const value = get(postItemAtom(key));
        return value;
      },
    set:
      (key) =>
      ({ set }, newValue) => {
        if (!newValue) return;
        if (newValue instanceof DefaultValue) return;
        set(postItemAtom(key), newValue);
      },
  }
);

//중복패치 방지 clientside에서만 사용되어야됨
const fetchedPost = new Map<number, boolean>();

export const usePostData = (id: number | undefined) => {
  const [getter, setter] = useRecoilState(relatedPostItemSelector(id));

  useEffect(() => {
    if (!id) return;
    if (getter) return;
    if (fetchedPost.get(id)) return;
    fetchedPost.set(id, true);
    API.Posts.post
      .getItem(id)
      .then((r) => r.data)
      .then(setter);
  }, [id, getter]);
  return [getter, setter] as const;
};
export const useSetPostData = (id: number) =>
  useSetRecoilState(relatedPostItemSelector(id));

const currentPostItemSelector = selectorFamily<Post | null, number>({
  key: 'currentPostItemSelector',
  get:
    (key) =>
    ({ get }) => {
      return get(postItemAtom(key));
    },
  set:
    (key) =>
    ({ set }, newValue) => {
      if (newValue instanceof DefaultValue) return;
      set(postItemAtom(key), newValue);
    },
});

export const useCurrentPostData = (post: Post) => {
  const [currentPost, setCurrentPost] = useRecoilState(
    currentPostItemSelector(post.id)
  );
  useEffect(() => {
    if (currentPost) return;
    setCurrentPost(post);
  }, [post]);
  return [currentPost || post, setCurrentPost] as const;
};
