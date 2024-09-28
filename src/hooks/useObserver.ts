import { useRef } from 'react';

export const useObserver = () => {
  const onIntersection = useRef(() => {});
  const onNotIntersection = useRef(() => {});
  const observer = useRef(
    new IntersectionObserver(
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
    )
  );

  const observe = (element: HTMLElement) => {
    observer.current.observe(element);
  };
  const unobserve = (element: HTMLElement) => {
    observer.current.unobserve(element);
  };
  const registerCallback = (cb: () => void) => {
    onIntersection.current = cb;
  };
  const registerNotIntersectionCallback = (cb: () => void) => {
    onNotIntersection.current = cb;
  };
  return {
    observe,
    unobserve,
    onIntersection: registerCallback,
    onNotIntersection: registerNotIntersectionCallback,
  };
};
