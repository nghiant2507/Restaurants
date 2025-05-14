'use client';
import { LucideIcon, MenuIcon } from 'lucide-react';
import type * as React from 'react';

import { Button } from '~/core/components/ui/button';
import { Label } from '~/core/components/ui/label';
import { Separator } from '~/core/components/ui/separator';
import { SidebarTrigger, useSidebar } from '~/core/components/ui/sidebar';

interface PageHeaderProps {
  title: string;
  icon?: LucideIcon;
  extra?: React.ReactNode;
}

export const PageHeader = (props: PageHeaderProps) => {
  const { title, extra } = props;

  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <header className={'sticky h-14 top-0 z-50 overflow-hidden p-2 shadow-sm'}>
      <div
        className={'size-full flex justify-between items-center gap-8 mx-auto'}
      >
        <div className={'flex items-center h-full'}>
          {isMobile ? (
            <Button size={'icon'} onClick={() => toggleSidebar()}>
              <MenuIcon />
            </Button>
          ) : (
            <SidebarTrigger />
          )}
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Label>
            {props.icon && <props.icon size={18} />}
            {title}
          </Label>
        </div>
        {extra && <div>{extra}</div>}
      </div>
    </header>
  );
};
