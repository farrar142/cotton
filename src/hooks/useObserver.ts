import { useRef } from 'react';

export const useObserver = () => {
  const callback = useRef(() => {});
  const observer = useRef(
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback.current();
          }
        });
      },
      { threshold: 1 }
    )
  );

  const observe = (element: HTMLElement) => {
    observer.current.observe(element);
  };
  const unobserve = (element: HTMLElement) => {
    observer.current.unobserve(element);
  };
  const registerCallback = (cb: () => void) => {
    callback.current = cb;
  };
  return { observe, unobserve, registerCallback };
};
