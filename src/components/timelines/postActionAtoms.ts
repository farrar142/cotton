import { atomFamily, useRecoilState } from 'recoil';

export type PickBoolean<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];

const boolOverridedAtom = atomFamily({
  key: 'boolOverridedAtom',
  default: (field: string) => new Map<number, boolean>(),
});

export const useOverrideAtom = (field: string) => {
  return useRecoilState(boolOverridedAtom(field));
};
