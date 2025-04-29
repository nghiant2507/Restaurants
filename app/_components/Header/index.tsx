'use client';
import { MenuIcon } from 'lucide-react';
import type * as React from 'react';

import { Button } from '~/core/components/ui/button';
import { SidebarTrigger, useSidebar } from '~/core/components/ui/sidebar';

export const Header = () => {
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <header className={'sticky h-14 top-0 z-50 overflow-hidden p-2 shadow-sm'}>
      <div
        className={
          'size-full flex justify-between items-center gap-8 mx-auto px-4 '
        }
      >
        <div className={' flex items-center gap-8'}>
          <SidebarTrigger className={'hidden sm:block'} />

          {isMobile && (
            <Button size={'icon'} onClick={() => toggleSidebar()}>
              <MenuIcon />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
