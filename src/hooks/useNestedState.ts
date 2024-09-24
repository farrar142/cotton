import { ChangeEventHandler } from 'react';
import useValue, { UseValue } from './useValue';

const isFunc = <T>(
  setter: React.SetStateAction<T>
): setter is (value: T) => T => {
  return typeof setter === 'function';
};

export const useNestedState = <T extends object, K extends keyof T>(
  state: UseValue<T>,
  key: K
): UseValue<T[K]> => {
  const { get, set } = state;
  const getter = get[key];

  const setter: React.Dispatch<React.SetStateAction<T[K]>> = (func) => {
    const value = isFunc(func) ? func(getter) : func;
    set((p) => ({ ...p, [key]: value }));
  };
  const onTextChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    if (typeof getter !== 'string') return;
    //@ts-ignore
    setter(value);
  };

  const onNumberChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    //@ts-ignore
    setter(Number(value));
  };

  return { get: getter, set: setter, onTextChange, onNumberChange };
};

export const useNestedElementState = <T extends object, K extends number>(
  state: UseValue<T[]>,
  key: K
): UseValue<T[][K]> => {
  const { get, set } = state;
  const getter = get[key];

  const setter: React.Dispatch<React.SetStateAction<T[][K]>> = (func) => {
    const value = isFunc(func) ? func(getter) : func;
    set((p) =>
      p.map((d, index) => {
        if (index === key) {
          return value;
        }
        return d;
      })
    );
  };
  const onTextChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    if (typeof getter !== 'string') return;
    //@ts-ignore
    setter(value);
  };
  const onNumberChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    console.log(value);
    //@ts-ignore
    setter(Number(value));
  };

  return { get: getter, set: setter, onTextChange, onNumberChange };
};
