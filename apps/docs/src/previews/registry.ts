import type React from 'react';
import fs from 'fs';
import path from 'path';
import AccordionHero from './accordion/accordion-hero';
import AccordionDefault from './accordion/accordion-default';
import AccordionMultiple from './accordion/accordion-multiple';
import AlertDialogHero from './alert-dialog/alert-dialog-hero';
import AlertDialogDefault from './alert-dialog/alert-dialog-default';
import AlertDialogWithIcon from './alert-dialog/alert-dialog-with-icon';
import AvatarHero from './avatar/avatar-hero';
import AvatarDefault from './avatar/avatar-default';
import AvatarSizeDefault, { Sm as AvatarSizeSm, Lg as AvatarSizeLg } from './avatar/avatar-size';
import AvatarWithBadge from './avatar/avatar-with-badge';
import AvatarGroup from './avatar/avatar-group';

// @scaffold:imports
import DropdownMenuBasic from './dropdown-menu/dropdown-menu-basic';
import ButtonHero from './button/button-hero';
import ButtonVariantsDefault, {
  Solid as ButtonVariantsSolid,
  Outline as ButtonVariantsOutline,
  Surface as ButtonVariantsSurface,
  Soft as ButtonVariantsSoft,
  Ghost as ButtonVariantsGhost,
} from './button/button-variants';
import ButtonThemeDefault, {
  Gray as ButtonThemeGray,
  Accent as ButtonThemeAccent,
  Destructive as ButtonThemeDestructive,
} from './button/button-theme';
import ButtonWithIconDefault, {
  Leading as ButtonWithIconLeading,
  Trailing as ButtonWithIconTrailing,
} from './button/button-with-icon';
import ButtonIconButton from './button/button-icon-button';
import ButtonGroupHero from './button-group/button-group-hero';
import ButtonGroupDefault from './button-group/button-group-default';
import ButtonGroupVertical from './button-group/button-group-vertical';
import ButtonGroupWithIcons from './button-group/button-group-with-icons';
import ButtonGroupIconButtons from './button-group/button-group-icon-buttons';
import ButtonGroupWithSeparator from './button-group/button-group-with-separator';
import ButtonGroupWithText from './button-group/button-group-with-text';
import BadgeHero from './badge/badge-hero';
import BadgeVariantsDefault, {
  Solid as BadgeVariantsSolid,
  Outline as BadgeVariantsOutline,
  Surface as BadgeVariantsSurface,
  Soft as BadgeVariantsSoft,
} from './badge/badge-variants';
import BadgeThemeDefault, {
  Gray as BadgeThemeGray,
  Accent as BadgeThemeAccent,
  Destructive as BadgeThemeDestructive,
  Warning as BadgeThemeWarning,
  Success as BadgeThemeSuccess,
} from './badge/badge-theme';
import BadgeWithIconDefault, {
  Leading as BadgeWithIconLeading,
  Trailing as BadgeWithIconTrailing,
} from './badge/badge-with-icon';
import BadgeIconOnly from './badge/badge-icon-only';
import BadgeAsLink from './badge/badge-as-link';

const previewsDir = path.join(process.cwd(), 'src/previews');

function readSource(subpath: string): string {
  return fs.readFileSync(path.join(previewsDir, subpath), 'utf-8');
}

interface RegistryEntry {
  component: React.ComponentType;
  variants?: Record<string, React.ComponentType>;
  source: string;
}

export const registry: Record<string, RegistryEntry> = {
  'accordion-hero': {
    component: AccordionHero,
    source: readSource('accordion/accordion-hero.tsx'),
  },
  'accordion-default': {
    component: AccordionDefault,
    source: readSource('accordion/accordion-default.tsx'),
  },
  'accordion-multiple': {
    component: AccordionMultiple,
    source: readSource('accordion/accordion-multiple.tsx'),
  },
  'alert-dialog-hero': {
    component: AlertDialogHero,
    source: readSource('alert-dialog/alert-dialog-hero.tsx'),
  },
  'alert-dialog-default': {
    component: AlertDialogDefault,
    source: readSource('alert-dialog/alert-dialog-default.tsx'),
  },
  'alert-dialog-with-icon': {
    component: AlertDialogWithIcon,
    source: readSource('alert-dialog/alert-dialog-with-icon.tsx'),
  },
  'avatar-hero': {
    component: AvatarHero,
    source: readSource('avatar/avatar-hero.tsx'),
  },
  'avatar-default': {
    component: AvatarDefault,
    source: readSource('avatar/avatar-default.tsx'),
  },
  'avatar-size': {
    component: AvatarSizeDefault,
    variants: { default: AvatarSizeDefault, sm: AvatarSizeSm, lg: AvatarSizeLg },
    source: readSource('avatar/avatar-size.tsx'),
  },
  'avatar-with-badge': {
    component: AvatarWithBadge,
    source: readSource('avatar/avatar-with-badge.tsx'),
  },
  'avatar-group': {
    component: AvatarGroup,
    source: readSource('avatar/avatar-group.tsx'),
  },
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
    component: ButtonVariantsDefault,
    variants: {
      solid: ButtonVariantsSolid,
      outline: ButtonVariantsOutline,
      surface: ButtonVariantsSurface,
      soft: ButtonVariantsSoft,
      ghost: ButtonVariantsGhost,
    },
    source: readSource('button/button-variants.tsx'),
  },
  'button-theme': {
    component: ButtonThemeDefault,
    variants: {
      gray: ButtonThemeGray,
      accent: ButtonThemeAccent,
      destructive: ButtonThemeDestructive,
    },
    source: readSource('button/button-theme.tsx'),
  },
  'button-with-icon': {
    component: ButtonWithIconDefault,
    variants: {
      leading: ButtonWithIconLeading,
      trailing: ButtonWithIconTrailing,
    },
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
  'badge-variants': {
    component: BadgeVariantsDefault,
    variants: {
      solid: BadgeVariantsSolid,
      outline: BadgeVariantsOutline,
      surface: BadgeVariantsSurface,
      soft: BadgeVariantsSoft,
    },
    source: readSource('badge/badge-variants.tsx'),
  },
  'badge-theme': {
    component: BadgeThemeDefault,
    variants: {
      gray: BadgeThemeGray,
      accent: BadgeThemeAccent,
      destructive: BadgeThemeDestructive,
      warning: BadgeThemeWarning,
      success: BadgeThemeSuccess,
    },
    source: readSource('badge/badge-theme.tsx'),
  },
  'badge-with-icon': {
    component: BadgeWithIconDefault,
    variants: {
      leading: BadgeWithIconLeading,
      trailing: BadgeWithIconTrailing,
    },
    source: readSource('badge/badge-with-icon.tsx'),
  },
  'badge-icon-only': { component: BadgeIconOnly, source: readSource('badge/badge-icon-only.tsx') },
  'badge-as-link': { component: BadgeAsLink, source: readSource('badge/badge-as-link.tsx') },
};
