import { atom, useRecoilState } from 'recoil';

const loginWindowAtom = atom({ key: 'loginWindowAtom', default: () => {} });

export const useLoginWindow = () => useRecoilState(loginWindowAtom);
