'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/core/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '~/core/components/ui/sidebar';

export interface MenuItemProps {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  subMenuItem?: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}
interface MenuProps {
  items: MenuItemProps[];
  label?: string;
}

export function MainMenu({ items }: MenuProps) {
  const pathname = usePathname();

  const isActiveUrl = useMemo(() => {
    return (url: string) => {
      return pathname === url || pathname.startsWith(`${url}/`);
    };
  }, [pathname]);

  return (
    <SidebarGroup className={'overflow-hidden'}>
      <SidebarMenu>
        {items.map((item) => {
          if (!item?.subMenuItem) {
            return (
              <Link href={item.url} key={item.title}>
                <SidebarMenuButton
                  isActive={isActiveUrl(item.url)}
                  tooltip={item.title}
                >
                  {item.icon && <item.icon />}
                  <span className={'font-medium'}>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            );
          }
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActiveUrl(item.url)}
                  >
                    {item.icon && <item.icon />}
                    <span className={'font-medium'}>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.subMenuItem?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActiveUrl(subItem.url)}
                        >
                          <Link href={subItem.url}>
                            {subItem.icon && <subItem.icon size={16} />}
                            <span className={'font-medium'}>
                              {subItem.title}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
