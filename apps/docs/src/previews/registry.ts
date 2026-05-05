import type React from 'react';
import fs from 'fs';
import path from 'path';

// @scaffold:imports
import DropdownMenuBasic from './dropdown-menu/dropdown-menu-basic';
import ButtonHero from './button/button-hero';
import ButtonVariants from './button/button-variants';
import ButtonTheme from './button/button-theme';
import ButtonWithIcon from './button/button-with-icon';
import ButtonIconButton from './button/button-icon-button';
import ButtonGroupHero from './button-group/button-group-hero';
import ButtonGroupDefault from './button-group/button-group-default';
import ButtonGroupVertical from './button-group/button-group-vertical';
import ButtonGroupWithIcons from './button-group/button-group-with-icons';
import ButtonGroupIconButtons from './button-group/button-group-icon-buttons';
import ButtonGroupWithSeparator from './button-group/button-group-with-separator';
import ButtonGroupWithText from './button-group/button-group-with-text';
import BadgeHero from './badge/badge-hero';
import BadgeVariants from './badge/badge-variants';
import BadgeTheme from './badge/badge-theme';
import BadgeWithIcon from './badge/badge-with-icon';
import BadgeIconOnly from './badge/badge-icon-only';
import BadgeAsLink from './badge/badge-as-link';

const previewsDir = path.join(process.cwd(), 'src/previews');

function readSource(subpath: string): string {
  return fs.readFileSync(path.join(previewsDir, subpath), 'utf-8');
}

export const registry: Record<string, { component: React.ComponentType; source: string }> = {
  // @scaffold:entries
  'dropdown-menu-basic': {
    component: DropdownMenuBasic,
    source: readSource('dropdown-menu/dropdown-menu-basic.tsx'),
  },
  'button-hero': {
    component: ButtonHero,
    source: readSource('button/button-hero.tsx'),
  },
  'button-variants': {
    component: ButtonVariants,
    source: readSource('button/button-variants.tsx'),
  },
  'button-theme': { component: ButtonTheme, source: readSource('button/button-theme.tsx') },
  'button-with-icon': {
    component: ButtonWithIcon,
    source: readSource('button/button-with-icon.tsx'),
  },
  'button-icon-button': {
    component: ButtonIconButton,
    source: readSource('button/button-icon-button.tsx'),
  },
  'button-group-hero': {
    component: ButtonGroupHero,
    source: readSource('button-group/button-group-hero.tsx'),
  },
  'button-group-default': {
    component: ButtonGroupDefault,
    source: readSource('button-group/button-group-default.tsx'),
  },
  'button-group-vertical': {
    component: ButtonGroupVertical,
    source: readSource('button-group/button-group-vertical.tsx'),
  },
  'button-group-with-icons': {
    component: ButtonGroupWithIcons,
    source: readSource('button-group/button-group-with-icons.tsx'),
  },
  'button-group-icon-buttons': {
    component: ButtonGroupIconButtons,
    source: readSource('button-group/button-group-icon-buttons.tsx'),
  },
  'button-group-with-separator': {
    component: ButtonGroupWithSeparator,
    source: readSource('button-group/button-group-with-separator.tsx'),
  },
  'button-group-with-text': {
    component: ButtonGroupWithText,
    source: readSource('button-group/button-group-with-text.tsx'),
  },
  'badge-hero': { component: BadgeHero, source: readSource('badge/badge-hero.tsx') },
  'badge-variants': { component: BadgeVariants, source: readSource('badge/badge-variants.tsx') },
  'badge-theme': { component: BadgeTheme, source: readSource('badge/badge-theme.tsx') },
  'badge-with-icon': { component: BadgeWithIcon, source: readSource('badge/badge-with-icon.tsx') },
  'badge-icon-only': { component: BadgeIconOnly, source: readSource('badge/badge-icon-only.tsx') },
  'badge-as-link': { component: BadgeAsLink, source: readSource('badge/badge-as-link.tsx') },
};
