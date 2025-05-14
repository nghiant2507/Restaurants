import { ReactNode } from 'react';

import { AppSidebar } from '~/components/AppSideBar';
import { SidebarInset, SidebarProvider } from '~/core/components/ui/sidebar';
import { useAuth } from '~/core/hooks';

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  if (!user?.user_metadata) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};
