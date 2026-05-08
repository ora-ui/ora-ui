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
import CheckboxHero from './checkbox/checkbox-hero';
import CheckboxDefault from './checkbox/checkbox-default';
import CheckboxVariantDefault, {
  Solid as CheckboxVariantSolid,
  Surface as CheckboxVariantSurface,
} from './checkbox/checkbox-variant';
import CheckboxThemeDefault, {
  Gray as CheckboxThemeGray,
  Accent as CheckboxThemeAccent,
} from './checkbox/checkbox-theme';
import CheckboxIndeterminate from './checkbox/checkbox-indeterminate';
import CheckboxGroupHero from './checkbox-group/checkbox-group-hero';
import CheckboxGroupDefault from './checkbox-group/checkbox-group-default';
import CheckboxGroupVariantDefault, {
  Solid as CheckboxGroupVariantSolid,
  Surface as CheckboxGroupVariantSurface,
} from './checkbox-group/checkbox-group-variant';
import CheckboxGroupThemeDefault, {
  Gray as CheckboxGroupThemeGray,
  Accent as CheckboxGroupThemeAccent,
} from './checkbox-group/checkbox-group-theme';
import CheckboxGroupParent from './checkbox-group/checkbox-group-parent';
import CheckboxGroupNested from './checkbox-group/checkbox-group-nested';
import DialogHero from './dialog/dialog-hero';
import DialogDefault from './dialog/dialog-default';
import DialogScrollable from './dialog/dialog-scrollable';
import FormHero from './form/form-hero';
import FormProduct from './form/form-product';
import InputHero from './input/input-hero';
import InputVariantDefault, {
  Outline as InputVariantOutline,
  Soft as InputVariantSoft,
} from './input/input-variant';
import KbdHero from './kbd/kbd-hero';
import KbdCombination from './kbd/kbd-combination';
import KbdVariantDefault, {
  Ghost as KbdVariantGhost,
  Surface as KbdVariantSurface,
} from './kbd/kbd-variant';
import RadioGroupHero from './radio-group/radio-group-hero';
import RadioGroupVariantDefault, {
  Surface as RadioGroupVariantSurface,
} from './radio-group/radio-group-variant';
import SeparatorHero from './separator/separator-hero';
import SeparatorVertical from './separator/separator-vertical';
import SeparatorHorizontal from './separator/separator-horizontal';
import ToggleGroupHero from './toggle-group/toggle-group-hero';
import ToggleGroupVariantsDefault, {
  Outline as ToggleGroupVariantsOutline,
  Solid as ToggleGroupVariantsSolid,
} from './toggle-group/toggle-group-variants';
import ToggleGroupConnected from './toggle-group/toggle-group-connected';
import ToggleGroupVertical from './toggle-group/toggle-group-vertical';
import SwitchHero from './switch/switch-hero';
import SwitchWithLabel from './switch/switch-with-label';
import SwitchThemeDefault, {
  Gray as SwitchThemeGray,
  Accent as SwitchThemeAccent,
} from './switch/switch-theme';

