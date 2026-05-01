import * as React from 'react';
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
import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
} from '@radix-ui/react-icons';
import type { MDXComponents } from 'mdx/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    // HTML element overrides
    h1: ({ className, ...props }: React.ComponentProps<'h1'>) => (
      <h1
        className={cn('text-3xl font-semibold tracking-tight text-primary', className)}
        {...props}
      />
    ),
    h2: ({ className, ...props }: React.ComponentProps<'h2'>) => (
      <h2
        className={cn(
          'mt-10 mb-4 scroll-m-20 text-2xl font-semibold tracking-tight text-primary',
          '[&+h3]:mt-4 [&+p]:mt-3',
          className
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }: React.ComponentProps<'h3'>) => (
      <h3
        className={cn(
          'mt-8 mb-3 scroll-m-20 text-xl font-medium tracking-tight text-primary',
          '[&+p]:mt-2',
          className
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }: React.ComponentProps<'h4'>) => (
      <h4
        className={cn('mt-6 mb-2 scroll-m-20 text-lg font-medium text-primary', className)}
        {...props}
      />
    ),
    h5: ({ className, ...props }: React.ComponentProps<'h5'>) => (
      <h5
        className={cn('mt-4 mb-2 scroll-m-20 text-base font-medium text-primary', className)}
        {...props}
      />
    ),
    h6: ({ className, ...props }: React.ComponentProps<'h6'>) => (
      <h6
        className={cn('mt-4 mb-2 scroll-m-20 text-base font-medium text-primary', className)}
        {...props}
      />
    ),
    p: ({ className, ...props }: React.ComponentProps<'p'>) => (
      <p className={cn('leading-relaxed not-first:mt-6', className)} {...props} />
    ),
    strong: ({ className, ...props }: React.ComponentProps<'strong'>) => (
      <strong className={cn('font-semibold', className)} {...props} />
    ),
    a: ({ className, ...props }: React.ComponentProps<'a'>) => (
      <a
        className={cn('font-medium underline underline-offset-4 hover:text-secondary', className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }: React.ComponentProps<'ul'>) => (
      <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
    ),
    ol: ({ className, ...props }: React.ComponentProps<'ol'>) => (
      <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
    ),
    li: ({ className, ...props }: React.ComponentProps<'li'>) => (
      <li className={cn('mt-2', className)} {...props} />
    ),
    blockquote: ({ className, ...props }: React.ComponentProps<'blockquote'>) => (
      <blockquote
        className={cn('mt-6 border-l-2 border-line pl-6 italic text-secondary', className)}
        {...props}
      />
    ),
    hr: ({ className, ...props }: React.ComponentProps<'hr'>) => (
      <hr className={cn('my-8 border-line', className)} {...props} />
    ),
    table: ({ className, ...props }: React.ComponentProps<'table'>) => (
      <div className="my-6 w-full overflow-y-auto rounded-xl border border-line">
        <table className={cn('relative w-full overflow-hidden text-sm', className)} {...props} />
      </div>
    ),
    tr: ({ className, ...props }: React.ComponentProps<'tr'>) => (
      <tr className={cn('m-0 border-b border-line p-0', className)} {...props} />
    ),
    th: ({ className, ...props }: React.ComponentProps<'th'>) => (
      <th
        className={cn(
          'px-4 py-2 text-left font-semibold [&[align=center]]:text-center [&[align=right]]:text-right',
          className
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }: React.ComponentProps<'td'>) => (
      <td
        className={cn(
          'px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
          className
        )}
        {...props}
      />
    ),
    // Ora UI components
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
    ToggleGroup,
    ToggleGroupItem,
    Separator,
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
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
    FontBoldIcon,
    FontItalicIcon,
    UnderlineIcon,
    StrikethroughIcon,
    TextAlignLeftIcon,
    TextAlignCenterIcon,
    TextAlignRightIcon,
    TextAlignJustifyIcon,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
