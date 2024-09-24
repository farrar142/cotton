import {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

const isFunc = <T>(setter: SetStateAction<T>): setter is (value: T) => T => {
  return typeof setter === 'function';
};

export const useRecordedValue = <T>(defaultValue: T[]) => {
  const value = useValue<T[]>(defaultValue);
  const index = useValue<number>(value.get.length - 1);

  const get = useMemo(
    () => value.get.slice(0, index.get),
    [value.get, index.get]
  );

  const set = (dispatcher: SetStateAction<T[]>) => {
    value.set((p) => {
      const mutated = isFunc(dispatcher) ? dispatcher(p) : dispatcher;
      index.set(mutated.length);
      return mutated;
    });
  };
  const undoable = useMemo(() => index.get !== 0, [index.get]);
  const redoable = useMemo(
    () => index.get < value.get.length,
    [index.get, value.get]
  );

  const undo = useCallback(() => {
    if (!undoable) return;
    index.set((v) => v - 1);
  }, [undoable]);

  const redo = useCallback(() => {
    if (!redoable) return;
    index.set((v) => v + 1);
  }, [redoable]);

  const reset = () => {
    index.set(0);
    value.set([]);
  };

  return {
    get,
    set,
    undo,
    redo,
    undoable,
    redoable,
    reset,
  };
};

const useValue = <T>(defaultValue: T) => {
  const [get, set] = useState<T>(defaultValue);

  const onTextChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    if (typeof defaultValue !== 'string') return;
    //@ts-ignore
    set(value);
  };

  const onNumberChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    console.log(value);
    if (typeof defaultValue !== 'number') return;
    //@ts-ignore
    set(Number(value));
  };

  return { get, set, onTextChange, onNumberChange };
};

export const useRefValue = <T>(defaultValue: T) => {
  const ref = useRef(defaultValue);
  const set: Dispatch<SetStateAction<T>> = (setter) => {
    const value = isFunc(setter) ? setter(ref.current) : setter;
    ref.current = value;
  };
  const onTextChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    if (typeof defaultValue !== 'string') return;
    //@ts-ignore
    set(value);
  };
  const onNumberChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    console.log(value);
    if (typeof defaultValue !== 'number') return;
    //@ts-ignore
    set(Number(value));
  };

  return { get: () => ref.current, set, onTextChange, onNumberChange };
};

export type UseRecordedValue<T> = ReturnType<typeof useRecordedValue<T>>;
export type UseValue<T> = ReturnType<typeof useValue<T>>;
export type UseRefValue<T> = ReturnType<typeof useRefValue<T>>;
export default useValue;
