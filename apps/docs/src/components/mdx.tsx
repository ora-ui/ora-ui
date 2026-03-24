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
  CheckIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
} from '@heroicons/react/16/solid';
import type { MDXComponents } from 'mdx/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Badge,
    Button,
    ButtonGroup,
    ButtonGroupSeparator,
    ButtonGroupText,
    Kbd,
    KbdGroup,
    Input,
    Label,
    Textarea,
    Toggle,
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
    CheckIcon,
    CheckCircleIcon,
    ClockIcon,
    EyeIcon,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