// @scaffold:imports
import DropdownMenuHero from './dropdown-menu/dropdown-menu-hero';
import DropdownMenuBasic from './dropdown-menu/dropdown-menu-basic';
import DropdownMenuVariantDefault, {
  Soft as DropdownMenuVariantSoft,
  Solid as DropdownMenuVariantSolid,
} from './dropdown-menu/dropdown-menu-variant';
import DropdownMenuThemeDefault, {
  Gray as DropdownMenuThemeGray,
  Accent as DropdownMenuThemeAccent,
} from './dropdown-menu/dropdown-menu-theme';
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
import ToggleHero from './toggle/toggle-hero';
import ToggleVariantDefault, {
  Outline as ToggleVariantOutline,
  Solid as ToggleVariantSolid,
} from './toggle/toggle-variant';
import TextareaHero from './textarea/textarea-hero';
import TextareaVariantDefault, {
  Outline as TextareaVariantOutline,
  Soft as TextareaVariantSoft,
} from './textarea/textarea-variant';
import TextareaManualResize from './textarea/textarea-manual-resize';
import TextareaWithLabel from './textarea/textarea-with-label';
import TextareaWithButton from './textarea/textarea-with-button';

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
  'checkbox-hero': {
    component: CheckboxHero,
    source: readSource('checkbox/checkbox-hero.tsx'),
  },
  'checkbox-default': {
    component: CheckboxDefault,
    source: readSource('checkbox/checkbox-default.tsx'),
  },
  'checkbox-variant': {
    component: CheckboxVariantDefault,
    variants: { solid: CheckboxVariantSolid, surface: CheckboxVariantSurface },
    source: readSource('checkbox/checkbox-variant.tsx'),
  },
  'checkbox-theme': {
    component: CheckboxThemeDefault,
    variants: { gray: CheckboxThemeGray, accent: CheckboxThemeAccent },
    source: readSource('checkbox/checkbox-theme.tsx'),
  },
  'checkbox-indeterminate': {
    component: CheckboxIndeterminate,
    source: readSource('checkbox/checkbox-indeterminate.tsx'),
  },
  'checkbox-group-hero': {
    component: CheckboxGroupHero,
    source: readSource('checkbox-group/checkbox-group-hero.tsx'),
  },
  'checkbox-group-default': {
    component: CheckboxGroupDefault,
    source: readSource('checkbox-group/checkbox-group-default.tsx'),
  },
  'checkbox-group-variant': {
    component: CheckboxGroupVariantDefault,
    variants: { solid: CheckboxGroupVariantSolid, surface: CheckboxGroupVariantSurface },
    source: readSource('checkbox-group/checkbox-group-variant.tsx'),
  },
  'checkbox-group-theme': {
    component: CheckboxGroupThemeDefault,
    variants: { gray: CheckboxGroupThemeGray, accent: CheckboxGroupThemeAccent },
    source: readSource('checkbox-group/checkbox-group-theme.tsx'),
  },
  'checkbox-group-parent': {
    component: CheckboxGroupParent,
    source: readSource('checkbox-group/checkbox-group-parent.tsx'),
  },
  'checkbox-group-nested': {
    component: CheckboxGroupNested,
    source: readSource('checkbox-group/checkbox-group-nested.tsx'),
  },
  'dialog-hero': {
    component: DialogHero,
    source: readSource('dialog/dialog-hero.tsx'),
  },
  'dialog-default': {
    component: DialogDefault,
    source: readSource('dialog/dialog-default.tsx'),
  },
  'dialog-scrollable': {
    component: DialogScrollable,
    source: readSource('dialog/dialog-scrollable.tsx'),
  },
  'form-hero': {
    component: FormHero,
    source: readSource('form/form-hero.tsx'),
  },
  'form-product': {
    component: FormProduct,
    source: readSource('form/form-product.tsx'),
  },
  'input-hero': {
    component: InputHero,
    source: readSource('input/input-hero.tsx'),
  },
  'input-variant': {
    component: InputVariantDefault,
    variants: {
      surface: InputVariantDefault,
      outline: InputVariantOutline,
      soft: InputVariantSoft,
    },
    source: readSource('input/input-variant.tsx'),
  },
  'kbd-hero': {
    component: KbdHero,
    source: readSource('kbd/kbd-hero.tsx'),
  },
  'kbd-combination': {
    component: KbdCombination,
    source: readSource('kbd/kbd-combination.tsx'),
  },
  'kbd-variant': {
    component: KbdVariantDefault,
    variants: { soft: KbdVariantDefault, surface: KbdVariantSurface, ghost: KbdVariantGhost },
    source: readSource('kbd/kbd-variant.tsx'),
  },
  'radio-group-hero': {
    component: RadioGroupHero,
    source: readSource('radio-group/radio-group-hero.tsx'),
  },
  'radio-group-variant': {
    component: RadioGroupVariantDefault,
    variants: { solid: RadioGroupVariantDefault, surface: RadioGroupVariantSurface },
    source: readSource('radio-group/radio-group-variant.tsx'),
  },
  'separator-hero': {
    component: SeparatorHero,
    source: readSource('separator/separator-hero.tsx'),
  },
  'separator-vertical': {
    component: SeparatorVertical,
    source: readSource('separator/separator-vertical.tsx'),
  },
  'separator-horizontal': {
    component: SeparatorHorizontal,
    source: readSource('separator/separator-horizontal.tsx'),
  },
  'toggle-group-hero': {
    component: ToggleGroupHero,
    source: readSource('toggle-group/toggle-group-hero.tsx'),
  },
  'toggle-group-variants': {
    component: ToggleGroupVariantsDefault,
    variants: {
      soft: ToggleGroupVariantsDefault,
      outline: ToggleGroupVariantsOutline,
      solid: ToggleGroupVariantsSolid,
    },
    source: readSource('toggle-group/toggle-group-variants.tsx'),
  },
  'toggle-group-connected': {
    component: ToggleGroupConnected,
    source: readSource('toggle-group/toggle-group-connected.tsx'),
  },
  'toggle-group-vertical': {
    component: ToggleGroupVertical,
    source: readSource('toggle-group/toggle-group-vertical.tsx'),
  },
  'switch-hero': {
    component: SwitchHero,
    source: readSource('switch/switch-hero.tsx'),
  },
  'switch-with-label': {
    component: SwitchWithLabel,
    source: readSource('switch/switch-with-label.tsx'),
  },
  'switch-theme': {
    component: SwitchThemeDefault,
    variants: {
      gray: SwitchThemeGray,
      accent: SwitchThemeAccent,
    },
    source: readSource('switch/switch-theme.tsx'),
  },
  // @scaffold:entries
  'dropdown-menu-hero': {
    component: DropdownMenuHero,
    source: readSource('dropdown-menu/dropdown-menu-hero.tsx'),
  },
  'dropdown-menu-basic': {
    component: DropdownMenuBasic,
    source: readSource('dropdown-menu/dropdown-menu-basic.tsx'),
  },
  'dropdown-menu-variant': {
    component: DropdownMenuVariantDefault,
    variants: { soft: DropdownMenuVariantSoft, solid: DropdownMenuVariantSolid },
    source: readSource('dropdown-menu/dropdown-menu-variant.tsx'),
  },
  'dropdown-menu-theme': {
    component: DropdownMenuThemeDefault,
    variants: { gray: DropdownMenuThemeGray, accent: DropdownMenuThemeAccent },
    source: readSource('dropdown-menu/dropdown-menu-theme.tsx'),
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
  'toggle-hero': {
    component: ToggleHero,
    source: readSource('toggle/toggle-hero.tsx'),
  },
  'toggle-variant': {
    component: ToggleVariantDefault,
    variants: {
      soft: ToggleVariantDefault,
      outline: ToggleVariantOutline,
      solid: ToggleVariantSolid,
    },
    source: readSource('toggle/toggle-variant.tsx'),
  },
  'textarea-hero': {
    component: TextareaHero,
    source: readSource('textarea/textarea-hero.tsx'),
  },
  'textarea-variant': {
    component: TextareaVariantDefault,
    variants: {
      surface: TextareaVariantDefault,
      outline: TextareaVariantOutline,
      soft: TextareaVariantSoft,
    },
    source: readSource('textarea/textarea-variant.tsx'),
  },
  'textarea-manual-resize': {
    component: TextareaManualResize,
    source: readSource('textarea/textarea-manual-resize.tsx'),
  },
  'textarea-with-label': {
    component: TextareaWithLabel,
    source: readSource('textarea/textarea-with-label.tsx'),
  },
  'textarea-with-button': {
    component: TextareaWithButton,
    source: readSource('textarea/textarea-with-button.tsx'),
  },
};
