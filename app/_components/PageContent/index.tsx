import React from 'react';

import { cn } from '~/core/lib/utils';

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContent = (props: PageContentProps) => {
  const { children, className } = props;
  return (
    <div
      className={cn(
        'overflow-y-auto h-[calc(100vh-56px)] pt-4 px-4',
        className,
      )}
    >
      {children}
    </div>
  );
};
