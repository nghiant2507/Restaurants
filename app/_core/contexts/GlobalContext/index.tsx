import { createContext, ReactNode, useCallback, useState } from 'react';

export interface IContextStore {
  [key: string]: any; //eslint-disable-line
}
export interface IContextEntity {
  [key: string]: any; //eslint-disable-line
}

type GlobalContextType = {
  store: IContextStore;
  updateStore: <T>(key: string, value: T) => void;
};

const initialValues: GlobalContextType = {
  store: {} as IContextStore,
  updateStore: () => {},
};

export const GlobalContext = createContext<GlobalContextType>(initialValues);

type IProps = {
  children: ReactNode;
  store?: IContextStore;
};

export function GlobalContextProvider(props: IProps): JSX.Element | null {
  const { children, store: initialStore } = props;

  const [store, setStore] = useState({
    ...initialStore,
  });

  const updateStore = useCallback((key: string, value: any) => { //eslint-disable-line
    setStore((prevState) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  }, []);

  const value: GlobalContextType = {
    store,
    updateStore,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
