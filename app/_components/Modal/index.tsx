import { LucideIcon } from 'lucide-react';
import { ReactNode, useCallback } from 'react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/core/components/ui/dialog';
import { ModalContext } from '~/core/contexts';
import { useModal } from '~/core/hooks/use-modal';

interface ModalProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  footer?: ReactNode;
  modalKey: string;
}

export const ModalComponent = <Payload, Result>(props: ModalProps) => {
  const { title, children, footer, modalKey } = props;

  const modal = useModal<Payload, Result>(modalKey);
  const { visible, close } = modal;

  const onCancel = useCallback(() => {
    close();
  }, [close]);

  return (
    <ModalContext.Provider value={modal}>
      <Dialog open={visible} onOpenChange={(open) => !open && onCancel()}>
        <DialogContent>
          <DialogHeader
            className={
              'flex gap-2 items-center border-b border-sidebar-ring pb-3'
            }
          >
            {props?.icon && <props.icon size={20} />}
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {children}
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
};
