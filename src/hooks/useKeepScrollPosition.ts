import { useRef, useEffect } from 'react';
import {
  atom,
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily,
  useRecoilState,
} from 'recoil';

const scrollAtom = atomFamily<number, string>({
  key: 'scrollAtom',
  default: (key: string) => 0,
});

const getScrollAtom = atom<{ key: string; value: number }>({
  key: 'getScrollAtom',
  default: { key: '', value: 0 },
});

const getScrollSelector = selector<{ key: string; value: number }>({
  key: 'getScrollSelctor',
  get: ({ get }) => {
    return get(getScrollAtom);
  },
  set: ({ get, set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      set(scrollAtom(newValue.key), newValue.value);
      window.scrollTo({ behavior: 'smooth', top: newValue.value });
    }
    set(getScrollAtom, newValue);
  },
});

// setScroll을 하면 해당키의 scroll값을 바꿈과 동시에 현재화면의 스크롤도 변경함
export const useKeyScrollPosition = () => {
  return useRecoilState(getScrollSelector);
};

export const useKeepScrollPosition = (key: string, enabled: boolean) => {
  const [scroll, setScroll] = useRecoilState(scrollAtom(key));
  const scrollRef = useRef(0);
  const onScrollChange = (e: Event) => {
    scrollRef.current = window.scrollY;
  };
  useEffect(() => {
    if (!enabled) return;
    window.scrollTo({ behavior: 'smooth', top: scroll });
    window.addEventListener('scroll', onScrollChange);
    return () => {
      window.removeEventListener('scroll', onScrollChange);
      setScroll(scrollRef.current);
    };
  }, []);
};
