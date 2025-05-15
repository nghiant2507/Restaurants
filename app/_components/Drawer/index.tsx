import { LucideIcon, X } from 'lucide-react';
import { ReactNode, useCallback } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '~/core/components/ui/drawer';
import { ModalContext } from '~/core/contexts';
import { useModal } from '~/core/hooks/use-modal';

interface DrawerProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  footer?: ReactNode;
  modalKey: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
}
export const DrawerComponent = <Payload, Result>(props: DrawerProps) => {
  const { title, children, footer, modalKey, direction = 'right' } = props;

  const modal = useModal<Payload, Result>(modalKey);
  const { visible, close } = modal;

  const onCancel = useCallback(() => {
    close();
  }, [close]);
  return (
    <ModalContext.Provider value={modal}>
      <Drawer
        direction={direction}
        open={visible}
        onOpenChange={(open) => !open && onCancel()}
      >
        <DrawerContent className={' md:w-md'}>
          <div className="w-full">
            <DrawerHeader
              className={
                'justify-between items-center border-b border-sidebar-border pb-3'
              }
            >
              <div className={'flex gap-2 items-center'}>
                {props?.icon && <props.icon size={20} />}
                <DrawerTitle>{title}</DrawerTitle>
              </div>
              <X
                className={'cursor-pointer'}
                onClick={() => close()}
                size={16}
              />
            </DrawerHeader>
            {children}
          </div>
        </DrawerContent>
        {footer ? <DrawerFooter>{footer}</DrawerFooter> : null}
      </Drawer>
    </ModalContext.Provider>
  );
};
