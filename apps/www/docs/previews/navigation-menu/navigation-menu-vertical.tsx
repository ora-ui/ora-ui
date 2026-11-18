'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/registry/ui/navigation-menu';

export default function NavigationMenuVertical() {
  return (
    <NavigationMenu orientation="vertical">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" active>
            Dashboard
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="w-full justify-between">Reports</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-56 gap-0.5">
              <li>
                <NavigationMenuLink href="#">Weekly summary</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Revenue</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Exports</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Team</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport side="right" align="start" sideOffset={8} />
    </NavigationMenu>
  );
}
