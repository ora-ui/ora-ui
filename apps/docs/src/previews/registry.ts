import type React from 'react';
import ButtonVariants from './button/button-variants';
import ButtonTheme from './button/button-theme';
import ButtonWithIcon from './button/button-with-icon';
import ButtonIconButton from './button/button-icon-button';
import ButtonGroupDefault from './button-group/button-group-default';
import ButtonGroupVertical from './button-group/button-group-vertical';
import ButtonGroupWithIcons from './button-group/button-group-with-icons';
import ButtonGroupIconButtons from './button-group/button-group-icon-buttons';
import ButtonGroupWithSeparator from './button-group/button-group-with-separator';
import ButtonGroupWithText from './button-group/button-group-with-text';
import BadgeVariants from './badge/badge-variants';
import BadgeTheme from './badge/badge-theme';
import BadgeWithIcon from './badge/badge-with-icon';
import BadgeIconOnly from './badge/badge-icon-only';
import BadgeAsLink from './badge/badge-as-link';

export const registry: Record<string, React.ComponentType> = {
  'button-variants': ButtonVariants,
  'button-theme': ButtonTheme,
  'button-with-icon': ButtonWithIcon,
  'button-icon-button': ButtonIconButton,
  'button-group-default': ButtonGroupDefault,
  'button-group-vertical': ButtonGroupVertical,
  'button-group-with-icons': ButtonGroupWithIcons,
  'button-group-icon-buttons': ButtonGroupIconButtons,
  'button-group-with-separator': ButtonGroupWithSeparator,
  'button-group-with-text': ButtonGroupWithText,
  'badge-variants': BadgeVariants,
  'badge-theme': BadgeTheme,
  'badge-with-icon': BadgeWithIcon,
  'badge-icon-only': BadgeIconOnly,
  'badge-as-link': BadgeAsLink,
};
