'use client';

import Link from 'next/link';
import type * as React from 'react';

import { Button } from '~/core/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '~/core/components/ui/navigation-menu';
import { cn } from '~/lib/utils';

export interface ItemMenuProps {
  name: string;
  icon?: React.ReactNode;
  types: 'button' | 'link';
  link?: string;
  onClick?: () => void;
  itemsChild?: ItemMenuProps[];
}

export const Menu = ({ items }: { items: ItemMenuProps[] }) => {
  return (
    <div className={'items-center gap-3 text-black hidden sm:flex'}>
      <NavigationMenu>
        <NavigationMenuList>
          {items.map((item, index) => {
            if (item.itemsChild && item.itemsChild.length > 0) {
              return (
                <NavigationMenuItem key={index}>
                  <NavigationMenuTrigger className="flex items-center gap-2">
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-4">
                      {item.itemsChild.map((childItem, childIndex) => (
                        <li key={childIndex}>
                          {childItem.types === 'link' && childItem.link ? (
                            <>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={childItem.link}
                                  className={navigationMenuTriggerStyle()}
                                >
                                  {childItem.icon && (
                                    <span>{childItem.icon}</span>
                                  )}
                                  <span>{childItem.name}</span>
                                </Link>
                              </NavigationMenuLink>
                            </>
                          ) : (
                            <Button
                              className="flex items-center justify-start gap-2 w-full"
                              variant="default"
                              onClick={childItem.onClick}
                            >
                              {childItem.icon && <span>{childItem.icon}</span>}
                              {childItem.name}
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            }

            // For items without children
            return (
              <NavigationMenuItem key={index}>
                {item.types === 'link' && item.link ? (
                  <Link href={item.link} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(navigationMenuTriggerStyle())}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon && <span>{item.icon}</span>}
                        {item.name}
                      </span>
                    </NavigationMenuLink>
                  </Link>
                ) : (
                  <Button
                    type={'button'}
                    onClick={item.onClick}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    {item.icon && <span>{item.icon}</span>}
                    {item.name}
                  </Button>
                )}
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
