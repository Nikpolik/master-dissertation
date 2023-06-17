import { useReducer } from 'react';

interface Action<T> {
  key: keyof T;
  value: any;
}

type CreateHandler<T> = (key: keyof T) => (event: any, extractor?: (e: any) => any) => void;

const defaultExtractor = (event: any) => event.currentTarget.value;

function useForm<T extends Record<string, any>>(init: T): [T, CreateHandler<T>] {
  const [state, dispatch] = useReducer((state: T, action: Action<T>) => {
    return {
      ...state,
      [action.key]: action.value,
    };
  }, init);

  function createHandler(key: keyof T) {
    return function (event: any, extractor: (e: any) => any = defaultExtractor) {
      let value = extractor(event);

      dispatch({ key: key, value });
    };
  }

  return [state, createHandler];
}

export { useForm };
