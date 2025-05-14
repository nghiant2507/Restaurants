'use client';

import { createContext } from 'react';

export interface UseModal<Payload, Result> {
  visible: boolean;
  payload?: Payload;
  result?: Result;
  close: (result?: Result) => void;
  key: string;
  open: (payload?: Payload, uid?: string) => void;
  uid: string;
}

export const ModalContext = createContext<UseModal<any, any>>({ //eslint-disable-line
  payload: null,
  result: null,
  visible: false,
  key: '',
  uid: '',
  close: () => {},
  open: () => {},
});
