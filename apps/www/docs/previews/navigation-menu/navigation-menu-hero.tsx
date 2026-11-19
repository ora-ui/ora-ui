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

const PRODUCT_LINKS = [
  { title: 'Analytics', description: 'Track traffic and conversions across every page.' },
  { title: 'Automations', description: 'Send follow-ups when a visitor takes an action.' },
  { title: 'Integrations', description: 'Connect the tools your team already uses.' },
];

const RESOURCE_LINKS = [
  { title: 'Guides', description: 'Step-by-step walkthroughs for common setups.' },
  { title: 'API reference', description: 'Every endpoint, with request and response examples.' },
  { title: 'Changelog', description: 'What shipped this month.' },
];

function LinkCard({ title, description }: { title: string; description: string }) {
  return (
    <li>
      <NavigationMenuLink href="#">
        <span className="font-medium">{title}</span>
        <span className="text-secondary">{description}</span>
      </NavigationMenuLink>
    </li>
  );
}

export default function NavigationMenuHero() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-80 gap-1">
              {PRODUCT_LINKS.map((link) => (
                <LinkCard key={link.title} {...link} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-80 gap-1">
              {RESOURCE_LINKS.map((link) => (
                <LinkCard key={link.title} {...link} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}
