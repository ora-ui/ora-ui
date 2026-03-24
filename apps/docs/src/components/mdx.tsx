import defaultMdxComponents from 'fumadocs-ui/mdx';
import {
  CloudArrowUpIcon,
  PlusCircleIcon,
  PlusIcon,
  MinusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PencilSquareIcon,
  ShareIcon,
  BookmarkIcon,
} from '@heroicons/react/16/solid';
import type { MDXComponents } from 'mdx/types';
import { Button } from '@/components/ui/button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '@/components/ui/button-group';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Button,
    ButtonGroup,
    ButtonGroupSeparator,
    ButtonGroupText,
    Kbd,
    KbdGroup,
    Separator,
    PlusCircleIcon,
    PlusIcon,
    MinusIcon,
    CloudArrowUpIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    PencilSquareIcon,
    ShareIcon,
    BookmarkIcon,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
