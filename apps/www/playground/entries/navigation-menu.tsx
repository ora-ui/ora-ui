import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/registry/ui/navigation-menu';
import type { EntrySchema } from '@/playground/lib/types';

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

type PanelLink = { title: string; description: string };

function Panel({ links }: { links: PanelLink[] }) {
  return (
    <ul className="grid w-80 gap-1">
      {links.map((link) => (
        <li key={link.title}>
          <NavigationMenuLink href="#">
            <span className="font-medium">{link.title}</span>
            <span className="text-secondary">{link.description}</span>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  );
}

export const navigationMenuEntry: EntrySchema = {
  component: 'navigation-menu',
  name: 'Navigation Menu',
  variants: {},
  behavior: {
    orientation: {
      values: ['horizontal', 'vertical'],
      label: 'Orientation',
      default: 'horizontal',
    },
    delay: {
      values: ['0', '50', '200', '500'],
      label: 'Open delay',
      default: '50',
    },
    closeDelay: {
      values: ['0', '50', '200', '500'],
      label: 'Close delay',
      default: '50',
    },
  },
  content: {
    side: {
      type: 'select',
      label: 'Side',
      values: ['bottom', 'top', 'left', 'right'],
      default: 'bottom',
    },
    align: {
      type: 'select',
      label: 'Align',
      values: ['start', 'center', 'end'],
      default: 'start',
    },
    sideOffset: {
      type: 'select',
      label: 'Side offset',
      values: ['0', '4', '8', '16'],
      default: '8',
    },
  },
  render: function NavigationMenuRender({ behavior, inputs }) {
    return (
      <NavigationMenu
        orientation={behavior.orientation as 'horizontal' | 'vertical'}
        delay={Number(behavior.delay)}
        closeDelay={Number(behavior.closeDelay)}
      >
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <Panel links={PRODUCT_LINKS} />
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <Panel links={RESOURCE_LINKS} />
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport
          side={inputs.side as 'top' | 'bottom' | 'left' | 'right'}
          align={inputs.align as 'start' | 'center' | 'end'}
          sideOffset={Number(inputs.sideOffset)}
        />
      </NavigationMenu>
    );
  },
};
