import { Post } from '#/api/posts';
import { atom, useRecoilState } from 'recoil';

const onPostWriteAtom = atom<{ open: boolean; parent?: Post; quote?: Post }>({
  key: 'onPostWriteAtom',
  default: { open: false },
});

export const usePostWrite = () => useRecoilState(onPostWriteAtom);
