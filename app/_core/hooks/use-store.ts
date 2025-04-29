import { useCallback, useContext } from 'react';

import { GlobalContext } from '~/core/contexts';

export const useStore = <T>(key: string): [T, (value: T) => void] => {
  const { store, updateStore } = useContext(GlobalContext);

  const setStore = useCallback(
    (value: T) => {
      updateStore<T>(key, value);
    },
    [key, updateStore],
  );

  return [store[key] || null, setStore];
};
