import { useCallback, useContext } from 'react';

import { ModalContext } from '../contexts';
import { UseModal } from '../contexts/ModalContext';
import { useStore } from './use-store';

export const useCurrentModal = <Payload, Result = unknown>(): UseModal<
  Payload,
  Result
> => {
  return useContext(ModalContext);
};

export const useModal = <Payload, Result = unknown>(
  key: string,
): UseModal<Payload, Result> => {
  const [data, setData] = useStore<{
    key: string;
    visible: boolean;
    payload?: Payload;
    result?: Result;
    uid?: string;
  }>(`modal-${key}`);

  const open = useCallback(
    (payload?: Payload, uid?: string) => {
      setData({
        key,
        visible: true,
        payload,
        result: undefined,
        uid: uid || '',
      });
    },
    [key, setData],
  );

  const close = useCallback(
    (result?: Result) => {
      setData({
        key: data?.key,
        uid: data?.uid,
        result: result,
        visible: false,
      });
    },
    [data?.key, data?.uid, setData],
  );

  return {
    key,
    visible: data?.visible || false,
    payload: data?.payload,
    result: data?.result,
    uid: data?.uid || '',
    open,
    close,
  };
};
