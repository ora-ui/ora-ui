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

const SECTIONS = [
  { heading: 'Getting started', links: ['Installation', 'Quick start', 'Theming'] },
  { heading: 'Components', links: ['Button', 'Dialog', 'Tabs'] },
];

const THEMING_LINKS = ['Colors', 'Radius'];

export default function NavigationMenuNested() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-80 gap-3">
              {SECTIONS.map((section) => (
                <div key={section.heading} className="grid gap-1">
                  <p className="px-3 text-xs text-secondary">{section.heading}</p>
                  <ul className="grid gap-0.5">
                    {section.links.map((link) => (
                      <li key={link}>
                        <NavigationMenuLink href="#">{link}</NavigationMenuLink>
                        {link === 'Theming' && (
                          <ul className="mt-0.5 ml-3 grid gap-0.5 border-l border-line pl-1">
                            {THEMING_LINKS.map((child) => (
                              <li key={child}>
                                <NavigationMenuLink href="#">{child}</NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}
