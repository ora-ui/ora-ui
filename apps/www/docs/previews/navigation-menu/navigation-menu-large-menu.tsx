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

const REGIONS = [
  'Amsterdam',
  'Auckland',
  'Berlin',
  'Buenos Aires',
  'Cairo',
  'Cape Town',
  'Copenhagen',
  'Dubai',
  'Dublin',
  'Helsinki',
  'Hong Kong',
  'Istanbul',
  'Lagos',
  'Lisbon',
  'London',
  'Madrid',
  'Mexico City',
  'Mumbai',
  'Nairobi',
  'New York',
  'Oslo',
  'Paris',
  'Reykjavik',
  'Rio de Janeiro',
  'Seoul',
  'Singapore',
  'Stockholm',
  'Sydney',
  'Tokyo',
  'Toronto',
];

export default function NavigationMenuLargeMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Locations</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-64 gap-0.5">
              {REGIONS.map((region) => (
                <li key={region}>
                  <NavigationMenuLink href="#">{region}</NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}
