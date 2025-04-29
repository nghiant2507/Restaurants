import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import { AdminLayout } from '~/components/Layout/LayoutAdmin';
import { Spinner } from '~/core/components/ui/spinner';
import { useAuth } from '~/core/hooks';

export const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  const { isLoading, checkAuth } = useAuth();
  const pathname = usePathname();
  useEffect(() => {
    (async () => {
      await checkAuth();
    })();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner color="primary" />
      </div>
    );
  }

  const renderView = () => {
    if (pathname === '/auth') {
      return children;
    }
    return <AdminLayout>{children}</AdminLayout>;
  };

  return (
    <div className={'w-screen h-screen overflow-hidden'}>{renderView()}</div>
  );
};
