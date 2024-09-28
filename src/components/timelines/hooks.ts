import { Post } from '#/api/posts';
import { atomFamily, useRecoilState } from 'recoil';

const postListAtom = atomFamily<Post[], string>({
  key: 'postListAtom',
  default: (type: string) => [],
});
export const usePostList = (type: string) => {
  return useRecoilState(postListAtom(type));
};
