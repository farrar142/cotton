import { useEffect, useRef } from 'react';

export const useObserver = () => {
  const onIntersection = useRef(() => {});
  const onNotIntersection = useRef(() => {});
  const createObserver = () => {
    if (typeof window === 'undefined') return;
    return new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersection.current();
          } else {
            onNotIntersection.current();
          }
        });
      },
      { threshold: 1, rootMargin: '500px' }
    );
  };
  const observer = useRef<IntersectionObserver | undefined>(createObserver());

  const observe = (element: HTMLElement) => {
    observer.current?.observe(element);
  };
  const unobserve = (element: HTMLElement) => {
    observer.current?.unobserve(element);
  };
  const registerCallback = (cb: () => void) => {
    onIntersection.current = cb;
  };
  const registerNotIntersectionCallback = (cb: () => void) => {
    onNotIntersection.current = cb;
  };

  useEffect(() => {
    return () => observer.current?.disconnect();
  }, []);
  return {
    observe,
    unobserve,
    onIntersection: registerCallback,
    onNotIntersection: registerNotIntersectionCallback,
  };
};
