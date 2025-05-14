'use client';

import {
  AudioWaveform,
  ChartPieIcon,
  Command,
  GalleryVerticalEnd,
  LucideStore,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';
import * as React from 'react';
import { useMemo } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '~/core/components/ui/sidebar';

import {
  MainMenu,
  MenuItemProps,
  NavUser,
  RestaurantSwitch,
} from './components';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const itemsRestaurent = useMemo(() => {
    return [
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup',
      },
      {
        name: 'Evil Corp.',
        logo: Command,
        plan: 'Free',
      },
    ];
  }, []);

  const itemsMenu = useMemo(() => {
    return [
      {
        title: 'Nhà Hàng',
        url: '/restaurants',
        icon: LucideStore,
      },
      {
        title: 'Báo cáo thống kê',
        icon: ChartPieIcon,
        url: '/reports',
      },
      {
        title: 'Cài đặt chung',
        icon: SettingsIcon,
        isActive: true,
        subMenuItem: [
          {
            title: 'Nhân viên',
            icon: UserIcon,
            url: '/user',
          },
        ],
      },
    ] as MenuItemProps[];
  }, []);

  return (
    <Sidebar collapsible={'icon'} {...props}>
      <SidebarHeader>
        <RestaurantSwitch teams={itemsRestaurent} />
      </SidebarHeader>
      <SidebarContent>
        <MainMenu items={itemsMenu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
