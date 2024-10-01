import useValue from './useValue';

export const usePromiseState = () => {
  const done = useValue(true);
  //@ts-ignore
  const wrapper = <T extends Function>(func: T): T => {
    //@ts-ignore
    return async (...args: any[]) => {
      done.set(false);
      return new Promise((resolve, reject) => {
        return func(...args)
          .then(resolve)
          .catch(reject)
          .finally((r: any) => {
            done.set(true);
            return r;
          });
      });
    };
  };
  return { done, wrapper };
};
