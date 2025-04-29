import { ReactNode } from 'react';

import { AppSidebar } from '~/components/AppSideBar';
import { Header } from '~/components/Header';
import { Button } from '~/core/components/ui/button';
import { SidebarProvider } from '~/core/components/ui/sidebar';
import { useAuth } from '~/core/hooks';

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, user } = useAuth();
  if (!user?.user_metadata) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full h-screen overflow-y-auto">
        <Header />
        <main className="p-4">
          {children}
          <div className="mt-4">
            <Button onClick={signOut} type="button" variant="destructive">
              Đăng xuất
            </Button>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
