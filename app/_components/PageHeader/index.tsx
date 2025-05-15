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
    <header className={'h-14 overflow-hidden p-2 shadow-sm bg-white'}>
      <div
        className={'size-full flex justify-between items-center gap-8 mx-auto'}
      >
        <div className={'flex items-center gap-2 h-full'}>
          {isMobile ? (
            <Button size={'icon'} onClick={() => toggleSidebar()}>
              <MenuIcon />
            </Button>
          ) : (
            <SidebarTrigger />
          )}
          <Separator orientation="vertical" className="!h-3" />
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
